import { BadRequestException, PipeTransform } from "@nestjs/common";

import ms from "ms";

export class DurationToDatePipe implements PipeTransform {
  transform(value: string): Date | null {
    if (value === "never" || value === "burn") {
      return null;
    }

    const durationMs = ms(value as ms.StringValue);

    if (typeof durationMs !== "number") {
      throw new BadRequestException("Invalid expiration format");
    }

    return new Date(Date.now() + durationMs);
  }
}
