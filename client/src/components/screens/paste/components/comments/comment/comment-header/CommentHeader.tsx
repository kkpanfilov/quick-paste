import { formatDistanceToNow } from "date-fns";

import type { CommentItem } from "@/types/comment.types.ts";
import type { ReplyItem } from "@/types/reply.types.ts";

import styles from "./CommentHeader.module.scss";

type Props = {
  comment: CommentItem | ReplyItem;
};

export const CommentHeader = ({ comment }: Props) => {
  return (
    <>
      <header className={styles.commentHeader}>
        <div className={styles.avatar} aria-hidden="true">
          {comment.author.username.charAt(0).toUpperCase() || "?"}
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
    </>
  );
};
