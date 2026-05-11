import { Link, useParams } from "react-router";

import { Button } from "@/components/ui/button/Button.jsx";
import { Loader } from "@/components/ui/loader/Loader.jsx";
import { useGetPaste } from "@/hooks/pastes/useGetPaste.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import { NotFound } from "../not-found/NotFound.jsx";

import styles from "./Paste.module.scss";

// TODO: implement comments section
export const Paste = () => {
  useDocumentTitle("Paste");

  const params = useParams();
  const pasteId = params.id;

  const { data, isLoading, error } = useGetPaste(pasteId);

  // TODO: implement error page
  if (isLoading) {
    return (
      <main>
        <Loader isVisible label="Loading paste..." />
      </main>
    );
  }

  if (error) {
    return <main>Failed to load paste</main>;
  }

  if (data.error === "Not Found") {
    return <NotFound />;
  }

  return (
    <>
      <main className={styles.screen}>
        <article className={styles.container} aria-labelledby="paste-title">
          <header className={styles.header}>
            <div className={styles.heading}>
              <p className={styles.eyebrow}>Public paste</p>
              <h1 id="paste-title" className={styles.title}>
                {data.title}
              </h1>
              <dl className={styles.meta}>
                <div>
                  <dt>Category</dt>
                  <dd>{data.category}</dd>
                </div>
                <div>
                  <dt>Language</dt>
                  <dd>{data.language}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{data.createdAt}</dd>
                </div>
                <div>
                  <dt>Created by</dt>
                  <dd>
                    <Link to={`/users/${data.authorId}`}>{data.authorId}</Link>
                  </dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>18 lines (5.2 KB)</dd>
                </div>
              </dl>
            </div>

            <div className={styles.actions} aria-label="Paste actions">
              <Button variant="ghost" className={styles.actionButton}>
                Copy
              </Button>
              <Button variant="primary" className={styles.actionButton}>
                Fork
              </Button>
            </div>
          </header>

          <section className={styles.content} aria-label="Paste content">
            <div className={styles.toolbar}>
              <span className={styles.fileName}>auth-middleware-fix.js</span>
              <span className={styles.status}>Read only</span>
            </div>

            <pre className={styles.codeBlock}>
              <code>{data.content}</code>
            </pre>
          </section>
        </article>
      </main>
    </>
  );
};
