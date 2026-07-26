import type {
  CommentActionsType,
  CommentHandlersType,
  CommentStatesType,
} from "@/components/screens/paste/components/comments/comment/Comment.tsx";
import type { CommentActionsVariant } from "@/components/screens/paste/components/comments/comment/comment-actions/CommentActions.tsx";
import { Button } from "@/components/ui/button/Button.tsx";
import type { CommentItem } from "@/types/comment.types.ts";
import type { ReplyItem } from "@/types/reply.types.ts";

import styles from "./ActionOptions.module.scss";

type Props = {
  comment: CommentItem | ReplyItem;
  states: CommentStatesType;
  actions: CommentActionsType;
  variant: CommentActionsVariant;
};

export const ActionOptions = ({
  comment,
  states,
  actions,
  variant = "comment",
}: Props) => {
  const commentId = comment.id;

  const { isReplying, isMenuOpen } = states;
  const {
    toggleReplyForm,
    toggleMenu,
    toggleEditing,
    toggleConfirmDelete,
    toggleActions,
  } = actions;

  if (!states.isActionsVisible) return null;

  return (
    <div className={styles.commentActions}>
      <Button
        variant="ghost"
        className={styles.replyButton}
        aria-expanded={isReplying}
        aria-controls={`reply-form-${commentId}`}
        disabled={variant === "reply"}
        onClick={toggleReplyForm}
      >
        Reply
      </Button>

      <div className={styles.menu}>
        <Button
          variant="ghost"
          className={styles.menuButton}
          aria-label="Open comment actions"
          aria-haspopup="menu"
          aria-expanded="true"
          aria-controls={`comment-actions-menu-${commentId}`}
          onClick={toggleMenu}
        >
          <span aria-hidden="true">•••</span>
        </Button>

        {isMenuOpen && (
          <div
            id={`comment-actions-menu-${commentId}`}
            className={styles.menuPopup}
            role="menu"
          >
            <button
              className={styles.menuItem}
              type="button"
              role="menuitem"
              onClick={() => {
                toggleEditing();
                toggleMenu();
                toggleActions();
              }}
            >
              Edit
            </button>
            <button
              className={`${styles.menuItem} ${styles.deleteMenuItem}`}
              type="button"
              role="menuitem"
              onClick={() => {
                toggleConfirmDelete();
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
