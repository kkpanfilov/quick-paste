import Button from "@/components/ui/button/Button.jsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import styles from "./Paste.module.scss";

const Paste = () => {
  useDocumentTitle("Paste");

  return (
    <main className={styles.screen}>
      <article className={styles.container} aria-labelledby="paste-title">
        <header className={styles.header}>
          <div className={styles.heading}>
            <p className={styles.eyebrow}>Public paste</p>
            <h1 id="paste-title" className={styles.title}>
              auth-middleware-fix.js
            </h1>
            <dl className={styles.meta}>
              <div>
                <dt>Language</dt>
                <dd>JavaScript</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>2 min ago</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>18 lines</dd>
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
            <code>{`const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};`}</code>
          </pre>
        </section>
      </article>
    </main>
  );
};

export default Paste;
