import { Button } from "@/components/ui/button/Button.tsx";
import { useAppNavigation } from "@/hooks/useAppNavigation.ts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";

import styles from "./ErrorPage.module.scss";

export type ErrorPageProps = {
  code?: string;
  title?: string;
  description?: string;
  documentTitle?: string;
  actionLabel?: string;
};

export const ErrorPage = ({
  code = "500",
  title = "Something went wrong",
  description = "We could not complete the request. Please try again later",
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
          {title}
        </h1>
        <p className={styles.description}>{description}</p>

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
