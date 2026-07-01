import { useMemo, useRef, useState } from "react";

import { useParams } from "react-router";

import { Loader } from "@/components/ui/loader/Loader.jsx";
import { Pagination } from "@/components/ui/pagination/Pagination.jsx";
import { PasteCard } from "@/components/ui/paste-card/PasteCard.jsx";
import { useSearchPastes } from "@/hooks/pastes/useSearchPastes.js";
import { useLoadLanguages } from "@/hooks/syntax-highlighter/useLoadLanguages.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";
import { registeredLanguages } from "@/shared/languagesStore.js";
import { formatPastesData } from "@/utils/formatPastesData.js";

import { ErrorPage } from "../error/ErrorPage.js";

import styles from "./SearchPage.module.scss";

type Props = {
  query: string;
};

export const SearchPage = () => {
  const { query } = useParams<"query">();

  if (!query || !query.trim().length) {
    return (
      <ErrorPage
        title="Failed to searh paste"
        description="The paste search is temporarily unavailable"
      />
    );
  }

  return <SearchPageView query={query} />;
};

export const SearchPageView = ({ query }: Props) => {
  useDocumentTitle(`Search ${query}`);

  const [page, setPage] = useState(1);
  const [isHighlightReady, setIsHighlightReady] = useState(false);
  const registeredLanguagesRef = useRef(registeredLanguages);

  const { data, isLoading, error } = useSearchPastes(query, page);

  const { items, meta, languages } = useMemo(
    () =>
      data ? formatPastesData(data) : { items: [], meta: null, languages: [] },
    [data],
  );

  const onPageChange = (page: number) => {
    setPage(page);
  };

  useLoadLanguages({
    languages,
    registeredLanguagesRef,
    setIsHighlightReady,
  });

  if (isLoading) {
    return (
      <main>
        <Loader isVisible label="Loading search pastes..." />
      </main>
    );
  }

  if (!isHighlightReady) {
    return <Loader isVisible label="Loading languages..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Failed to searh paste"
        description="The paste search is temporarily unavailable"
      />
    );
  }

  if (!items.length) {
    return (
      <ErrorPage
        code="404"
        title="No results found"
        description="We could not find any pastes matching your search query"
      />
    );
  }

  return (
    <main className={styles.screen}>
      <section className={styles.container} aria-labelledby="search-title">
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Search results</p>
            <h1 id="search-title" className={styles.title}>
              {`Results for "${query}"`}
            </h1>
            <p className={styles.subtitle}>
              {meta && meta.totalMatches} public pastes found. Showing the most
              relevant snippets first.
            </p>
          </div>

          <div className={styles.summary} aria-label="Search summary">
            <span className={styles.summaryValue}>
              {meta && meta.totalMatches}
            </span>
            <span className={styles.summaryLabel}>matches</span>
          </div>
        </header>

        <section className={styles.results} aria-label="Found pastes">
          {items.map((paste) => (
            <PasteCard key={paste.id} paste={paste} />
          ))}
        </section>
        {meta && items.length > 0 && (
          <Pagination {...meta} pageLimit={4} onPageChange={onPageChange} />
        )}
      </section>
    </main>
  );
};
