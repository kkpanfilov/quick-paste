import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { Button } from "@/components/ui/button/Button.jsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { useCreateComment } from "@/hooks/comments/useCreateComment.js";
import { addNotification } from "@/store/notification/notificationSlice.js";

import styles from "./CommentForm.module.scss";

export const CommentForm = ({ isAuth, dispatch, pasteId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const { mutateAsync: commentPaste } = useCreateComment();
  const queryClient = useQueryClient();

  const onComment = async (body) => {
    try {
      const result = await commentPaste({ id: pasteId, body });

      if (result.id) {
        dispatch(
          addNotification({
            type: "success",
            title: "Comment added",
            message: "Comment has been added successfully",
          }),
        );

        queryClient.setQueryData(["paste", pasteId], (oldData) => {
          return {
            ...oldData,
            comments: [result, ...oldData.comments],
          };
        });

        reset();
      }
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Comment not added",
          message: error.message,
        }),
      );
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

        <span className={styles.commentsCount}>2</span>
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
