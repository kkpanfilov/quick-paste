type Body<T extends object> = Partial<T>;
type DirtyFields<T extends object> = Partial<Record<keyof T, boolean>>;

export function getDirtyBody<T extends object>(
  body: Body<T>,
  dirtyFields: DirtyFields<T>,
): Body<T> {
  const dirtyBody = {} as Body<T>;

  for (const key of Object.keys(dirtyFields) as Array<keyof DirtyFields<T>>) {
    dirtyBody[key] = body[key];
  }

  return dirtyBody;
}
