import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div>
          <a className={styles.brand} href="/" aria-label="Quick Paste home">
            <span className={styles.brandMark}>QP</span>
            <span className={styles.brandText}>Quick Paste</span>
          </a>

          <form className={styles.search} role="search">
            <span className={styles.searchIcon} aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M13 13L17 17"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              className={styles.searchField}
              type="search"
              name="query"
              placeholder="Search pastes"
              autoComplete="off"
            />
          </form>
        </div>

        <div>
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
        </div>
      </div>
    </header>
  );
};

export default Header;
