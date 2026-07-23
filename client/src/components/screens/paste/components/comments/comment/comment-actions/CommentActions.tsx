import { useState } from "react";

import { ReplyForm } from "@/components/screens/paste/components/comments/comment/comment-actions/reply-form/ReplyForm.tsx";
import { Button } from "@/components/ui/button/Button.tsx";

import styles from "./CommentActions.module.scss";

type Props = {
  isAuth: boolean;
  commentId: string;
  pasteId: string;
};

export const CommentActions = ({ isAuth, commentId, pasteId }: Props) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {isAuth && (
        <div className={styles.commentActions}>
          <Button
            variant="ghost"
            className={styles.replyButton}
            aria-expanded={isReplying}
            aria-controls={`reply-form-${commentId}`}
            onClick={() =>
              isReplying ? setIsReplying(false) : setIsReplying((prev) => !prev)
            }
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                >
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
      )}

      {isAuth && isReplying && (
        <ReplyForm
          commentId={commentId}
          pasteId={pasteId}
          closeForm={() => setIsReplying(false)}
        />
      )}
    </>
  );
};
