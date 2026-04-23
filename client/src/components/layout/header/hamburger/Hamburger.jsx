import { useState } from "react";

import Button from "@/components/ui/button/Button.jsx";
import Field from "@/components/ui/field/Field.jsx";
import SearchIcon from "@/components/ui/search-icon/SearchIcon.jsx";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";

import styles from "./Hamburger.module.scss";

const Hamburger = () => {
  const [isShow, setIsShow] = useState(false);

  const { goNew, goSignIn } = useAppNavigation();

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

      <div
        className={styles.menuList}
        data-state={isShow ? "open" : "closed"}
        isShow={isShow}
      >
        <form className={styles.search} role="search">
          <SearchIcon />
          <Field
            className={styles.searchField}
            type="search"
            name="query"
            placeholder="Search pastes"
            autoComplete="off"
          />
        </form>

        <Button
          variant="primary"
          className={styles.menuLinkPrimary}
          onClick={() => {
            goNew();
            setIsShow(false);
          }}
        >
          New paste
        </Button>
        <Button
          variant="ghost"
          className={styles.menuLinkGhost}
          onClick={() => {
            goSignIn();
            setIsShow(false);
          }}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default Hamburger;
