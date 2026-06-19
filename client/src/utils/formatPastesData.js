import { formatDistanceToNow } from "date-fns";

import { getCertainLines } from "../components/screens/home/utils/getCertainLines.js";
import { categoryMap } from "../shared/lists/category.map.js";
import { languageMap } from "../shared/lists/language.map.js";
import { countLines } from "./countLines.js";
import { getContentSize } from "./getContentSize.js";

export function formatPastesData(data) {
  if (!data.items.length) return { items: [], meta: null, languages: [] };

  const meta = data.meta;
  const items = data.items;
  const languages = [];

  const formattedItems = items.map((paste) => ({
    ...paste,
    content: getCertainLines(paste.content, { start: 1, end: 4 }),
    category: categoryMap[paste.category],
    language: languageMap[paste.language],
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
