import { formatDistanceToNow } from "date-fns";

import { countLines } from "../../../../utils/countLines.js";
import { getContentSize } from "../../../../utils/getContentSize.js";
import { categoryMap } from "../assets/category.map.js";
import { languageMap } from "../assets/language.map.js";
import { getCertainLines } from "./getCertainLines.js";

export function formatData(data) {
  const meta = data.meta;
  const items = data.items;

  const formattedItems = items.map((paste) => ({
    ...paste,
    content: getCertainLines(paste.content, { start: 1, end: 4 }),
    category: categoryMap[paste.category],
    language: languageMap[paste.language],
    createdAt: `${formatDistanceToNow(new Date(paste.createdAt), { includeSeconds: true, addSuffix: true })}`,
    lines: countLines(paste.content),
    size: getContentSize(paste.content),
  }));

  return {
    items: formattedItems,
    meta,
  };
}
