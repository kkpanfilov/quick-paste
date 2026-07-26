import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import { isApiError } from "@/api/apiClient.ts";
import type { CommentActionsType } from "@/components/screens/paste/components/comments/comment/Comment.tsx";
import { Button } from "@/components/ui/button/Button.tsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.tsx";
import { Field } from "@/components/ui/field/Field.tsx";
import type {
  Cursor as CommentsCursor,
  GetCommentsResult,
} from "@/hooks/comments/useGetComments.ts";
import type {
  GetRepliesResult,
  Cursor as RepliesCursor,
} from "@/hooks/comments/useGetReplies.ts";
import { useUpdateComment } from "@/hooks/comments/useUpdateComment.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";
import type { CommentItem, UpdateCommentDto } from "@/types/comment.types.ts";
import type { ReplyItem } from "@/types/reply.types.ts";

import styles from "./EditForm.module.scss";

type FormData = UpdateCommentDto;

type Props = {
  comment: CommentItem | ReplyItem;
  pasteId: string;
  actions: CommentActionsType;
};

const DEFAULT_VALUES = {
  content: "",
};

export const EditForm = ({ comment, pasteId, actions }: Props) => {
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
  const isReply = "parentId" in comment;

  const { toggleEditing, toggleActions } = actions;
  const { notifySuccess, notifyError } = useNotifications();

  const { mutateAsync: updateComment } = useUpdateComment();
  const queryClient = useQueryClient();

  const onReply: SubmitHandler<FormData> = async (body) => {
    try {
      const result = await updateComment({
        id: commentId,
        body,
      });

      if (result.id) {
        notifySuccess({
          title: `${isReply ? "Reply" : "Comment"} edited`,
          message: `${isReply ? "Reply" : "Comment"} has been edited successfully`,
        });

        toggleEditing();
        toggleActions();

        if (isReply) {
          queryClient.setQueryData<
            InfiniteData<GetRepliesResult, RepliesCursor>
          >(["comments-replies", comment.parentId], (oldData) => {
            if (!oldData || !oldData.pages[0]) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                items: page.items.map((reply) =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        content: body.content,
                      }
                    : reply,
                ),
              })),
            };
          });
        } else {
          queryClient.setQueryData<
            InfiniteData<GetCommentsResult, CommentsCursor>
          >(["paste-comments", pasteId], (oldData) => {
            if (!oldData || !oldData.pages[0]) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                items: page.items.map((comment) =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        content: body.content,
                      }
                    : comment,
                ),
              })),
            };
          });
        }

        reset();
      }
    } catch (error) {
      notifyError({
        title: "Comment is not edited",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }
  };

  return (
    <form
      id={`reply-form-${commentId}`}
      className={styles.editForm}
      aria-label="Reply to comment"
    >
      <Field
        tag="textarea"
        className={styles.editTextarea}
        placeholder="Edit a comment..."
        aria-label="Edit a comment"
        rows={3}
        {...register("content", {
          required: "Content is required",
          maxLength: {
            value: 1000,
            message: "Content is too long",
          },
        })}
      />
      <div className={styles.editFormActions}>
        {errors.content && <ErrorMessage message={errors.content.message} />}
        <Button
          variant="ghost"
          className={styles.editCancelButton}
          onClick={() => {
            toggleEditing();
            toggleActions();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className={styles.editSubmitButton}
          onClick={handleSubmit(onReply)}
        >
          Edit
        </Button>
      </div>
    </form>
  );
};
