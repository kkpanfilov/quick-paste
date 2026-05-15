import { formatDistanceToNow } from "date-fns";

import { countLines } from "../../../../utils/countLines.js";
import { getContentSize } from "../../../../utils/getContentSize.js";
import { categoryMap } from "../assets/category.map.js";
import { languageMap } from "../assets/language.map.js";

export function formatData(data) {
  return data.map((paste) => ({
    ...paste,
    category: categoryMap[paste.category],
    language: languageMap[paste.language],
    createdAt: `${formatDistanceToNow(new Date(paste.createdAt), { includeSeconds: true, addSuffix: true })}`,
    lines: countLines(paste.content),
    size: getContentSize(paste.content),
  }));
}
