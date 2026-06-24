import type { Category, CategoryLabel } from "@/shared/lists/category.map.ts";
import type { Expiration } from "@/shared/lists/expiration.map.ts";
import type { Exposure } from "@/shared/lists/exposure.map.ts";
import type { Language, LanguageLabel } from "@/shared/lists/language.map.ts";

import type { ISODateString } from "./common.types.ts";

export type Author = {
  id: string;
  username: string;
};

export type ReplyItem = Omit<CommentItem, "replies">;

export type CommentItem = {
  id: string;
  content: string;
  author: Author;
  replies: ReplyItem[];
  createdAt: ISODateString;
};

export type Paste = {
  id: string;

  title: string;
  description: string | null;
  content: string;

  category: Category;
  exposure: Exposure;
  language: Language;

  likesCount: number;
  isBurn: boolean;
  isLiked: boolean;

  comments: CommentItem[];
  pasteTags: string[];

  author: string;
  authorId: string;

  createdAt: ISODateString;
  expiresAt: ISODateString | null;
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
