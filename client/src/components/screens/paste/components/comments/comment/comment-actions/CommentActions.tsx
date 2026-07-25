import type {
  CommentActionsType,
  CommentHandlersType,
  CommentStatesType,
} from "@/components/screens/paste/components/comments/comment/Comment.tsx";
import { ActionOptions } from "@/components/screens/paste/components/comments/comment/comment-actions/action-options/ActionOptions.tsx";
import { ReplyForm } from "@/components/screens/paste/components/comments/comment/comment-actions/reply-form/ReplyForm.tsx";
import { Confirm } from "@/components/ui/confirm/Confirm.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import type { CommentItem } from "@/types/comment.types.ts";
import type { ReplyItem } from "@/types/reply.types.ts";

type Props = {
  comment: CommentItem | ReplyItem;
  pasteId: string;
  states: CommentStatesType;
  actions: CommentActionsType;
  handlers: CommentHandlersType;
  variant: "comment" | "reply";
};

export type CommentActionsVariant = Props["variant"];

export const CommentActions = ({
  comment,
  pasteId,
  states,
  actions,
  handlers,
  variant = "comment",
}: Props) => {
  const { author } = comment;

  const { isAuth, userId } = useAuth();

  if (!isAuth || author.id !== userId) return null;
  if (comment.content === null && author.id === userId) return null;

  return (
    <>
      <ActionOptions
        comment={comment}
        states={states}
        actions={actions}
        variant={variant}
      />

      {states.isConfirmDeleteOpen && (
        <Confirm
          title={"Delete comment?"}
          description={"Are you sure you want to delete this comment?"}
          action={"Delete"}
          onCancel={actions.toggleActions}
          onConfirm={handlers.handlerDelete}
        />
      )}
      {states.isReplying && (
        <ReplyForm
          comment={comment as CommentItem}
          pasteId={pasteId}
          actions={actions}
        />
      )}
    </>
  );
};
