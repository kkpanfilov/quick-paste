import { useParams } from "react-router";

import { PastePassword } from "@/components/screens/paste-password/PastePassword.tsx";
import { Loader } from "@/components/ui/loader/Loader.tsx";
import { useGetPaste } from "@/hooks/pastes/useGetPaste.ts";
import { useAppNavigation } from "@/hooks/useAppNavigation.ts";
import { useAuth } from "@/hooks/useAuth.ts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";

import { ErrorPage } from "../error/ErrorPage.tsx";
import { NotFound } from "../not-found/NotFound.tsx";
import { CommentForm } from "./components/comment-form/CommentForm.tsx";
import { Comments } from "./components/comments/Comments.tsx";
import { PasteContent } from "./components/paste-content/PasteContent.tsx";

import styles from "./Paste.module.scss";

type Props = {
  pasteId: string;
};

export const Paste = () => {
  const { id: pasteId } = useParams<"id">();

  if (!pasteId || !pasteId.trim().length) {
    return (
      <ErrorPage
        title="Failed to load paste"
        description="The paste is temporarily unavailable"
      />
    );
  }

  return <PasteView pasteId={pasteId} />;
};

const PasteView = ({ pasteId }: Props) => {
  useDocumentTitle("Paste");

  const { goHome } = useAppNavigation();

  const { isAuth, userId } = useAuth();

  const { data, isLoading, error } = useGetPaste(pasteId);

  if (!data) {
    return (
      <ErrorPage
        title="Failed to load paste"
        description="The paste is temporarily unavailable"
      />
    );
  }

  if (isLoading) {
    return (
      <main>
        <Loader isVisible label="Loading paste..." />
      </main>
    );
  }

  if (error) {
    if (error.message === "Paste not found") {
      return (
        <NotFound
          title="Paste not found"
          description="The paste you are looking for does not exist"
        />
      );
    } else if (error.message === "Password is required") {
      return <PastePassword pasteId={pasteId} onCancel={goHome} />;
    } else {
      return (
        <ErrorPage
          title="Failed to load paste"
          description="The paste is temporarily unavailable"
        />
      );
    }
  }

  return (
    <>
      <main className={styles.screen}>
        <article className={styles.container} aria-labelledby="paste-title">
          <PasteContent
            isAuth={isAuth}
            userId={userId}
            pasteId={pasteId}
            data={data}
          />
          <CommentForm isAuth={isAuth} pasteId={pasteId} data={data} />
          <Comments isAuth={isAuth} pasteId={pasteId} data={data} />
        </article>
      </main>
    </>
  );
};
