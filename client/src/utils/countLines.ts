export function countLines(content: string): number {
  return content.split(/\r\n|\r|\n/).length;
}
