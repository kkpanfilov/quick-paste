import { useState } from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import { anOldHope } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { useLikePaste } from "@/hooks/pastes/useLikePaste.js";
import { useUnlikePaste } from "@/hooks/pastes/useUnlikePaste.js";
import { addNotification } from "@/store/notification/notificationSlice.js";

import styles from "./PasteTextarea.module.scss";

export const PasteTextarea = ({
  dispatch,
  isAuth,
  userId,
  pasteId,
  data,
  isEditing,
  editForm,
}) => {
  const { mutateAsync: likePaste } = useLikePaste();
  const { mutateAsync: unlikePaste } = useUnlikePaste();

  const [likeState, setLikeState] = useState(null);

  const currentLikeState = likeState?.pasteId === pasteId ? likeState : null;
  const isLiked = currentLikeState?.isLiked ?? Boolean(data.isLiked);
  const likesCount = currentLikeState?.likesCount ?? data.likesCount;

  const onLike = async (id) => {
    if (!isAuth) {
      dispatch(
        addNotification({
          type: "error",
          title: "Paste not liked",
          message: "You must be logged in to like a paste",
        }),
      );
      return;
    }

    try {
      const result = await likePaste(id);

      if (result.isLiked === true) {
        setLikeState({
          pasteId,
          isLiked: true,
          likesCount: result.likesCount,
        });
      }
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Paste not liked",
          message: error.message,
        }),
      );
    }
  };

  const onUnlike = async (id) => {
    try {
      const result = await unlikePaste(id);

      if (result.isLiked === false) {
        setLikeState({
          pasteId,
          isLiked: false,
          likesCount: result.likesCount,
        });
      }
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Paste not unliked",
          message: error.message,
        }),
      );
    }
  };

  return (
    <section className={styles.content} aria-label="Paste content">
      <div className={styles.toolbar}>
        <span className={styles.fileName}>
          <button
            type="button"
            className={styles.likeButton}
            aria-label="Like paste"
            aria-pressed={isLiked}
            title="Like paste"
            onClick={() => (isLiked ? onUnlike(pasteId) : onLike(pasteId))}
          >
            <svg
              className={styles.likeIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 21s-6.7-4.4-9.3-8.4C.4 9.1 2.3 4.5 6.4 4.2c2-.2 3.5.8 4.4 2.1.9-1.3 2.4-2.3 4.4-2.1 4.1.3 6 4.9 3.7 8.4C16.7 16.6 12 21 12 21Z" />
            </svg>
            <span className={styles.likeCount}>{likesCount}</span>
          </button>
          {editForm.formState.errors.content && (
            <ErrorMessage message={editForm.formState.errors.content.message} />
          )}
        </span>
        <span className={styles.status}>
          {isAuth && userId === data.authorId ? "Owner" : "Read only"}
        </span>
      </div>
      {isEditing ? (
        <Field
          tag="textarea"
          id="paste-content"
          name="content"
          className={styles.pasteTextarea}
          defaultValue={data.content}
          {...editForm.register("content", {
            required: "Content is required",
            maxLength: {
              value: 100000,
              message: "Content is too long",
            },
          })}
        />
      ) : (
        <SyntaxHighlighter
          className={styles.codeBlock}
          language={data.language}
          style={anOldHope}
        >
          {data.content}
        </SyntaxHighlighter>
      )}
    </section>
  );
};
