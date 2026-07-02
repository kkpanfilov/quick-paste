type Options = {
  start: number;
  end: number;
};

export function getCertainLines(
  text: string,
  options: Options = { start: 1, end: 4 },
) {
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

function getLineNumber(value: number, fallback: number) {
  if (value == null) {
    return fallback;
  }

  const lineNumber = Number(value);

  return Number.isFinite(lineNumber) ? Math.floor(lineNumber) : fallback;
}
