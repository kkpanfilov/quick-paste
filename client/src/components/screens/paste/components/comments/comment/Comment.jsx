import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button/Button.jsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { useCreateReply } from "@/hooks/comments/useCreateReply.js";
import { addNotification } from "@/store/notification/notificationSlice.js";

import styles from "./Comment.module.scss";

export const Comment = ({
  dispatch,
  isAuth,
  pasteId,
  comment,
  replyState,
  setReplyState,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const commentId = comment.id;
  const isReplying =
    replyState.isReplying && replyState.commentId === commentId;

  const { mutateAsync: createReply } = useCreateReply();
  const queryClient = useQueryClient();

  const onReply = async (data) => {
    try {
      const result = await createReply({ id: commentId, pasteId, data });

      if (result.id) {
        dispatch(
          addNotification({
            type: "success",
            title: "Comment added",
            message: "Comment has been added successfully",
          }),
        );

        queryClient.setQueryData(["paste", pasteId], (oldData) => {
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
      dispatch(
        addNotification({
          type: "error",
          title: "Paste not unlocked",
          message: error.message,
        }),
      );
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
