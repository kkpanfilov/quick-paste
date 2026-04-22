import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";
import styles from "./New.module.scss";

const New = () => {
  useDocumentTitle("New");

  return (
    <main className={styles.screen}>
      <section className={styles.panel} aria-labelledby="new-paste-title">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Create</p>
          <h1 id="new-paste-title" className={styles.title}>
            New paste
          </h1>
          <p className={styles.subtitle}>
            Add title, select language, and paste your content.
          </p>
        </header>

        <form className={styles.form} noValidate>
          <div className={styles.group}>
            <label htmlFor="new-title" className={styles.label}>
              Title
            </label>
            <input
              id="new-title"
              name="title"
              type="text"
              className={styles.input}
              placeholder="e.g. api-gateway-notes.ts"
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.group}>
              <label htmlFor="new-language" className={styles.label}>
                Language
              </label>
              <select id="new-language" name="language" className={styles.input}>
                <option>Plain text</option>
                <option>JavaScript</option>
                <option>TypeScript</option>
                <option>Python</option>
              </select>
            </div>

            <div className={styles.group}>
              <label htmlFor="new-expire" className={styles.label}>
                Expiration
              </label>
              <select id="new-expire" name="expiration" className={styles.input}>
                <option>Never</option>
                <option>1 hour</option>
                <option>1 day</option>
                <option>7 days</option>
              </select>
            </div>
          </div>

          <div className={styles.group}>
            <label htmlFor="new-content" className={styles.label}>
              Content
            </label>
            <textarea
              id="new-content"
              name="content"
              className={styles.textarea}
              placeholder="Paste code or text here..."
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton}>
              Clear
            </button>
            <button type="submit" className={styles.primaryButton}>
              Create paste
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default New;
