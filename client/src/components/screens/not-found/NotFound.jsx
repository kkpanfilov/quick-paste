import { Link } from "react-router";

import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import styles from "./NotFound.module.scss";

const NotFound = () => {
  useDocumentTitle("Page not found");

  return (
    <main className={styles.screen}>
      <section className={styles.card} aria-labelledby="not-found-title">
        <p className={styles.code}>404</p>
        <h1 id="not-found-title" className={styles.title}>
          Page not found
        </h1>
        <p className={styles.description}>
          The page you requested does not exist or was moved.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryButton}>
            Back to home
          </Link>
          <Link to="/signin" className={styles.ghostButton}>
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
