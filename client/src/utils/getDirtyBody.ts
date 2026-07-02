import type { FieldNamesMarkedBoolean } from "react-hook-form";

type Body<T extends object> = Partial<T>;

export function getDirtyBody<T extends object>(
  body: Body<T>,
  dirtyFields: FieldNamesMarkedBoolean<T>,
): Body<T> {
  const dirtyBody = {} as Body<T>;

  for (const key of Object.keys(dirtyFields) as Array<keyof T>) {
    dirtyBody[key] = body[key];
  }

  return dirtyBody;
}
