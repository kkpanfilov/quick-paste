import { useEffect, useMemo, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Loader } from "@/components/ui/loader/Loader.jsx";
import { Pagination } from "@/components/ui/pagination/Pagination.jsx";
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

  const { goNew, goPaste } = useAppNavigation();

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
        console.log("Language loaded:", language);
      }

      console.log("All languages loaded");
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
          ))}
        </section>
        {!!items.length && (
          <Pagination {...meta} pageLimit={4} onPageChange={onPageChange} />
        )}
      </section>
    </main>
  );
};
