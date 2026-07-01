import { Button } from "@/components/ui/button/Button.jsx";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import styles from "./NotFound.module.scss";

export type Props = {
  title?: string;
  description?: string;
};

export const NotFound = ({
  title = "Page not found",
  description = "The page you are looking for does not exist",
}: Props) => {
  useDocumentTitle("Not Found!");

  const { goHome } = useAppNavigation();

  return (
    <main className={styles.screen}>
      <section className={styles.card} aria-labelledby="not-found-title">
        <p className={styles.code}>404</p>
        <h1 id="not-found-title" className={styles.title}>
          {title}
        </h1>
        <p className={styles.description}>{description}</p>

        <div className={styles.actions}>
          <Button
            onClick={() => goHome()}
            variant="primary"
            className={styles.button}
          >
            Back to home
          </Button>
        </div>
      </section>
    </main>
  );
};
