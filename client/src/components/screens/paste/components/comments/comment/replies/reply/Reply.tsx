import { CommentHeader } from "@/components/screens/paste/components/comments/comment/comment-header/CommentHeader.tsx";
import type { ReplyItem } from "@/types/reply.types.ts";


import styles from "./Reply.module.scss";

type Props = {
  reply: ReplyItem;
};

export const Reply = ({ reply }: Props) => {
  return (
    <article key={reply.id} className={`${styles.comment} ${styles.reply}`}>
      <CommentHeader comment={reply} />
    </article>
  );
};
