export { parseReference };

// :ref[book]
// :ref[book:page]
// :ref[book|title]
// :ref[book:page|title]
function parseReference(refString) {
  const result = {
    name: undefined,
    page: undefined,
    title: undefined,
  };

  // Regular expression to capture the three patterns
  const regex = /([^:|]+)(?::(\d+))?(?:\|(.+))?/;
  const match = refString.match(regex);

  if (match) {
    result.name = match[1] || undefined;
    result.page = parseInt(match[2]) || undefined;
    result.title = match[3] || undefined;
  }

  return result;
}
