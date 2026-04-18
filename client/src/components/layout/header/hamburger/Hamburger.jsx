import { useState } from "react";

import { Link } from "react-router";

import styles from "./Hamburger.module.scss";

const Hamburger = () => {
  const [isShow, setIsShow] = useState(false);

  return (
    <div className={styles.hamburger}>
      <button
        className={styles.menuButton}
        type="button"
        aria-label="Open menu"
        onClick={() => setIsShow(!isShow)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={styles.menuList} data-state={isShow ? "open" : "closed"} isShow={isShow}>
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

        <Link className={styles.menuLinkPrimary} to="/new">
          New paste
        </Link>
        <Link className={styles.menuLinkGhost} to="/signin">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Hamburger;
