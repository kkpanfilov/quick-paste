import styles from './Actions.module.scss'

const Actions = () => {
  return (
    <div className={styles.actions}>
      <button className={styles.primaryButton} type="button">
        New paste
      </button>
      <button className={styles.ghostButton} type="button">
        Sign in
      </button>
      <button className={styles.menuButton} type="button" aria-label="Open menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  );
};

export default Actions;
