import { Link } from "react-router";

import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import styles from "./Register.module.scss";

const Register = () => {
  useDocumentTitle("Register");

  return (
    <main className={styles.screen}>
      <section className={styles.card} aria-labelledby="register-title">
        <header className={styles.header}>
          <h1 id="register-title" className={styles.title}>
            Create account
          </h1>
          <p className={styles.subtitle}>
            Register to save and manage your snippets.
          </p>
        </header>

        <form className={styles.form} noValidate>
          <div className={styles.group}>
            <label htmlFor="register-email" className={styles.label}>
              Email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              className={styles.input}
              placeholder="name@example.com"
              autoComplete="email"
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="register-username" className={styles.label}>
              Username
            </label>
            <input
              id="register-username"
              name="username"
              type="text"
              className={styles.input}
              placeholder="your-username"
              autoComplete="username"
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="register-password" className={styles.label}>
              Password
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              className={styles.input}
              placeholder="Create password"
              autoComplete="new-password"
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="register-confirm-password" className={styles.label}>
              Confirm password
            </label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              className={styles.input}
              placeholder="Repeat password"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className={styles.submit}>
            Create account
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link to="/signin" className={styles.footerLink}>
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
