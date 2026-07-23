import { CommentActions } from "@/components/screens/paste/components/comments/comment/comment-actions/CommentActions";
import { CommentHeader } from "@/components/screens/paste/components/comments/comment/comment-header/CommentHeader.tsx";
import { CommentReplies } from "@/components/screens/paste/components/comments/comment/comment-replies/CommentReplies";
import type { CommentItem } from "@/types/comment.types.ts";

import styles from "./Comment.module.scss";

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
      <CommentActions
        pasteId={pasteId}
        commentId={commentId}
        isAuth={isAuth}
        variant={"comment"}
      />
      <CommentReplies isAuth={isAuth} comment={comment} pasteId={pasteId} />
    </article>
  );
};
