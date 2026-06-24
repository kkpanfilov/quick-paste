const BYTE_UNITS = ["B", "KB", "MB"] as const;
const UNIT_STEP = 1024;

export function getContentSize(content: string): string {
  let size = new TextEncoder().encode(content).length;
  let unitIndex = 0;

  while (size >= UNIT_STEP && unitIndex < BYTE_UNITS.length - 1) {
    size /= UNIT_STEP;
    unitIndex += 1;
  }

  const formattedSize = unitIndex === 0 ? size : size.toFixed(1);

  return `${formattedSize} ${BYTE_UNITS[unitIndex]}`;
}
