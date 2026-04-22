import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import styles from "./Home.module.scss";

const Home = () => {
  useDocumentTitle("Home");

  return (
    <main className={styles.screen}>
      <section className={styles.container}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Recent pastes</p>
          <h1 className={styles.title}>Your feed</h1>
          <p className={styles.subtitle}>
            Latest snippets from your workspace. Quickly preview and continue
            where you left off.
          </p>
        </section>

        <section className={styles.feed} aria-label="Recent pastes">
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>auth-middleware-fix.js</h2>
              <span className={styles.language}>JavaScript</span>
            </header>
            <pre className={styles.preview}>
              <code>{`if (!token) return res.status(401).json({ error: "No token" });`}</code>
            </pre>
            <footer className={styles.meta}>
              <span>2 min ago</span>
              <span>18 lines</span>
            </footer>
          </article>

          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>db-index-notes.sql</h2>
              <span className={styles.language}>SQL</span>
            </header>
            <pre className={styles.preview}>
              <code>{`CREATE INDEX idx_paste_created_at ON pastes(created_at DESC);`}</code>
            </pre>
            <footer className={styles.meta}>
              <span>17 min ago</span>
              <span>12 lines</span>
            </footer>
          </article>

          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>release-checklist.md</h2>
              <span className={styles.language}>Markdown</span>
            </header>
            <pre className={styles.preview}>
              <code>{`- run lint\n- run tests\n- update changelog\n- ship`}</code>
            </pre>
            <footer className={styles.meta}>
              <span>1 hour ago</span>
              <span>9 lines</span>
            </footer>
          </article>
        </section>
      </section>
    </main>
  );
};

export default Home;
