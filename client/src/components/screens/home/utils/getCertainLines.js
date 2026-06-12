export function getCertainLines(text, options = {}) {
  if (typeof text !== "string") {
    return "";
  }

  const { start, end } = options ?? {};
  const lines = text.split("\n");

  const firstLine = Math.max(getLineNumber(start, 1), 1);
  const lastLine = getLineNumber(end, lines.length);

  if (firstLine > lastLine) {
    return "";
  }

  return lines.slice(firstLine - 1, lastLine).join("\n");
}

function getLineNumber(value, fallback) {
  if (value == null) {
    return fallback;
  }

  const lineNumber = Number(value);

  return Number.isFinite(lineNumber) ? Math.floor(lineNumber) : fallback;
}
