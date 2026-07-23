import { useState } from "react";

import { ActionOptions } from "@/components/screens/paste/components/comments/comment/comment-actions/action-options/ActionOptions.tsx";
import { ReplyForm } from "@/components/screens/paste/components/comments/comment/comment-actions/reply-form/ReplyForm.tsx";

type Props = {
  isAuth: boolean;
  commentId: string;
  pasteId: string;
};

export const CommentActions = ({ isAuth, commentId, pasteId }: Props) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isAuth) return null;

  return (
    <>
      <ActionOptions
        commentId={commentId}
        isReplying={isReplying}
        isMenuOpen={isMenuOpen}
        toggleReplyForm={() => setIsReplying(!isReplying)}
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      {isReplying && (
        <ReplyForm
          commentId={commentId}
          pasteId={pasteId}
          closeForm={() => setIsReplying(false)}
        />
      )}
    </>
  );
};
