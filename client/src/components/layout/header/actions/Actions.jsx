import Button from "@/components/ui/button/Button.jsx";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";

import styles from "./Actions.module.scss";

const Actions = () => {
  const { goNew, goSignIn } = useAppNavigation();

  return (
    <div className={styles.actions}>
      <Button
        variant="primary"
        className={styles.newPasteButton}
        onClick={() => goNew()}
        type="button"
      >
        New paste
      </Button>
      <Button
        variant="ghost"
        className={styles.signInButton}
        onClick={() => goSignIn()}
        type="button"
      >
        Sign in
      </Button>
    </div>
  );
};

export default Actions;
