import styles from "./SearchIcon.module.scss";

const SearchIcon = () => {
  return (
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
  );
};

export default SearchIcon;
