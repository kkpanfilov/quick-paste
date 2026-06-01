import { useState } from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import { anOldHope } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { Loader } from "@/components/ui/loader/Loader.jsx";
import { Pagination } from "@/components/ui/pagination/Pagination.jsx";
import { useGetOwnPaste } from "@/hooks/pastes/useGetOwnPastes.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import { ErrorPage } from "../error/ErrorPage.jsx";
import { formatData } from "./utils/formatData.js";

import styles from "./Home.module.scss";

export const Home = () => {
  useDocumentTitle("Home");

  const [page, setPage] = useState(1);

  const { goPaste } = useAppNavigation();

  const { data, isLoading, error } = useGetOwnPaste(page);

  if (isLoading) {
    return (
      <main>
        <Loader isVisible label="Loading pastes..." />
      </main>
    );
  }

  if (error) {
    return (
      <ErrorPage
        title="Failed to load pastes"
        description="The paste feed is temporarily unavailable"
      />
    );
  }

  const { items, meta } = formatData(data);

  const onPageChange = (page) => {
    setPage(page);
  };

  return (
    <main className={styles.screen}>
      <section className={styles.container}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Recent pastes</p>
          <h1 className={styles.title}>Your workspace</h1>
          <p className={styles.subtitle}>
            Latest snippets from your workspace. Quickly preview and continue
            where you left off.
          </p>
        </section>
        <section className={styles.feed} aria-label="Recent pastes">
          {items.map((paste) => (
            <article
              className={styles.card}
              key={paste.id}
              onClick={() => goPaste(paste.id)}
            >
              <header className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{paste.title}</h2>
                <div className={styles.cardTags}>
                  <span className={styles.category} hidden={!paste.category}>
                    {paste.category}
                  </span>
                  <span className={styles.language}>{paste.language}</span>
                </div>
              </header>
              <SyntaxHighlighter
                className={styles.preview}
                language={data.language}
                style={anOldHope}
              >
                {paste.content}
              </SyntaxHighlighter>
              <footer className={styles.meta}>
                <span>{paste.createdAt}</span>
                <span>
                  {paste.lines} lines / {paste.size}
                </span>
              </footer>
            </article>
          ))}
        </section>
        <Pagination {...meta} pageLimit={4} onPageChange={onPageChange} />
      </section>
    </main>
  );
};
