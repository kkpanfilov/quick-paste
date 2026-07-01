import { formatDistanceToNow } from "date-fns";

import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { type Exposure, exposureMap } from "@/shared/lists/exposure.map.js";
import { languageMap } from "@/shared/lists/language.map.js";
import type { RecentPasteItem } from "@/types/paste.types.ts";

import styles from "./RecentPaste.module.scss";

export const RecentPaste = ({
  id,
  title,
  description,
  language,
  updatedAt,
  exposure,
}: RecentPasteItem) => {
  const { goPaste } = useAppNavigation();

  return (
    <article className={styles.pasteItem} onClick={() => goPaste(id)}>
      <div>
        <h3 className={styles.pasteTitle}>{title}</h3>
        <p className={styles.pasteMeta}>
          {languageMap[language]} / updated{" "}
          {formatDistanceToNow(new Date(updatedAt), {
            includeSeconds: true,
            addSuffix: true,
          })}
        </p>
        <p className={styles.pasteDescription}>
          {description || "No description"}
        </p>
      </div>
      <span className={styles.badge}>
        {exposureMap[exposure.toLowerCase() as Exposure]}
      </span>
    </article>
  );
};
