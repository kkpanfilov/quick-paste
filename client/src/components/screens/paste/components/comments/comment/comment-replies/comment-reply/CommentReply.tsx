import { useState } from "react";

import { type InfiniteData, useQueryClient } from "@tanstack/react-query";

import { isApiError } from "@/api/apiClient.ts";
import type {
  CommentActionsType,
  CommentHandlersType,
  CommentStatesType,
} from "@/components/screens/paste/components/comments/comment/Comment.tsx";
import { CommentActions } from "@/components/screens/paste/components/comments/comment/comment-actions/CommentActions.tsx";
import { CommentHeader } from "@/components/screens/paste/components/comments/comment/comment-header/CommentHeader.tsx";
import { useDeleteComment } from "@/hooks/comments/useDeleteComment.ts";
import type {
  GetRepliesResult,
  Cursor as ReplyCursor,
} from "@/hooks/comments/useGetReplies.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";
import type { ReplyItem } from "@/types/reply.types.ts";

import styles from "./CommentReply.module.scss";

type Props = {
  pasteId: string;
  reply: ReplyItem;
};

type ReplyStatesType = CommentStatesType;
type ReplyActionsType = CommentActionsType;
type ReplyHandlersType = CommentHandlersType;

export const CommentReply = ({ pasteId, reply }: Props) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isActionsVisible, setIsActionsVisible] = useState(true);

  const { notifySuccess, notifyError } = useNotifications();

  const { mutateAsync: deleteComment } = useDeleteComment();

  const queryClient = useQueryClient();

  const onDelete = async (id: string) => {
    try {
      const result = await deleteComment(id);

      if (result.success) {
        notifySuccess({
          title: "Comment deleted",
          message: "Comment has been deleted successfully",
        });
      }

      queryClient.setQueryData<InfiniteData<GetRepliesResult, ReplyCursor>>(
        ["comments-replies", reply.parentId],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((item) => {
                if (item.id === id) {
                  return {
                    ...item,
                    content: null,
                  };
                } else {
                  return item;
                }
              }),
            })),
          };
        },
      );

      setIsActionsVisible(false);
      setIsMenuOpen(false);
    } catch (error: unknown) {
      notifyError({
        title: "Comment not deleted",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }
  };

  const replyUI = {
    isReplying,
    isMenuOpen,
    isEditing,
    isActionsVisible,
  } as ReplyStatesType;

  const replyActions = {
    toggleReplyForm: () => setIsReplying((value) => !value),
    toggleMenu: () => setIsMenuOpen((value) => !value),
    toggleEditing: () => setIsEditing((value) => !value),
    toggleActions: () => setIsActionsVisible((value) => !value),
  } as ReplyActionsType;

  const handleActions = {
    handlerDelete: () => onDelete(reply.id),
  } as ReplyHandlersType;

  return (
    <article
      key={reply.id}
      className={`${styles.comment} ${styles.reply}`}
      data-reply
    >
      <CommentHeader
        comment={reply}
        pasteId={pasteId}
        states={replyUI}
        actions={replyActions}
      />
      <CommentActions
        comment={reply}
        pasteId={pasteId}
        states={replyUI}
        actions={replyActions}
        handlers={handleActions}
        variant={"reply"}
      />
    </article>
  );
};
