import { Button } from "@/components/ui/button/Button.tsx";
import { ErrorBlock } from "@/components/ui/error-block/ErrorBlock.tsx";
import { LoaderBlock } from "@/components/ui/loader-block/LoaderBlock.tsx";
import { useGetComments } from "@/hooks/comments/useGetComments.ts";

import { Comment } from "./comment/Comment.tsx";

import styles from "./Comments.module.scss";

type Props = {
  isAuth: boolean;
  pasteId: string;
};

export const Comments = ({ isAuth, pasteId }: Props) => {
  const { data, isLoading, error, fetchNextPage } = useGetComments(pasteId);

  if (isLoading) {
    return <LoaderBlock isVisible={isLoading} label="Loading comments..." />;
  }

  if (error) {
    return (
      <ErrorBlock
        title="Failed to load comments"
        message="An error occurred while loading comments"
      />
    );
  }

  if (!data || !data.pages || data.pages.length === 0) {
    return (
      <ErrorBlock
        title="Failed to load comments"
        message="An error occurred while loading comments"
      />
    );
  }

  const commentPages = data.pages;

  return (
    <div className={styles.commentList}>
      {commentPages.map((page) =>
        page.items.map((comment) => (
          <Comment
            key={comment.id}
            isAuth={isAuth}
            pasteId={pasteId}
            comment={comment}
          />
        )),
      )}

      {commentPages.at(-1)?.nextCursor && (
        <Button
          variant={"soft"}
          className={styles.loadMore}
          onClick={() => {
            fetchNextPage();
          }}
        >
          Load more
        </Button>
      )}
    </div>
  );
};
