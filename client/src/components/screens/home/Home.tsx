import { useMemo, useRef, useState } from "react";

import { Loader } from "@/components/ui/loader/Loader.tsx";
import { Pagination } from "@/components/ui/pagination/Pagination.tsx";
import { PasteCard } from "@/components/ui/paste-card/PasteCard.tsx";
import { useGetOwnPastes } from "@/hooks/pastes/useGetOwnPastes.ts";
import { useGetPublicPaste } from "@/hooks/pastes/useGetPublicPastes.ts";
import { useLoadLanguages } from "@/hooks/syntax-highlighter/useLoadLanguages.ts";
import { useAppNavigation } from "@/hooks/useAppNavigation.ts";
import { useAuth } from "@/hooks/useAuth.ts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";
import { registeredLanguages } from "@/shared/languagesStore.ts";

import { formatPastesData } from "../../../utils/formatPastesData.ts";
import { ErrorPage } from "../error/ErrorPage.tsx";

import styles from "./Home.module.scss";

export const Home = () => {
  useDocumentTitle("Home");

  const { notifyWarning } = useNotifications();

  const { isAuth } = useAuth();

  const [isHighlightReady, setIsHighlightReady] = useState(false);
  const registeredLanguagesRef = useRef(registeredLanguages);

  const [page, setPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState(
    isAuth ? "workspace" : "feed",
  );

  const { goNew } = useAppNavigation();

  const ownPastesQuery = useGetOwnPastes(page, {
    enabled: currentCategory === "workspace",
  });

  const publicPastesQuery = useGetPublicPaste(page, {
    enabled: currentCategory === "feed",
  });

  const { data, isLoading, error } =
    currentCategory === "workspace" ? ownPastesQuery : publicPastesQuery;

  const { items, meta, languages } = useMemo(
    () =>
      data ? formatPastesData(data) : { items: [], meta: null, languages: [] },
    [data],
  );

  useLoadLanguages({
    languages,
    registeredLanguagesRef,
    setIsHighlightReady,
  });

  if (isLoading) {
    return (
      <main>
        <Loader isVisible label="Loading pastes..." />
      </main>
    );
  }

  if (!isHighlightReady) {
    return <Loader isVisible label="Loading languages..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Failed to load pastes"
        description="The paste feed is temporarily unavailable"
      />
    );
  }

  const onPageChange = (page: number) => {
    setPage(page);
  };

  return (
    <main className={styles.screen}>
      <section className={styles.container}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Recent pastes</p>
          <h1 className={styles.title}>
            <span
              className={styles.title_option}
              aria-disabled={!isAuth}
              aria-pressed={currentCategory === "workspace"}
              onClick={() => {
                if (!isAuth) {
                  notifyWarning({
                    title: "You need to be logged in to access your workspace",
                    message: "Please log in to continue",
                  });
                  return;
                }

                setCurrentCategory("workspace");
                setPage(1);
              }}
            >
              Workspace
            </span>{" "}
            /{" "}
            <span
              className={styles.title_option}
              aria-pressed={currentCategory === "feed"}
              onClick={() => {
                setCurrentCategory("feed");
                setPage(1);
              }}
            >
              Feed
            </span>
          </h1>
          <p className={styles.subtitle}>
            {currentCategory === "workspace"
              ? `Latest snippets from your workspace. Quickly preview and continue
            where you left off.`
              : `The public feed of all the latest pastes from the community.`}
          </p>
        </section>
        <section className={styles.feed} aria-label="Recent pastes">
          {!items.length && (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>
                {currentCategory === "workspace"
                  ? "No pastes in your workspace yet"
                  : "No public pastes yet"}
              </p>
              <p className={styles.emptyText}>
                {currentCategory === "workspace"
                  ? "Create your first paste and it will appear here."
                  : "The public feed is empty. Check back later or publish a paste."}
              </p>
              {currentCategory === "workspace" && (
                <button
                  className={styles.emptyButton}
                  type="button"
                  onClick={goNew}
                >
                  Create paste
                </button>
              )}
            </div>
          )}
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
