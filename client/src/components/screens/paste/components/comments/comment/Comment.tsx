import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { type SubmitHandler, useForm } from "react-hook-form";

import { isApiError } from "@/api/apiClient.ts";
import { Button } from "@/components/ui/button/Button.tsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.tsx";
import { Field } from "@/components/ui/field/Field.tsx";
import { useCreateReply } from "@/hooks/comments/useCreateReply.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";
import type { CommentItem } from "@/types/comment.types.ts";
import type { Paste } from "@/types/paste.types.ts";
import type { CreateReplyDto } from "@/types/reply.types.ts";

import styles from "./Comment.module.scss";

type FormData = Omit<CreateReplyDto, "pasteId">;

export type ReplyState = {
  isReplying: boolean;
  commentId: string | null;
};

type ReplyFormProps = {
  isAuth: boolean;
  pasteId: string;
  comment: CommentItem;
  replyState: ReplyState;
  setReplyState: React.Dispatch<React.SetStateAction<ReplyState>>;
};

const DEFAULT_VALUES = {
  content: "",
};

export const Comment = ({
  isAuth,
  pasteId,
  comment,
  replyState,
  setReplyState,
}: ReplyFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: DEFAULT_VALUES,
  });

  const commentId = comment.id;
  const isReplying =
    replyState.isReplying && replyState.commentId === commentId;

  const { notifySuccess, notifyError } = useNotifications();

  const { mutateAsync: createReply } = useCreateReply();
  const queryClient = useQueryClient();

  const onReply: SubmitHandler<FormData> = async (body) => {
    try {
      const result = await createReply({
        id: commentId,
        pasteId,
        data: { ...body, pasteId },
      });

      if (result.id) {
        notifySuccess({
          title: "Comment added",
          message: "Comment has been added successfully",
        });

        queryClient.setQueryData<Paste>(["paste", pasteId], (oldData) => {
          if (!oldData) return oldData;

          const { comments, ...rest } = oldData;

          return {
            ...rest,
            comments: comments.map((c) => {
              if (c.id === commentId) {
                return {
                  ...c,
                  replies: [result, ...c.replies],
                };
              }

              return c;
            }),
          };
        });

        setReplyState({ isReplying: false, commentId: null });
        reset();
      }
    } catch (error) {
      notifyError({
        title: "Reply not added",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }
  };

  return (
    <article key={comment.id} className={styles.comment}>
      <header className={styles.commentHeader}>
        <div className={styles.avatar} aria-hidden="true">
          {comment.author.username[0].toUpperCase()}
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
      <p className={styles.commentText}>{comment.content}</p>
      {isAuth && (
        <div className={styles.commentActions}>
          <Button
            variant="ghost"
            className={styles.replyButton}
            aria-expanded={isReplying}
            aria-controls={`reply-form-${commentId}`}
            onClick={() =>
              setReplyState({
                isReplying: true,
                commentId,
              })
            }
          >
            Reply
          </Button>
        </div>
      )}

      {isAuth && isReplying && (
        <form
          id={`reply-form-${commentId}`}
          className={styles.replyForm}
          aria-label="Reply to comment"
        >
          <Field
            tag="textarea"
            className={styles.replyTextarea}
            placeholder="Write a reply..."
            aria-label="Write a reply"
            rows={3}
            {...register("content", {
              required: "Content is required",
              maxLength: {
                value: 1000,
                message: "Reply is too long",
              },
            })}
          />
          <div className={styles.replyFormActions}>
            {errors.content && (
              <ErrorMessage message={errors.content.message} />
            )}
            <Button
              variant="ghost"
              className={styles.replyCancelButton}
              onClick={() =>
                setReplyState({
                  isReplying: false,
                  commentId: null,
                })
              }
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className={styles.replySubmitButton}
              onClick={handleSubmit(onReply)}
            >
              Send reply
            </Button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies} aria-label="Replies">
          {comment.replies.map((reply) => (
            <article
              key={reply.id}
              className={`${styles.comment} ${styles.reply}`}
            >
              <header className={styles.commentHeader}>
                <div className={styles.avatar} aria-hidden="true">
                  {reply.author.username[0].toUpperCase()}
                </div>
                <div>
                  <h3 className={styles.commentAuthor}>
                    {reply.author.username}
                  </h3>
                  <p className={styles.commentDate}>
                    {formatDistanceToNow(new Date(reply.createdAt), {
                      includeSeconds: true,
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </header>
              <p className={styles.commentText}>{reply.content}</p>
            </article>
          ))}
        </div>
      )}
    </article>
  );
};
