import { useState } from "react";

import { Actions } from "./actions/Actions.tsx";
import { Hamburger } from "./hamburger/Hamburger.tsx";
import { Logo } from "./logo/Logo.tsx";
import { Search } from "./search/Search.tsx";

import styles from "./Header.module.scss";

export const Header = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div>
          <Logo onClick={() => setIsHamburgerOpen(false)} />
          <Search type={"pc"} />
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
