import Search from "./search/Search.jsx";
import Actions from "./actions/Actions.jsx";
import Logo from "./logo/Logo.jsx";

import styles from "./Header.module.scss";

const Header = () => {
  // TODO: Make hamburger menu
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div>
          <Logo />
          <Search />
        </div>
        <div>
          <Actions />
        </div>
      </div>
    </header>
  );
};

export default Header;
