import { useState } from "react";

import { Button } from "@/components/ui/button/Button.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { SearchIcon } from "@/components/ui/search-icon/SearchIcon.jsx";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";

import styles from "./Search.module.scss";

type SearchType = "pc" | "mobile";

type Props = {
  type: SearchType;
  setIsHamburgerOpen?: (value: boolean) => void;
};

export const Search = ({ type, setIsHamburgerOpen }: Props) => {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();

  const { goSearch } = useAppNavigation();

  const goToSearchPage = () => {
    if (!trimmedQuery) return;

    goSearch(`${encodeURIComponent(trimmedQuery)}`);
    setQuery("");
  };

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
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
            if (setIsHamburgerOpen) setIsHamburgerOpen(false);
          }}
        >
          Search
        </Button>
      )}
    </>
  );
};
