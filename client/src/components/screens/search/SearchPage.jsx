import { useParams } from "react-router";

import styles from "./SearchPage.module.scss";

export const SearchPage = () => {
  const params = useParams();
  const query = params.query;

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
              24 public pastes found. Showing the most relevant snippets first.
            </p>
          </div>

          <div className={styles.summary} aria-label="Search summary">
            <span className={styles.summaryValue}>24</span>
            <span className={styles.summaryLabel}>matches</span>
          </div>
        </header>

        <section className={styles.results} aria-label="Found pastes">
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>
                  React form validation example
                </h2>
                <p className={styles.cardDescription}>
                  A compact example of client-side validation with reusable
                  field components and clear error messages.
                </p>
              </div>

              <span className={styles.language}>JavaScript</span>
            </header>

            <pre className={styles.preview}>
              <code>{`const isValid = values.email && values.password.length >= 8;`}</code>
            </pre>

            <footer className={styles.meta}>
              <span>by alexdev</span>
              <span>Jun 12, 2026</span>
              <span>18 lines</span>
              <span>12 likes</span>
            </footer>
          </article>

          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Reusable search input</h2>
                <p className={styles.cardDescription}>
                  Search field markup with keyboard-friendly labels, placeholder
                  text, and a simple submit button.
                </p>
              </div>

              <span className={styles.language}>HTML</span>
            </header>

            <pre className={styles.preview}>
              <code>{`<form role="search" aria-label="Search pastes">...</form>`}</code>
            </pre>

            <footer className={styles.meta}>
              <span>by kate-ui</span>
              <span>Jun 9, 2026</span>
              <span>9 lines</span>
              <span>7 likes</span>
            </footer>
          </article>

          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>
                  Pagination component styles
                </h2>
                <p className={styles.cardDescription}>
                  SCSS module for pagination controls with active, hover, focus,
                  and disabled states.
                </p>
              </div>

              <span className={styles.language}>SCSS</span>
            </header>

            <pre className={styles.preview}>
              <code>{`.paginationButton[aria-current="page"] { color: $text-primary; }`}</code>
            </pre>

            <footer className={styles.meta}>
              <span>by frontendlab</span>
              <span>Jun 4, 2026</span>
              <span>31 lines</span>
              <span>19 likes</span>
            </footer>
          </article>
        </section>

        <nav className={styles.pagination} aria-label="Search results pages">
          <a
            className={`${styles.pageLink} ${styles.pageLinkDisabled}`}
            href="/search?q=react&page=1"
            aria-disabled="true"
          >
            Prev
          </a>
          <a
            className={`${styles.pageLink} ${styles.pageLinkActive}`}
            href="/search?q=react&page=1"
            aria-current="page"
          >
            1
          </a>
          <a className={styles.pageLink} href="/search?q=react&page=2">
            2
          </a>
          <a className={styles.pageLink} href="/search?q=react&page=3">
            3
          </a>
          <span className={styles.pageDots}>...</span>
          <a className={styles.pageLink} href="/search?q=react&page=8">
            8
          </a>
          <a className={styles.pageLink} href="/search?q=react&page=2">
            Next
          </a>
        </nav>
      </section>
    </main>
  );
};
