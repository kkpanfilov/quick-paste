import { useAppNavigation } from "@/hooks/useAppNavigation.js";

import styles from "./Actions.module.scss";

const Actions = () => {
  const { goNew, goSignIn } = useAppNavigation();

  return (
    <div className={styles.actions}>
      <button className={styles.primaryButton} onClick={() => goNew()} type="button">
        New paste
      </button>
      <button className={styles.ghostButton} onClick={() => goSignIn()} type="button">
        Sign in
      </button>
    </div>
  );
};

export default Actions;
