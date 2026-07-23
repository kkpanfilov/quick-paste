import { useState } from "react";

import { CommentReply } from "@/components/screens/paste/components/comments/comment/comment-replies/comment-reply/CommentReply";
import { Button } from "@/components/ui/button/Button.tsx";
import { ErrorBlock } from "@/components/ui/error-block/ErrorBlock.tsx";
import { LoaderBlock } from "@/components/ui/loader-block/LoaderBlock.tsx";
import { useGetReplies } from "@/hooks/comments/useGetReplies.ts";
import type { CommentItem } from "@/types/comment.types.ts";

import styles from "./CommentReplies.module.scss";

type Props = {
  comment: CommentItem;
  pasteId: string;
};

export const CommentReplies = ({ comment, pasteId }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const commentId = comment.id;

  const { data, isLoading, error, fetchNextPage } = useGetReplies(
    pasteId,
    commentId,
    {
      enabled: isExpanded,
    },
  );

  if (isLoading && isExpanded) {
    return <LoaderBlock isVisible={isLoading} label="Loading replies..." />;
  }

  if (error && isExpanded) {
    return (
      <ErrorBlock
        title="Failed to load replies"
        message="An error occurred while loading replies"
      />
    );
  }

  if ((!data || !data.pages || data.pages.length === 0) && isExpanded) {
    return (
      <ErrorBlock
        title="Failed to load replies"
        message="An error occurred while loading replies"
      />
    );
  }

  const replyPages = data?.pages || [];

  return (
    <>
      {isExpanded && (
        <div className={styles.replies} aria-label="Replies">
          {replyPages.map((page) =>
            page.items.map((reply) => <CommentReply key={reply.id} reply={reply} />),
          )}
        </div>
      )}

      <div className={styles.repliesButtons}>
        {comment.repliesCount > 0 && !isExpanded && (
          <Button
            variant="soft"
            className={styles.repliesButton}
            onClick={() => {
              setIsExpanded(true);
            }}
          >
            View {comment.repliesCount}{" "}
            {comment.repliesCount === 1 ? "reply" : "replies"}
          </Button>
        )}

        {replyPages.at(-1)?.nextCursor && isExpanded && (
          <Button
            variant="soft"
            className={styles.repliesButton}
            onClick={() => {
              fetchNextPage();
            }}
          >
            View more
          </Button>
        )}

        {isExpanded && (
          <Button
            variant="soft"
            className={styles.repliesButton}
            onClick={() => {
              setIsExpanded(false);
            }}
            data-close="true"
          >
            Close
          </Button>
        )}
      </div>
    </>
  );
};
