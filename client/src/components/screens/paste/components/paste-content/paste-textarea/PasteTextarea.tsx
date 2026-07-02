import { useState } from "react";

import clsx from "clsx";
import type { UseFormReturn } from "react-hook-form";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { isApiError } from "@/api/apiClient.ts";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.tsx";
import { Field } from "@/components/ui/field/Field.tsx";
import { Loader } from "@/components/ui/loader/Loader.tsx";
import { useLikePaste } from "@/hooks/pastes/useLikePaste.ts";
import { useUnlikePaste } from "@/hooks/pastes/useUnlikePaste.ts";
import {
  type HighlightState,
  useLoadLanguage,
} from "@/hooks/syntax-highlighter/useLoadLanguage.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";
import type { Paste, UpdatePasteDto } from "@/types/paste.types.ts";
import { countLines } from "@/utils/countLines.ts";

import styles from "./PasteTextarea.module.scss";

const VISIBLE_LINES_COUNT = 12;

type LikeState = {
  pasteId: string;
  isLiked: boolean;
  likesCount: number;
};

type Props = {
  isAuth: boolean;
  userId: string | null;
  pasteId: string;
  data: Paste;
  isEditing: boolean;
  editForm: UseFormReturn<UpdatePasteDto>;
};

export const PasteTextarea = ({
  isAuth,
  userId,
  pasteId,
  data,
  isEditing,
  editForm,
}: Props) => {
  const { mutateAsync: likePaste } = useLikePaste();
  const { mutateAsync: unlikePaste } = useUnlikePaste();

  const [likeState, setLikeState] = useState<LikeState>({
    pasteId,
    isLiked: false,
    likesCount: 0,
  });
  const [highlightState, setHighlightState] = useState<HighlightState>({
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

  const { notifyError } = useNotifications();

  const onLike = async (id: string) => {
    if (!isAuth) {
      notifyError({
        title: "Paste not liked",
        message: "You must be logged in to like a paste",
      });
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
    } catch (error: unknown) {
      notifyError({
        title: "Paste not liked",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }
  };

  const onUnlike = async (id: string) => {
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
      notifyError({
        title: "Paste not unliked",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }
  };

  useLoadLanguage({
    language: data.language,
    setHighlightState,
  });

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
        <div className={styles.tags}>
          {data.pasteTags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
          <span className={styles.tag}>
            {isAuth && userId === data.authorId ? "Owner" : "Read only"}
          </span>
        </div>
      </div>
      {isEditing ? (
        <Field
          tag="textarea"
          id="paste-content"
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
          {highlightState.isLoaded ? (
            <SyntaxHighlighter
              id="paste-content-code"
              className={clsx(
                styles.codeBlock,
                isContentCollapsed && styles.codeBlockCollapsed,
              )}
              language={
                highlightState.language ? highlightState.language : "plain"
              }
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
