import { CommentActions } from "@/components/screens/paste/components/comments/comment/comment-actions/CommentActions";
import { CommentHeader } from "@/components/screens/paste/components/comments/comment/comment-header/CommentHeader.tsx";
import { Replies } from "@/components/screens/paste/components/comments/comment/replies/Replies.tsx";
import type { CommentItem } from "@/types/comment.types.ts";

import styles from "./Comment.module.scss";

export type ReplyState = {
  isReplying: boolean;
  commentId: string | null;
};

type Props = {
  isAuth: boolean;
  pasteId: string;
  comment: CommentItem;
};

export const Comment = ({ isAuth, pasteId, comment }: Props) => {
  const commentId = comment.id;

  return (
    <article key={commentId} className={styles.comment}>
      <CommentHeader comment={comment} />

      <CommentActions pasteId={pasteId} commentId={commentId} isAuth={isAuth} />
      <Replies comment={comment} pasteId={pasteId} />
    </article>
  );
};
