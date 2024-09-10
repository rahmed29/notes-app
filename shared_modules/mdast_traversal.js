import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { mathFromMarkdown } from "mdast-util-math";
import { gfm } from "micromark-extension-gfm";
import { math } from "micromark-extension-math";

export { queryAST, MDASTERQueryInstruction, astFromMarkdown, queryNotes, DFS };

function astFromMarkdown(markdown) {
  return fromMarkdown(markdown, {
    extensions: [gfm(), math()],
    mdastExtensions: [gfmFromMarkdown(), mathFromMarkdown()],
  });
}

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
      attr: attr,
      values: values,
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

  // this takes your 2d `accums` array and joins them line by line with the delimiter
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

  // this selects a node from the list of filtered nodes
  // selecting does nothing to the list, until you operate on it
  // can be a single number, an array, or "ALL" to select all nodes
  select(indices) {
    this.#query.push({
      operation: "select",
      indices: indices,
    });
    return this;
  }

  // Replaces the selected node in the filtered list with it's parent (if it has one)
  ascend() {
    this.#query.push({
      operation: "operate",
      type: "ascend",
    });
    return this;
  }

  // Replaces the selected node in the filtered list with it's first child (if it has one)
  descend() {
    this.#query.push({
      operation: "operate",
      type: "descend",
    });
    return this;
  }

  previousSibling() {
    this.#query.push({
      operation: "operate",
      type: "previousSibling",
    });
    return this;
  }

  nextSibling() {
    this.#query.push({
      operation: "operate",
      type: "nextSibling",
    });
    return this;
  }

  // returns the query as an array, which can be sent to the server in the `instructions` field of the body
  // Last method to call, I didn't make the query array public because I wanted to enforce this since it looks cleaner when chaining
  export() {
    return this.#query;
  }
}

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

function accumulateMatching(node, attr, acceptedValues, arr) {
  if (!attr || !acceptedValues || acceptedValues.length === 0) {
    arr = arr.concat(node.children);
    return arr;
  }
  if (!node) {
    return arr;
  }

  if (node[attr] && acceptedValues.includes(node[attr].toString())) {
    arr.push(node);
  }

  delete node.position;

  if (node && node.children) {
    node.children.forEach((child) => {
      // array is passed by reference and accumulates results
      accumulateMatching(child, attr, acceptedValues, arr, node._id);
    });
  }
  return arr;
}

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
        instruction.end
      );
    }

    // Filter operation
    else if (
      instruction.operation === "filter" &&
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
        []
      );
    }

    // Accum operation
    else if (instruction.operation === "accumulate" && instruction.attr) {
      accums.push(
        matchingNodes.children.map((node) =>
          instruction.legend
            ? instruction.legend[node[instruction.attr]]
            : node[instruction.attr]
        )
      );
    }

    // Join accumulated attrs operation
    // What this does is takes the 2d array of accumulated attributes and joins them line by line
    else if (
      instruction.operation === "join" &&
      instruction.delimiter !== undefined
    ) {
      let concatenated = "";
      let smallestArr = Infinity;
      accums.forEach((arr) => {
        smallestArr = Math.min(arr.length, smallestArr);
      });
      for (let i = 0; i < smallestArr; i++) {
        let line = "";
        accums.forEach((arr) => {
          line += arr[i];
        });
        // dont add delimiter to last line
        if (i === smallestArr - 1) {
          concatenated += line;
        } else {
          concatenated += line + instruction.delimiter;
        }
      }
      accums = [concatenated];
    }

    // select a node
    else if (
      instruction.operation === "select" &&
      instruction.indices !== undefined
    ) {
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
          if (index < matchingNodes.children.length) {
            selectedNodes.push({
              index: index,
              node: matchingNodes.children[index],
            });
          }
        });
      }
    }

    // operate on selected node
    else if (instruction.operation === "operate") {
      selectedNodes.forEach((selectedNode) => {
        if (instruction.type === "ascend") {
          const parent = DFS(root, "_id", selectedNode.node.parentId);
          if (parent) {
            matchingNodes.children[selectedNode.index] = parent;
            selectedNode = {
              index: selectedNode.index,
              node: parent,
            };
          }
        } else if (instruction.type === "descend") {
          const child = DFS(root, "parentId", selectedNode.node._id);
          if (child) {
            matchingNodes.children[selectedNode.index] = child;
            selectedNode = {
              index: selectedNode.index,
              node: child,
            };
          }
        } else if (instruction.type === "previousSibling") {
          const parent = DFS(root, "_id", selectedNode.node.parentId);
          if (parent) {
            const index = parent.children.findIndex(
              (child) => child._id === selectedNode.node._id
            );
            if (index > 0) {
              const sibling = parent.children[index - 1];
              matchingNodes.children[selectedNode.index] = sibling;
              selectedNode = {
                index: selectedNode.index,
                node: sibling,
              };
            }
          }
        } else if (instruction.type === "nextSibling") {
          const parent = DFS(root, "_id", selectedNode.node.parentId);
          if (parent) {
            const index = parent.children.findIndex(
              (child) => child._id === selectedNode.node._id
            );
            if (index < parent.children.length - 1) {
              const sibling = parent.children[index + 1];
              matchingNodes.children[selectedNode.index] = sibling;
              selectedNode = {
                index: selectedNode.index,
                node: sibling,
              };
            }
          }
        }
      });
    }
  }

  return {
    matchingNodes: matchingNodes.children,
    accums,
  };
}
