import { CommentHeader } from "@/components/screens/paste/components/comments/comment/comment-header/CommentHeader.tsx";
import type { ReplyItem } from "@/types/reply.types.ts";


import styles from "./CommentReply.module.scss";

type Props = {
  reply: ReplyItem;
};

export const CommentReply = ({ reply }: Props) => {
  return (
    <article key={reply.id} className={`${styles.comment} ${styles.reply}`}>
      <CommentHeader comment={reply} />
    </article>
  );
};
