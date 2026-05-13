import { Button } from "@/components/ui/button/Button.jsx";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import styles from "./ErrorPage.module.scss";

export const ErrorPage = ({
  code = "500",
  title,
  description,
  documentTitle = "Error!",
  actionLabel = "Back to home",
}) => {
  useDocumentTitle(documentTitle);

  const { goHome } = useAppNavigation();

  return (
    <main className={styles.screen}>
      <section className={styles.card} aria-labelledby="error-title">
        <p className={styles.code}>{code}</p>
        <h1 id="error-title" className={styles.title}>
          {title ? title : "Something went wrong"}
        </h1>
        <p className={styles.description}>
          {description
            ? description
            : "We could not complete the request. Please try again later"}
        </p>

        <div className={styles.actions}>
          <Button
            onClick={() => goHome()}
            variant="primary"
            className={styles.button}
          >
            {actionLabel}
          </Button>
        </div>
      </section>
    </main>
  );
};
