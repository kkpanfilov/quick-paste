import { CommentActions } from "@/components/screens/paste/components/comments/comment/comment-actions/CommentActions.tsx";
import { CommentHeader } from "@/components/screens/paste/components/comments/comment/comment-header/CommentHeader.tsx";
import type { ReplyItem } from "@/types/reply.types.ts";

import styles from "./CommentReply.module.scss";

type Props = {
  isAuth: boolean;
  pasteId: string;
  reply: ReplyItem;
};

export const CommentReply = ({ isAuth, pasteId, reply }: Props) => {
  return (
    <article key={reply.id} className={`${styles.comment} ${styles.reply}`}>
      <CommentHeader comment={reply} />
      <CommentActions
        isAuth={isAuth}
        pasteId={pasteId}
        commentId={reply.id}
        variant={"reply"}
      />
    </article>
  );
};
