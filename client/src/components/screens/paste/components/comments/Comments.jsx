import { Comment } from "./comment/Comment.jsx";

import styles from "./Comments.module.scss";

export const Comments = ({ data, isAuth }) => {
  return (
    <div className={styles.commentList}>
      {data.comments.map((comment) => (
        <Comment comment={comment} isAuth={isAuth} />
      ))}
    </div>
  );
};
