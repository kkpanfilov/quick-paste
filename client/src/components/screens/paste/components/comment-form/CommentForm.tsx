import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router";

import { isApiError } from "@/api/apiClient.ts";
import { Button } from "@/components/ui/button/Button.tsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.tsx";
import { Field } from "@/components/ui/field/Field.tsx";
import { useCreateComment } from "@/hooks/comments/useCreateComment.ts";
import type {
  Cursor,
  GetCommentsResult,
} from "@/hooks/comments/useGetComments.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";
import type { CreateCommentDto } from "@/types/comment.types.ts";
import type { Paste } from "@/types/paste.types.ts";

import styles from "./CommentForm.module.scss";

const DEFAULT_VALUES: CreateCommentDto = {
  content: "",
};

type FormData = CreateCommentDto;

type CommentFormProps = {
  isAuth: boolean;
  pasteId: string;
  data: Paste;
};

export const CommentForm = ({ isAuth, pasteId, data }: CommentFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: DEFAULT_VALUES,
  });

  const { notifySuccess, notifyError } = useNotifications();

  const { mutateAsync: commentPaste } = useCreateComment();
  const queryClient = useQueryClient();

  const onComment: SubmitHandler<FormData> = async (body) => {
    try {
      const result = await commentPaste({ pasteId, body });

      if (result.id) {
        notifySuccess({
          title: "Comment added",
          message: "Comment has been added successfully",
        });

        queryClient.setQueryData<Paste>(["paste", pasteId], (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            commentsCount: oldData.commentsCount + 1,
          };
        });

        queryClient.setQueryData<InfiniteData<GetCommentsResult, Cursor>>(
          ["paste-comments", pasteId],
          (oldData) => {
            if (!oldData || !oldData.pages[0]) return oldData;

            return {
              ...oldData,
              pages: [
                {
                  ...oldData.pages[0],
                  items: [result, ...oldData.pages[0].items],
                },
                ...oldData.pages.slice(1),
              ],
            };
          },
        );

        reset();
      }
    } catch (error: unknown) {
      notifyError({
        title: "Comment not added",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }
  };

  return (
    <section className={styles.comments} aria-labelledby="comments-title">
      <div className={styles.commentsHeader}>
        <div>
          <p className={styles.eyebrow}>Discussion</p>
          <h2 id="comments-title" className={styles.commentsTitle}>
            Comments
          </h2>
          {errors.content && <ErrorMessage message={errors.content.message} />}
        </div>

        <span className={styles.commentsCount}>{data.commentsCount || 0}</span>
      </div>

      {isAuth ? (
        <form className={styles.commentForm}>
          <Field
            tag="textarea"
            className={styles.commentTextarea}
            placeholder="Write a comment..."
            aria-label="Write a comment"
            rows={4}
            {...register("content", {
              required: "Comment is required",
              maxLength: {
                value: 1000,
                message: "Comment is too long",
              },
            })}
          />
          <div className={styles.commentFormActions}>
            <Button
              variant="primary"
              className={styles.commentButton}
              onClick={handleSubmit(onComment)}
            >
              Send comment
            </Button>
          </div>
        </form>
      ) : (
        <div className={styles.commentAuthPlaceholder}>
          <p className={styles.commentAuthTitle}>Sign in to leave a comment</p>
          <p className={styles.commentAuthText}>
            Anonymous users can read the discussion, but cannot post new
            comments and reply to comments.
          </p>
          <Link to="/signin" className={styles.commentAuthLink}>
            Sign in
          </Link>
        </div>
      )}
    </section>
  );
};
