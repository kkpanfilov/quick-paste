import Button from "@/components/ui/button/Button.jsx";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import styles from "./NotFound.module.scss";

const NotFound = () => {
  useDocumentTitle("Page not found");

  const { goHome, goSignIn } = useAppNavigation();

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
          <Button
            onClick={() => goHome()}
            variant="primary"
            className={styles.button}
          >
            Back to home
          </Button>
          <Button
            onClick={() => goSignIn()}
            variant="ghost"
            className={styles.button}
          >
            Sign in
          </Button>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
