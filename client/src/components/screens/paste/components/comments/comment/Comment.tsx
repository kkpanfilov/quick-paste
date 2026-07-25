import { useState } from "react";

import { type InfiniteData, useQueryClient } from "@tanstack/react-query";

import { isApiError } from "@/api/apiClient.ts";
import { CommentActions } from "@/components/screens/paste/components/comments/comment/comment-actions/CommentActions";
import { CommentHeader } from "@/components/screens/paste/components/comments/comment/comment-header/CommentHeader.tsx";
import { CommentReplies } from "@/components/screens/paste/components/comments/comment/comment-replies/CommentReplies";
import { useDeleteComment } from "@/hooks/comments/useDeleteComment.ts";
import type {
  Cursor as CommentCursor,
  GetCommentsResult,
} from "@/hooks/comments/useGetComments.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";
import type { CommentItem } from "@/types/comment.types.ts";

import styles from "./Comment.module.scss";

type Props = {
  isAuth: boolean;
  pasteId: string;
  comment: CommentItem;
};

export type CommentStatesType = {
  isReplying: boolean;
  isEditing: boolean;
  isMenuOpen: boolean;
  isConfirmDeleteOpen: boolean;
  isActionsVisible: boolean;
};

export type CommentActionsType = {
  toggleReplyForm: () => void;
  toggleEditing: () => void;
  toggleMenu: () => void;
  toggleConfirmDelete: () => void;
  toggleActions: () => void;
};

export type CommentHandlersType = {
  handlerDelete: () => void;
};

export const Comment = ({ pasteId, comment }: Props) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
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

      queryClient.setQueryData<InfiniteData<GetCommentsResult, CommentCursor>>(
        ["paste-comments", pasteId],
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

  const commentUI = {
    isReplying,
    isEditing,
    isMenuOpen,
    isConfirmDeleteOpen,
    isActionsVisible,
  } as CommentStatesType;

  const commentActions = {
    toggleReplyForm: () => setIsReplying((value) => !value),
    toggleEditing: () => setIsEditing((value) => !value),
    toggleMenu: () => setIsMenuOpen((value) => !value),
    toggleConfirmDelete: () => setIsConfirmDeleteOpen((value) => !value),
    toggleActions: () => setIsActionsVisible((value) => !value),
  } as CommentActionsType;

  const handleActions = {
    handlerDelete: () => onDelete(comment.id),
  } as CommentHandlersType;

  return (
    <article key={comment.id} className={styles.comment} data-comment>
      <CommentHeader
        comment={comment}
        pasteId={pasteId}
        states={commentUI}
        actions={commentActions}
      />
      <CommentActions
        comment={comment}
        pasteId={pasteId}
        states={commentUI}
        actions={commentActions}
        handlers={handleActions}
        variant={"comment"}
      />
      <CommentReplies comment={comment} pasteId={pasteId} />
    </article>
  );
};
