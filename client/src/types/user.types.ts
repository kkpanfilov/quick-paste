import type { ISODateString } from "./common.types.ts";

type Exposure = "public" | "private";

type StatisticsItem = {
  label: string;
  value: number;
};

type MostUsedLanguagesItem = {
  label: string;
  value: number;
};

export type User = {
  id: string;
  username: string;
  email?: string;
  exposure?: Exposure;
  description: string | null;

  pastes: string[];
  mostUsedLanguages: MostUsedLanguagesItem;
  statistics: StatisticsItem;

  createdAt: ISODateString;
  lastActiveAt: ISODateString;
};

export type UpdatedUser = {
  id: string;
  username: string;
  email?: string;
  exposure?: Exposure;
  description: string | null;
};

export type UpdateUserDto = {
  username?: string;
  description?: string | null;
  email?: string;
  exposure?: Exposure;
};
