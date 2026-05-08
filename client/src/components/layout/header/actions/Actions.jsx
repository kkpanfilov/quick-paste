import { Button } from "@/components/ui/button/Button.jsx";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useAuth } from "@/hooks/useAuth.js";

import styles from "./Actions.module.scss";

export const Actions = () => {
  const { goNew, goSignIn, goMe } = useAppNavigation();

  const { isAuth } = useAuth();

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
      {isAuth ? (
        <Button
          variant="soft"
          className={styles.signInButton}
          onClick={() => goMe()}
          type="button"
        >
          Profile
        </Button>
      ) : (
        <Button
          variant="ghost"
          className={styles.signInButton}
          onClick={() => goSignIn()}
          type="button"
        >
          Sign in
        </Button>
      )}
    </div>
  );
};
