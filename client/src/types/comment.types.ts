import type { ISODateString } from "./common.types.ts";

export type CommentAuthor = {
  id: string;
  username: string;
};

export type CommentItem = {
  id: string;
  content: string | null;
  author: CommentAuthor;
  repliesCount: number;
  createdAt: ISODateString;
};

export type CreateCommentDto = {
  content: string;
};

export type UpdateCommentDto = {
  content: string;
};
