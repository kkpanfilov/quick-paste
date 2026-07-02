import type { ISODateString } from "./common.types.ts";
import type { ReplyItem } from "./reply.types.ts";

export type CommentAuthor = {
  id: string;
  username: string;
};

export type CommentItem = {
  id: string;
  content: string;
  author: CommentAuthor;
  replies: ReplyItem[];
  createdAt: ISODateString;
};

export type CreateCommentDto = {
  content: string;
};
