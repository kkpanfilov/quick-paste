import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { Button } from "@/components/ui/button/Button.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { useCreateComment } from "@/hooks/comments/useCreateComment.js";
import { addNotification } from "@/store/notification/notificationSlice.js";

import styles from "./CommentForm.module.scss";

export const CommentForm = ({ isAuth, dispatch, pasteId }) => {
  const commentForm = useForm({
    mode: "onSubmit",
  });

  const { mutateAsync: commentPaste } = useCreateComment();

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
            {...commentForm.register("content", {
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
              onClick={commentForm.handleSubmit(onComment)}
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
