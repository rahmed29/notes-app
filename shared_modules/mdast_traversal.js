import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { mathFromMarkdown } from "mdast-util-math";
import { gfm } from "micromark-extension-gfm";
import { math } from "micromark-extension-math";
import { directive } from "micromark-extension-directive";
import { directiveFromMarkdown } from "mdast-util-directive";

export { queryAST, MDASTERQueryInstruction, astFromMarkdown, queryNotes, DFS };

// TODO, make this support <mark> might need to write a plugin
function astFromMarkdown(markdown) {
  return fromMarkdown(markdown, {
    extensions: [gfm(), math(), directive()],
    mdastExtensions: [
      gfmFromMarkdown(),
      mathFromMarkdown(),
      directiveFromMarkdown(),
    ],
  });
}

// This is a function for querying notes by going to the endpoint
async function queryNotes(name, page, instructions) {
  const response = await fetch("/api/query/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      page,
      // Conducts a series of operations on the AST derived from the markdown content of the note
      // You can figure out what attributes the AST contains by looking here: https://github.com/syntax-tree/mdast
      instructions,
    }),
  });
  const data = await response.json();
  return data;
}

// Simple DFS for finding a node that whose `attr` equals `value`
function DFS(node, attr, value) {
  if (!node) {
    return null;
  }
  if (node[attr] !== undefined && node[attr] === value) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = DFS(child, attr, value);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// TODO:
// Add ability to execute instructions conditionally
// Convert nodes to HTML??
class MDASTERQueryInstruction {
  #query;

  constructor() {
    this.#query = [];
    return this;
  }

  // get the AST without any modifications
  // Any instructions after this will be ignored
  ast() {
    this.#query.push({
      operation: "ast",
    });
    return this;
  }

  // filter nodes by attribute and value
  // Remember, the list of filterted nodes can contain node `x` and its children and parents, as long as they meet the criteria
  filter(attr, values) {
    this.#query.push({
      operation: "filter",
      type: "single",
      attr: attr,
      values: values,
    });
    return this;
  }

  filterMulti(attr, values) {
    this.#query.push({
      operation: "filter",
      type: "multiple",
      attr: attr, // ["type", "value"]
      values: values, // [["textDirective", "text"], ["ref", "test", "one"]],
    });
    return this;
  }

  // take you list of filtered nodes and slice them
  slice(start, end) {
    this.#query.push({
      operation: "slice",
      start: start,
      end: end,
    });
    return this;
  }

  // accumulate attributes of nodes into an array, this array is then pushed into the `accums` 2d array, which is included in the response
  // this does not accumulate recursively, only the top level nodes are accumulated
  accumulate(attr, legend) {
    this.#query.push({
      operation: "accumulate",
      attr,
      legend,
    });
    return this;
  }

  // Joins accumulated attributes into a single string with a delimiter
  /* example

      accums = [
        ["a", "b", "c"],
        ["1", "2", "3"],
      ]
      
      join("-") => ["a-1", "b-2", "c-3"]

  */
  join(delimiter) {
    this.#query.push({
      operation: "join",
      delimiter: delimiter,
    });
    return this;
  }

  // this selects nodes from the list of filtered nodes
  // selecting does nothing to the list, until you operate on it
  // can be a single number, an array, or "last" or "all"
  // This resets any previously selected nodes
  select(indices) {
    this.#query.push({
      operation: "select",
      indices: indices,
    });
    return this;
  }

  // Replaces the selected node(s) in the filtered list with it's parent (if it has one)
  ascend() {
    this.#query.push({
      operation: "operate",
      type: "ascend",
    });
    return this;
  }

  // Replaces the selected node(s) in the filtered list with it's first child (if it has one)
  descend() {
    this.#query.push({
      operation: "operate",
      type: "descend",
    });
    return this;
  }

  // Replaces the selected node(s) in the filtered list with it's previous sibling (if it has one)
  previousSibling() {
    this.#query.push({
      operation: "operate",
      type: "previousSibling",
    });
    return this;
  }

  // Replace the selected node(s) in the filtered list with it's next sibling (if it has one)
  nextSibling() {
    this.#query.push({
      operation: "operate",
      type: "nextSibling",
    });
    return this;
  }

  // returns the query as an array, which can be sent to the server in the `instructions` field of the body
  // Last method to call, I didn't make the query array public because I wanted to enforce this since it looks cleaner when chaining
  finalize() {
    return this.#query;
  }
}

// Attaches parent id to nodes so we can use ascend and descend and all that
function attachParent(node, currId = { num: 0 }) {
  currId.num++;
  node._id = currId.num;
  if (node.children) {
    node.children.forEach((child) => {
      child.parentId = currId.num;
    });
    node.children.forEach((child) => {
      attachParent(child, currId);
    });
  }
}

function validateNode(node, attr, acceptedValues, multiple) {
  if (multiple) {
    let flag = true;
    for (let i = 0; i < attr.length; i++) {
      if (!Array.isArray(acceptedValues[i])) {
        acceptedValues[i] = [acceptedValues[i]];
      }
      if (
        node[attr[i]] &&
        acceptedValues[i] &&
        acceptedValues[i].includes(node[attr[i]])
      ) {
        continue;
      } else {
        flag = false;
        break;
      }
    }
    return flag;
  } else {
    return node[attr] && acceptedValues.includes(node[attr].toString());
  }
}

// DFS but accumulates children into an array
function accumulateMatching(node, attr, acceptedValues, arr, multiple = false) {
  if (
    !attr ||
    attr.length === 0 ||
    !acceptedValues ||
    acceptedValues.length === 0
  ) {
    arr = arr.concat(node.children);
    return arr;
  }
  if (!node) {
    return arr;
  }

  if (validateNode(node, attr, acceptedValues, multiple)) {
    arr.push(node);
  }

  delete node.position;

  if (node && node.children) {
    node.children.forEach((child) => {
      // array is passed by reference and accumulates results
      accumulateMatching(child, attr, acceptedValues, arr, multiple);
    });
  }
  return arr;
}

// The main function that takes the root and instructions
function queryAST(root, instructions) {
  attachParent(root);
  let selectedNodes = [];
  let accums = [];
  let matchingNodes = {
    children: [root],
  };

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];

    if (instruction.operation === "ast") {
      return {
        matchingNodes: [root],
        accums: [],
      };
    }

    // Slice operation
    if (
      instruction.operation === "slice" &&
      instruction.start !== undefined &&
      instruction.end !== undefined
    ) {
      matchingNodes.children = matchingNodes.children.slice(
        instruction.start,
        instruction.end,
      );
    }

    // Filter operation
    else if (
      instruction.operation === "filter" &&
      instruction.type === "single" &&
      instruction.attr &&
      instruction.values
    ) {
      if (!Array.isArray(instruction.values)) {
        instruction.values = [instruction.values];
      }
      matchingNodes.children = accumulateMatching(
        matchingNodes,
        instruction.attr,
        instruction.values,
        [],
      );
    } else if (
      instruction.operation === "filter" &&
      instruction.type === "multiple" &&
      instruction.attr &&
      instruction.values
    ) {
      matchingNodes.children = accumulateMatching(
        matchingNodes,
        instruction.attr,
        instruction.values,
        [],
        true,
      );
    }

    // Accum operation
    else if (instruction.operation === "accumulate" && instruction.attr) {
      accums.push(
        matchingNodes.children.map((node) =>
          instruction.legend
            ? instruction.legend[node[instruction.attr]]
            : node[instruction.attr],
        ),
      );
    }

    // Join accumulated operation
    else if (
      instruction.operation === "join" &&
      instruction.delimiter != undefined &&
      accums.length > 0
    ) {
      let newAccum = accums[0];
      let biggestArr = 0;
      accums.forEach((arr) => {
        biggestArr = Math.max(arr.length, biggestArr);
      });
      for (let i = 1; i < accums.length; i++) {
        for (let j = 0; j < biggestArr; j++) {
          const line = newAccum[j] ? newAccum[j] : "";
          const newStuff = accums[i][j] ? accums[i][j] : "";
          const delim = accums[i][j] ? instruction.delimiter : "";
          newAccum[j] = line + delim + newStuff;
        }
      }
      accums = newAccum;
    }

    // select a node
    // resets previously selected nodes
    else if (
      instruction.operation === "select" &&
      instruction.indices !== undefined
    ) {
      selectedNodes = [];
      if (instruction.indices === "ALL" || instruction.indices === "all") {
        matchingNodes.children.forEach((child, index) => {
          selectedNodes.push({
            index: index,
            node: child,
          });
        });
      } else {
        if (!Array.isArray(instruction.indices)) {
          instruction.indices = [instruction.indices];
        }
        instruction.indices.forEach((index) => {
          if (index === "LAST" || index === "last") {
            index = matchingNodes.children.length - 1;
          }
          if (parseInt(index) !== NaN) {
            if (index < matchingNodes.children.length) {
              selectedNodes.push({
                index: index,
                node: matchingNodes.children[index],
              });
            }
          }
        });
      }
    }

    // operate on selected node
    // resets selected nodes
    else if (instruction.operation === "operate") {
      selectedNodes.forEach((selectedNode) => {
        if (instruction.type === "ascend") {
          const parent = DFS(root, "_id", selectedNode.node.parentId);
          if (parent) {
            matchingNodes.children[selectedNode.index] = parent;
          }
        } else if (instruction.type === "descend") {
          const child = DFS(root, "parentId", selectedNode.node._id);
          if (child) {
            matchingNodes.children[selectedNode.index] = child;
          }
        } else if (instruction.type === "previousSibling") {
          const parent = DFS(root, "_id", selectedNode.node.parentId);
          if (parent) {
            const index = parent.children.findIndex(
              (child) => child._id === selectedNode.node._id,
            );
            if (index > 0) {
              const sibling = parent.children[index - 1];
              matchingNodes.children[selectedNode.index] = sibling;
            }
          }
        } else if (instruction.type === "nextSibling") {
          const parent = DFS(root, "_id", selectedNode.node.parentId);
          if (parent) {
            const index = parent.children.findIndex(
              (child) => child._id === selectedNode.node._id,
            );
            if (index < parent.children.length - 1) {
              const sibling = parent.children[index + 1];
              matchingNodes.children[selectedNode.index] = sibling;
            }
          }
        }
      });
      selectedNodes = [];
    }
  }

  return {
    matchingNodes: matchingNodes.children,
    accums,
  };
}
