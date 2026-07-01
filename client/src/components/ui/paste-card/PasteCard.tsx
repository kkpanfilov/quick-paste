import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useAppNavigation } from "@/hooks/useAppNavigation.ts";
import type { FormattedFeedPasteItem } from "@/types/paste.types.ts";

import styles from "./PasteCard.module.scss";

type Props = {
  paste: FormattedFeedPasteItem;
};

export const PasteCard = ({ paste }: Props) => {
  const { goPaste } = useAppNavigation();

  return (
    <article
      className={styles.card}
      key={paste.id}
      onClick={() => goPaste(paste.id)}
    >
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{paste.title}</h2>
        <div className={styles.cardTags}>
          {paste.pasteTags.map((tag) => (
            <span className={styles.tag} key={tag}>
              {tag}
            </span>
          ))}
          <span className={styles.tag} hidden={!paste.categoryLabel}>
            {paste.categoryLabel}
          </span>
          <span className={styles.tag}>{paste.languageLabel}</span>
        </div>
      </header>
      <SyntaxHighlighter
        className={styles.preview}
        language={paste.language.toLowerCase()}
        style={oneDark}
        showLineNumbers={true}
        codeTagProps={{
          style: {
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          },
        }}
      >
        {paste.content}
      </SyntaxHighlighter>
      <div className={styles.codeBlockFade} />
      <footer className={styles.meta}>
        <div>
          <span>{paste.createdAt}</span>
          <span className={styles.likes}>
            <svg
              className={styles.likeIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 21s-6.7-4.4-9.3-8.4C.4 9.1 2.3 4.5 6.4 4.2c2-.2 3.5.8 4.4 2.1.9-1.3 2.4-2.3 4.4-2.1 4.1.3 6 4.9 3.7 8.4C16.7 16.6 12 21 12 21Z" />
            </svg>
            {paste.likesCount}
          </span>
        </div>
        <div>
          <span>
            {paste.lines} lines / {paste.size}
          </span>
        </div>
      </footer>
    </article>
  );
};
