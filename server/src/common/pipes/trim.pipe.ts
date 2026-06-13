import { PipeTransform } from "@nestjs/common";

export class TrimPipe implements PipeTransform {
  constructor(private readonly fields?: string[]) {}

  transform(value: unknown) {
    if (typeof value === "string") return value.trim();

    if (!this.fields || !value || typeof value !== "object") return value;

    const result = { ...(value as Record<string, unknown>) };

    for (const field of this.fields) {
      if (result[field] && typeof result[field] === "string") {
        result[field] = result[field].trim();
      }
    }

    return result;
  }
}
