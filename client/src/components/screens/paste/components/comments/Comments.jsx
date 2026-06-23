import { useState } from "react";

import { Comment } from "./comment/Comment.jsx";

import styles from "./Comments.module.scss";

export const Comments = ({ isAuth, pasteId, data }) => {
  const [replyState, setReplyState] = useState({
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
