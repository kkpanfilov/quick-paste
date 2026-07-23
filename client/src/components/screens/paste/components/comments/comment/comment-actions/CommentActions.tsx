import { useState } from "react";

import type { ReplyState } from "@/components/screens/paste/components/comments/comment/Comment.tsx";
import { ReplyForm } from "@/components/screens/paste/components/comments/comment/comment-actions/reply-form/ReplyForm.tsx";
import { Button } from "@/components/ui/button/Button.tsx";

import styles from "./CommentActions.module.scss";

type Props = {
  isAuth: boolean;
  commentId: string;
  pasteId: string;
};

export const CommentActions = ({ isAuth, commentId, pasteId }: Props) => {
  const [replyState, setReplyState] = useState<ReplyState>({
    isReplying: false,
    commentId: null,
  });

  const isReplying =
    replyState.isReplying && replyState.commentId === commentId;

  return (
    <>
      {isAuth && (
        <div className={styles.commentActions}>
          <Button
            variant="ghost"
            className={styles.replyButton}
            aria-expanded={isReplying}
            aria-controls={`reply-form-${commentId}`}
            onClick={() =>
              setReplyState({
                isReplying: true,
                commentId,
              })
            }
          >
            Reply
          </Button>
        </div>
      )}

      {isAuth && isReplying && (
        <ReplyForm
          commentId={commentId}
          pasteId={pasteId}
          closeForm={() => setReplyState({ isReplying: false, commentId: null })}
        />
      )}
    </>
  );
};
