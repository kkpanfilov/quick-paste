import type { CommentItem } from "./comment.types.ts";

export type ReplyItem = Omit<CommentItem, "repliesCount">;

export type CreateReplyDto = {
  content: string;
  pasteId: string;
};
