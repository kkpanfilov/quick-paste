import { useState } from "react";

import { Actions } from "./actions/Actions.jsx";
import { Hamburger } from "./hamburger/Hamburger.jsx";
import { Logo } from "./logo/Logo.jsx";
import { Search } from "./search/Search.jsx";

import styles from "./Header.module.scss";

export const Header = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div>
          <Logo onClick={() => setIsHamburgerOpen(false)} />
          <Search type="pc" />
        </div>
        <div>
          <Actions />
          <Hamburger
            isHamburgerOpen={isHamburgerOpen}
            setIsHamburgerOpen={setIsHamburgerOpen}
          />
        </div>
      </div>
    </header>
  );
};
