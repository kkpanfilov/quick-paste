import { formatDistanceToNow } from "date-fns";

import { categoryMap } from "../assets/caterory.map.js";
import { languageMap } from "../assets/language.map.js";
import { countLines } from "./countLines.js";
import { formatContentSize } from "./formatContentSize.js";

export function formatData(data) {
  return data.map((paste) => ({
    ...paste,
    category: categoryMap[paste.category],
    language: languageMap[paste.language],
    createdAt: `${formatDistanceToNow(new Date(paste.createdAt))} ago`,
    lines: countLines(paste.content),
    size: formatContentSize(paste.content),
  }));
}
