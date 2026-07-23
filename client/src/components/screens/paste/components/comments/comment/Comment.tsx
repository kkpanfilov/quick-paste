import { CommentHeader } from "@/components/screens/paste/components/comments/comment/comment-header/CommentHeader.tsx";
import { Replies } from "@/components/screens/paste/components/comments/comment/replies/Replies.tsx";
import { ReplyForm } from "@/components/screens/paste/components/comments/comment/reply-form/ReplyForm.tsx";
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
  replyState: ReplyState;
  setReplyState: React.Dispatch<React.SetStateAction<ReplyState>>;
};

export const Comment = ({
  isAuth,
  pasteId,
  comment,
  replyState,
  setReplyState,
}: Props) => {
  const commentId = comment.id;

  return (
    <article key={commentId} className={styles.comment}>
      <CommentHeader comment={comment} />

      <ReplyForm
        pasteId={pasteId}
        commentId={commentId}
        isAuth={isAuth}
        replyState={replyState}
        setReplyState={setReplyState}
      />
      <Replies comment={comment} pasteId={pasteId} />
    </article>
  );
};
