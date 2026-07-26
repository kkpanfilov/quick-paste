import type { ISODateString } from "@/types/common.types.ts";

import type { CommentAuthor } from "./comment.types.ts";

export type ReplyAuthor = CommentAuthor;

export type ReplyItem = {
  id: string;
  content: string | null;
  author: CommentAuthor;
  parentId: string;
  createdAt: ISODateString;
};

export type CreateReplyDto = {
  content: string;
  pasteId: string;
};
