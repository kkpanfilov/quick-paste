import { useEffect } from "react";

import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useAuth } from "@/hooks/useAuth.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import { NewPasteForm } from "./components/new-paste-form/NewPasteForm.jsx";

import styles from "./New.module.scss";

export const New = () => {
  const { isAuth } = useAuth();
  const { goSignIn } = useAppNavigation();

  useEffect(() => {
    if (!isAuth) goSignIn();
  }, [isAuth, goSignIn]);

  useDocumentTitle("Create new paste");

  return (
    <main className={styles.screen}>
      <section className={styles.panel} aria-labelledby="new-paste-title">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Create</p>
          <h1 id="new-paste-title" className={styles.title}>
            New paste
          </h1>
          <p className={styles.subtitle}>
            Create a new public or private paste.
          </p>
        </header>
        <NewPasteForm />
      </section>
    </main>
  );
};
