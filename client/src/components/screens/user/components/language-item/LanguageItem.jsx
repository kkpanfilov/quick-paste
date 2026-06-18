import { languageMap } from "@/shared/lists/language.map.js";

import styles from "./LanguageItem.module.scss";

export const LanguageItem = ({ language, count }) => {
  return (
    <li className={styles.languageListItem}>
      <span>{languageMap[language]}</span>
      <strong>
        {count} {count > 1 ? "pastes" : "paste"}
      </strong>
    </li>
  );
};
