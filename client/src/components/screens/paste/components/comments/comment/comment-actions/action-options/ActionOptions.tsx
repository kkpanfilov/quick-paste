import type { CommentActionsVariant } from "@/components/screens/paste/components/comments/comment/comment-actions/CommentActions.tsx";
import { Button } from "@/components/ui/button/Button.tsx";

import styles from "./ActionOptions.module.scss";

type Props = {
  commentId: string;
  isReplying: boolean;
  isMenuOpen: boolean;
  toggleReplyForm: () => void;
  toggleMenu: () => void;
  variant: CommentActionsVariant;
};

export const ActionOptions = ({
  commentId,
  isReplying,
  isMenuOpen,
  toggleReplyForm,
  toggleMenu,
  variant = "comment",
}: Props) => {
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
            <button className={styles.menuItem} type="button" role="menuitem">
              Edit
            </button>
            <button
              className={`${styles.menuItem} ${styles.deleteMenuItem}`}
              type="button"
              role="menuitem"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
