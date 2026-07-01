import { formatDistanceToNow } from "date-fns";

import type {
  FeedPasteItem,
  FormattedFeedPasteItem,
} from "@/types/paste.types.js";

import { getCertainLines } from "../components/screens/home/utils/getCertainLines.js";
import { categoryMap } from "../shared/lists/category.map.js";
import { type Language, languageMap } from "../shared/lists/language.map.js";
import { countLines } from "./countLines.js";
import { getContentSize } from "./getContentSize.js";

export type Data = {
  items: FeedPasteItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

export type FormattedData = {
  items: FormattedFeedPasteItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    totalMatches?: number;
  } | null;
  languages: Language[];
};

export function formatPastesData(data: Data): FormattedData {
  if (!data.items.length) return { items: [], meta: null, languages: [] };

  const meta = data.meta;
  const items = data.items;
  const languages: Language[] = [];

  const formattedItems = items.map((paste) => ({
    ...paste,
    content: getCertainLines(paste.content, { start: 1, end: 4 }),
    categoryLabel: categoryMap[paste.category],
    languageLabel: languageMap[paste.language],
    createdAt: `${formatDistanceToNow(new Date(paste.createdAt), { includeSeconds: true, addSuffix: true })}`,
    lines: countLines(paste.content),
    size: getContentSize(paste.content),
  }));

  items.forEach((item) => {
    if (!languages.includes(item.language)) {
      languages.push(item.language);
    }
  });

  return {
    items: formattedItems,
    meta,
    languages,
  };
}
