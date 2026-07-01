import { useState } from "react";

import type { Paste } from "@/types/paste.types.js";

import { Comment, type ReplyState } from "./comment/Comment.js";

import styles from "./Comments.module.scss";

type Props = {
  isAuth: boolean;
  pasteId: string;
  data: Paste;
};

export const Comments = ({ isAuth, pasteId, data }: Props) => {
  const [replyState, setReplyState] = useState<ReplyState>({
    isReplying: false,
    commentId: null,
  });

  return (
    data.comments &&
    data.comments.length > 0 && (
      <div className={styles.commentList}>
        {data.comments.map((comment) => (
          <Comment
            key={comment.id}
            isAuth={isAuth}
            pasteId={pasteId}
            comment={comment}
            replyState={replyState}
            setReplyState={setReplyState}
          />
        ))}
      </div>
    )
  );
};
