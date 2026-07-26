import { formatDistanceToNow } from "date-fns";

import type {
  CommentActionsType,
  CommentStatesType,
} from "@/components/screens/paste/components/comments/comment/Comment.tsx";
import { EditForm } from "@/components/screens/paste/components/comments/comment/comment-actions/edit-form/EditForm.tsx";
import type { CommentItem } from "@/types/comment.types.ts";
import type { ReplyItem } from "@/types/reply.types.ts";

import styles from "./CommentHeader.module.scss";

type Props = {
  comment: CommentItem | ReplyItem;
  pasteId: string;
  states: CommentStatesType;
  actions: CommentActionsType;
};

export const CommentHeader = ({ comment, pasteId, states, actions }: Props) => {
  const { isEditing } = states;

  const isReply = "parentId" in comment;

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
      {isEditing ? (
        <EditForm comment={comment} pasteId={pasteId} actions={actions} />
      ) : comment.content ? (
        <p className={styles.commentText}>{comment.content}</p>
      ) : (
        <p className={styles.commentTextDeleted}>
          This {isReply ? "reply" : "comment"} has been deleted
        </p>
      )}
    </>
  );
};
