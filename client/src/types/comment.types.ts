import type { ISODateString } from "./common.types.ts";

export type CommentAuthor = {
  id: string;
  username: string;
};

export type CommentItem = {
  id: string;
  content: string;
  author: CommentAuthor;
  repliesCount: number;
  createdAt: ISODateString;
};

export type CreateCommentDto = {
  content: string;
};
