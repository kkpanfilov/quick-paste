import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button/Button.jsx";

import styles from "./Comment.module.scss";

export const Comment = ({ comment, isAuth }) => {
  return (
    <article key={comment.id} className={styles.comment}>
      <header className={styles.commentHeader}>
        <div className={styles.avatar} aria-hidden="true">
          {comment.author.username[0].toUpperCase()}
        </div>
        <div>
          <h3 className={styles.commentAuthor}>{comment.author.username}</h3>
          <p className={styles.commentDate}>
            {formatDistanceToNow(new Date(comment.createdAt), {
              includeSeconds: true,
              addSuffix: true,
            })}
          </p>
        </div>
      </header>
      <p className={styles.commentText}>{comment.content}</p>
      {isAuth && (
        <div className={styles.commentActions}>
          <Button variant="ghost" className={styles.replyButton}>
            Reply
          </Button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies} aria-label="Replies">
          {comment.replies.map((reply) => (
            <article className={`${styles.comment} ${styles.reply}`}>
              <header className={styles.commentHeader}>
                <div className={styles.avatar} aria-hidden="true">
                  {reply.author.username[0].toUpperCase()}
                </div>
                <div>
                  <h3 className={styles.commentAuthor}>
                    {reply.author.username}
                  </h3>
                  <p className={styles.commentDate}>
                    {formatDistanceToNow(new Date(reply.createdAt), {
                      includeSeconds: true,
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </header>
              <p className={styles.commentText}>{reply.content}</p>
            </article>
          ))}
        </div>
      )}
    </article>
  );
};
