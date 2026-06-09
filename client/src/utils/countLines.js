export function countLines(content) {
  return content.split(/\r\n|\r|\n/).length;
}
