import type { Statistic } from "@/components/screens/user/assets/statisticsLabels.ts";
import type { Language } from "@/shared/lists/language.map.ts";
import type { RecentPasteItem } from "@/types/paste.types.ts";

import type { ISODateString } from "./common.types.ts";

type Exposure = "public" | "private";

type StatisticsItem = {
  label: Statistic;
  value: number;
};

type MostUsedLanguagesItem = {
  language: Language;
  count: number;
};

export type User = {
  id: string;
  username: string;
  email?: string;
  exposure?: Exposure;
  description: string | null;

  pastes: RecentPasteItem[];
  mostUsedLanguages: MostUsedLanguagesItem[];
  statistics: StatisticsItem[];

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
