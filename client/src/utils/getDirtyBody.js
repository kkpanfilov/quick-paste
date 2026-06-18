export function getDirtyBody(body, dirtyFields) {
  return Object.keys(dirtyFields).reduce((acc, key) => {
    acc[key] = body[key];
    return acc;
  }, {});
}
