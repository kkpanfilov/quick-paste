import { useEffect, useMemo, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

import { Loader } from "@/components/ui/loader/Loader.jsx";
import { Pagination } from "@/components/ui/pagination/Pagination.jsx";
import { PasteCard } from "@/components/ui/paste-card/PasteCard.jsx";
import { useGetOwnPaste } from "@/hooks/pastes/useGetOwnPastes.js";
import { useGetPublicPaste } from "@/hooks/pastes/useGetPublicPastes.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useAuth } from "@/hooks/useAuth.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";
import { languageLoaders } from "@/shared/lib/syntax-highlighter/language-loaders.js";
import { addNotification } from "@/store/notification/notificationSlice.js";

import { ErrorPage } from "../error/ErrorPage.jsx";
import { formatData } from "./utils/formatData.js";

import styles from "./Home.module.scss";

export const Home = () => {
  useDocumentTitle("Home");

  const { isAuth } = useAuth();
  const dispatch = useDispatch();

  const [areLanguagesLoaded, setAreLanguagesLoaded] = useState(false);
  const registeredLanguagesRef = useRef(new Set());

  const [page, setPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState(
    isAuth ? "workspace" : "feed",
  );

  const { goNew } = useAppNavigation();

  const ownPasteQuery = useGetOwnPaste(page, {
    enabled: currentCategory === "workspace",
  });

  const publicPasteQuery = useGetPublicPaste(page, {
    enabled: currentCategory === "feed",
  });

  const { data, isLoading, error } =
    currentCategory === "workspace" ? ownPasteQuery : publicPasteQuery;

  const { items, meta, languages } = useMemo(
    () => (data ? formatData(data) : { items: [], meta: null, languages: [] }),
    [data],
  );

  useEffect(() => {
    async function loadLanguages() {
      if (!languages.length) {
        setAreLanguagesLoaded(true);
        return;
      }

      for (const language of languages) {
        if (registeredLanguagesRef.current.has(language)) continue;

        const loader = languageLoaders[language];

        if (!loader) continue;

        registeredLanguagesRef.current.add(language);

        const module = await loader();
        SyntaxHighlighter.registerLanguage(language, module.default);
      }

      setAreLanguagesLoaded(true);
    }

    loadLanguages();
  }, [languages]);

  if (isLoading) {
    return (
      <main>
        <Loader isVisible label="Loading pastes..." />
      </main>
    );
  }

  if (!areLanguagesLoaded) {
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

  const onPageChange = (page) => {
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
                  dispatch(
                    addNotification({
                      type: "warning",
                      title:
                        "You need to be logged in to access your workspace",
                      message: "Please log in to continue",
                    }),
                  );
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
        {!!items.length && (
          <Pagination {...meta} pageLimit={4} onPageChange={onPageChange} />
        )}
      </section>
    </main>
  );
};
