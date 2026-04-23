import Actions from "./actions/Actions.jsx";
import Hamburger from "./hamburger/Hamburger.jsx";
import Logo from "./logo/Logo.jsx";
import Search from "./search/Search.jsx";

import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div>
          <Logo />
          <Search />
        </div>
        <div>
          <Actions />
          <Hamburger />
        </div>
      </div>
    </header>
  );
};

export default Header;
