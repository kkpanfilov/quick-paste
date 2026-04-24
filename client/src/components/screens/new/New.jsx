import Button from "@/components/ui/button/Button.jsx";
import Field from "@/components/ui/field/Field.jsx";
import Select from "@/components/ui/select/Select.jsx";
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
            <Field
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
              <Select
                id="new-language"
                name="language"
                className={styles.select}
              >
                <option>Plain text</option>
                <option>JavaScript</option>
                <option>TypeScript</option>
                <option>Python</option>
              </Select>
            </div>

            <div className={styles.group}>
              <label htmlFor="new-expire" className={styles.label}>
                Expiration
              </label>
              <Select
                id="new-expire"
                name="expiration"
                className={styles.select}
              >
                <option>Never</option>
                <option>1 hour</option>
                <option>1 day</option>
                <option>7 days</option>
              </Select>
            </div>
          </div>

          <div className={styles.group}>
            <label htmlFor="new-content" className={styles.label}>
              Content
            </label>
            <Field
              tag="textarea"
              id="new-content"
              name="content"
              className={styles.textarea}
              placeholder="Paste code or text here..."
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="submit"
              variant="primary"
              className={styles.createPasteButton}
            >
              Create paste
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default New;
