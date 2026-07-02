import { Button } from "@/components/ui/button/Button.tsx";

import styles from "./Confirm.module.scss";

type Props = {
  title?: string;
  description?: string;
  action?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export const Confirm = ({
  title = "Are you sure?",
  description = "Are you sure you want to perform this action?",
  action = "Confirm",
  onCancel,
  onConfirm,
}: Props) => {
  return (
    <div className={styles.overlay}>
      <section
        className={styles.confirm}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
      >
        <div className={styles.icon} aria-hidden="true">
          !
        </div>

        <div className={styles.content}>
          <h2 id="confirm-title" className={styles.title}>
            {title}
          </h2>
          <p id="confirm-description" className={styles.description}>
            {description}
          </p>
        </div>

        <div className={styles.actions}>
          <Button
            variant="ghost"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="red"
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            {action}
          </Button>
        </div>
      </section>
    </div>
  );
};
