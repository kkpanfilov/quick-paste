import SearchIcon from "@/components/ui/search-icon/SearchIcon.jsx";

import styles from "./Search.module.scss";

const Search = () => {
  return (
    <form className={styles.search} role="search">
      <SearchIcon />
      <input
        className={styles.searchField}
        type="search"
        name="query"
        placeholder="Search pastes"
        autoComplete="off"
      />
    </form>
  );
};

export default Search;
