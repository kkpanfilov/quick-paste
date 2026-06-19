import { useState } from "react";

import { Button } from "@/components/ui/button/Button.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { SearchIcon } from "@/components/ui/search-icon/SearchIcon.jsx";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";

import styles from "./Search.module.scss";

// TODO: implement search
export const Search = ({ type, setIsHamburgerOpen }) => {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();

  const { goSearch } = useAppNavigation();

  const goToSearchPage = () => {
    if (!trimmedQuery) return;

    goSearch(`${encodeURIComponent(trimmedQuery)}`);
    setQuery("");
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      goToSearchPage();
    }
  };

  return (
    <>
      <form className={type === "mobile" ? styles.searchMobile : styles.search}>
        <SearchIcon />
        <Field
          className={
            type === "mobile" ? styles.searchFieldMobile : styles.searchField
          }
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Search pastes"
        />
      </form>
      {type === "mobile" && (
        <Button
          className={styles.searchButton}
          onClick={() => {
            goToSearchPage();
            setIsHamburgerOpen(false);
          }}
        >
          Search
        </Button>
      )}
    </>
  );
};
