import { Field } from "@/components/ui/field/Field.jsx";
import { SearchIcon } from "@/components/ui/search-icon/SearchIcon.jsx";

import styles from "./Search.module.scss";

// TODO: implement search
export const Search = () => {
  return (
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
  );
};
