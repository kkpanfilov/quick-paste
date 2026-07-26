import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import { isApiError } from "@/api/apiClient.ts";
import type { CommentActionsType } from "@/components/screens/paste/components/comments/comment/Comment.tsx";
import { Button } from "@/components/ui/button/Button.tsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.tsx";
import { Field } from "@/components/ui/field/Field.tsx";
import { useCreateReply } from "@/hooks/comments/useCreateReply.ts";
import type {
  Cursor as CommentCursor,
  GetCommentsResult,
} from "@/hooks/comments/useGetComments.ts";
import type {
  GetRepliesResult,
  Cursor as ReplyCursor,
} from "@/hooks/comments/useGetReplies.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";
import type { CommentItem } from "@/types/comment.types.ts";
import type { CreateReplyDto } from "@/types/reply.types.ts";

import styles from "./ReplyForm.module.scss";

type FormData = Omit<CreateReplyDto, "pasteId">;

type Props = {
  comment: CommentItem;
  pasteId: string;
  actions: CommentActionsType;
};

const DEFAULT_VALUES = {
  content: "",
};

export const ReplyForm = ({ comment, pasteId, actions }: Props) => {
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
  const { toggleReplyForm } = actions;

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

        queryClient.setQueryData<InfiniteData<GetRepliesResult, ReplyCursor>>(
          ["comments-replies", commentId],
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

        queryClient.setQueryData<
          InfiniteData<GetCommentsResult, CommentCursor>
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
                      repliesCount: comment.repliesCount + 1,
                    }
                  : comment,
              ),
            })),
          };
        });

        toggleReplyForm();
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
        {errors.content && <ErrorMessage message={errors.content.message} />}
        <Button
          variant="ghost"
          className={styles.replyCancelButton}
          onClick={toggleReplyForm}
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
  );
};
