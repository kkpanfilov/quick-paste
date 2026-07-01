import { languageMap } from "@/shared/lists/language.map.js";

import styles from "./LanguageItem.module.scss";

type Props = {
  language: keyof typeof languageMap;
  count: number;
};

export const LanguageItem = ({ language, count }: Props) => {
  return (
    <li className={styles.languageListItem}>
      <span>{languageMap[language]}</span>
      <strong>
        {count} {count > 1 ? "pastes" : "paste"}
      </strong>
    </li>
  );
};
