import type { Category, CategoryLabel } from "@/shared/lists/category.map.ts";
import type { Expiration } from "@/shared/lists/expiration.map.ts";
import type { Exposure } from "@/shared/lists/exposure.map.ts";
import type { Language, LanguageLabel } from "@/shared/lists/language.map.ts";

import type { CommentItem } from "./comment.types.ts";
import type { ISODateString } from "./common.types.ts";

export type Paste = {
  id: string;

  title: string;
  description: string | null;
  content: string;

  category: Category;
  exposure: Exposure;
  language: Language;

  likesCount: number;
  isLiked: boolean;

  comments: CommentItem[];
  pasteTags: string[];

  author: string;
  authorId: string;

  createdAt: ISODateString;
};

export type FeedPasteItem = Pick<
  Paste,
  | "id"
  | "title"
  | "content"
  | "category"
  | "language"
  | "createdAt"
  | "likesCount"
  | "pasteTags"
>;

export type FormattedFeedPasteItem = FeedPasteItem & {
  categoryLabel: CategoryLabel;
  languageLabel: LanguageLabel;
  lines: number;
  size: string;
};

export type CreatePasteDto = {
  title: string;
  description: string | null;
  content: string;

  category: Category;
  expiration: Expiration;
  exposure: Exposure;
  language: Language;

  isBurn: boolean;
  password: string;

  tags: string[];
};

export type UpdatePasteDto = Omit<
  CreatePasteDto,
  "expiration" | "isBurn" | "password"
> & {
  password?: string;
};
