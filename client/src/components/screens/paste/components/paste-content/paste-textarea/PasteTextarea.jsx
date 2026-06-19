import { useEffect, useState } from "react";

import clsx from "clsx";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { Loader } from "@/components/ui/loader/Loader.jsx";
import { useLikePaste } from "@/hooks/pastes/useLikePaste.js";
import { useUnlikePaste } from "@/hooks/pastes/useUnlikePaste.js";
import { languageLoaders } from "@/shared/lib/syntax-highlighter/language-loaders.js";
import { addNotification } from "@/store/notification/notificationSlice.js";
import { countLines } from "@/utils/countLines.js";

import styles from "./PasteTextarea.module.scss";

const VISIBLE_LINES_COUNT = 12;

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
  const [languageLoadState, setLanguageLoadState] = useState({
    isLoaded: false,
    language: null,
  });

  const currentLikeState = likeState?.pasteId === pasteId ? likeState : null;
  const isLiked = currentLikeState?.isLiked ?? Boolean(data.isLiked);
  const likesCount = currentLikeState?.likesCount ?? data.likesCount;

  const [isExpanded, setIsExpanded] = useState(false);

  const linesCount = countLines(data.content);
  const canExpandContent = linesCount > VISIBLE_LINES_COUNT;
  const isContentCollapsed = canExpandContent && !isExpanded;

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

  useEffect(() => {
    async function loadLanguage(language) {
      const loader = languageLoaders[language];

      if (!loader) {
        setLanguageLoadState({
          isLoaded: true,
          language: "plain",
        });
        return;
      }

      const module = await loader();
      SyntaxHighlighter.registerLanguage(language, module.default);

      setLanguageLoadState({
        isLoaded: true,
        language,
      });
    }

    loadLanguage(data.language);
  }, [data.language]);

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
          {...editForm.register("content", {
            required: "Content is required",
            maxLength: {
              value: 100000,
              message: "Content is too long",
            },
          })}
        />
      ) : (
        <div className={styles.codeBlockWrapper}>
          {languageLoadState.isLoaded ? (
            <SyntaxHighlighter
              id="paste-content-code"
              className={clsx(
                styles.codeBlock,
                isContentCollapsed && styles.codeBlockCollapsed,
              )}
              language={languageLoadState.language}
              style={oneDark}
              showLineNumbers={true}
              codeTagProps={{
                style: {
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                },
              }}
            >
              {data.content}
            </SyntaxHighlighter>
          ) : (
            <Loader isVisible={true} label="Loading code..." />
          )}

          {isContentCollapsed && <div className={styles.codeBlockFade} />}
          {canExpandContent && (
            <button
              type="button"
              className={styles.expandButton}
              aria-controls="paste-content-code"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded((current) => !current)}
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}
    </section>
  );
};
