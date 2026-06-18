import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import { PastePassword } from "@/components/screens/paste-password/PastePassword.jsx";
import { Loader } from "@/components/ui/loader/Loader.jsx";
import { useGetPaste } from "@/hooks/pastes/useGetPaste.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useAuth } from "@/hooks/useAuth.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import { ErrorPage } from "../error/ErrorPage.jsx";
import { NotFound } from "../not-found/NotFound.jsx";
import { CommentForm } from "./components/comment-form/CommentForm.jsx";
import { Comments } from "./components/comments/Comments.jsx";
import { PasteContent } from "./components/paste-content/PasteContent.jsx";

import styles from "./Paste.module.scss";

// TODO: implement tags
export const Paste = () => {
  useDocumentTitle("Paste");

  const { goHome } = useAppNavigation();

  const { isAuth, userId } = useAuth();
  const dispatch = useDispatch();

  const params = useParams();
  const pasteId = params.id;

  const { data, isLoading, error } = useGetPaste(pasteId);

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
            dispatch={dispatch}
            isAuth={isAuth}
            userId={userId}
            pasteId={pasteId}
            data={data}
          />
          <CommentForm dispatch={dispatch} isAuth={isAuth} pasteId={pasteId} />
          <Comments
            dispatch={dispatch}
            isAuth={isAuth}
            pasteId={pasteId}
            data={data}
          />
        </article>
      </main>
    </>
  );
};
