import { useParams } from "react-router";

import { PastePassword } from "@/components/screens/paste-password/PastePassword.jsx";
import { Loader } from "@/components/ui/loader/Loader.jsx";
import { useGetPaste } from "@/hooks/pastes/useGetPaste.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useAuth } from "@/hooks/useAuth.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import { ErrorPage } from "../error/ErrorPage.js";
import { NotFound } from "../not-found/NotFound.js";
import { CommentForm } from "./components/comment-form/CommentForm.js";
import { Comments } from "./components/comments/Comments.tsx";
import { PasteContent } from "./components/paste-content/PasteContent.js";

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
