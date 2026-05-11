import { formatDistanceToNow } from "date-fns";
import { Link, useParams } from "react-router";

import { Button } from "@/components/ui/button/Button.jsx";
import { Loader } from "@/components/ui/loader/Loader.jsx";
import { useGetPaste } from "@/hooks/pastes/useGetPaste.js";
import { useAuth } from "@/hooks/useAuth.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";
import { countLines } from "@/utils/countLines.js";
import { getContentSize } from "@/utils/getContentSize.js";

import { categoryMap } from "../home/assets/category.map.js";
import { languageMap } from "../home/assets/language.map.js";
import { NotFound } from "../not-found/NotFound.jsx";

import styles from "./Paste.module.scss";

// TODO: implement comments section
export const Paste = () => {
  useDocumentTitle("Paste");

  const { isAuth, userId } = useAuth();

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
    return (
      <NotFound
        title="Paste not found"
        description="The paste you are looking for does not exist"
      />
    );
  }

  return (
    <>
      <main className={styles.screen}>
        <article className={styles.container} aria-labelledby="paste-title">
          <header className={styles.header}>
            <div className={styles.heading}>
              <p className={styles.eyebrow}>{data.exposure} paste</p>
              <h1 id="paste-title" className={styles.title}>
                {data.title}
              </h1>
              <dl className={styles.meta}>
                <div>
                  <dt>Category</dt>
                  <dd>{categoryMap[data.category]}</dd>
                </div>
                <div>
                  <dt>Language</dt>
                  <dd>{languageMap[data.language]}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{formatDistanceToNow(new Date(data.createdAt))} ago</dd>
                </div>
                <div>
                  <dt>Created by</dt>
                  <dd>
                    <Link to={`/users/${data.authorId}`}>{data.author}</Link>
                  </dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>
                    {countLines(data.content)} lines /{" "}
                    {getContentSize(data.content)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className={styles.actions} aria-label="Paste actions">
              <Button variant="ghost" className={styles.actionButton}>
                Copy
              </Button>
              {isAuth && userId === data.authorId && (
                <>
                  <Button variant="red" className={styles.actionButton}>
                    Delete
                  </Button>
                  <Button variant="primary" className={styles.actionButton}>
                    Edit
                  </Button>
                </>
              )}
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
