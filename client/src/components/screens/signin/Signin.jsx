import { Link } from "react-router";

import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import styles from "./Signin.module.scss";

const Signin = () => {
  useDocumentTitle("Sign in");

  return (
    <main className={styles.screen}>
      <section className={styles.card} aria-labelledby="signin-title">
        <header className={styles.header}>
          <h1 id="signin-title" className={styles.title}>
            Welcome back
          </h1>
          <p className={styles.subtitle}>Sign in to continue to Quick Paste.</p>
        </header>

        <form className={styles.form} noValidate>
          <div className={styles.group}>
            <label htmlFor="signin-email" className={styles.label}>
              Email
            </label>
            <input
              id="signin-email"
              name="email"
              type="email"
              className={styles.input}
              placeholder="name@example.com"
              autoComplete="email"
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="signin-password" className={styles.label}>
              Password
            </label>
            <input
              id="signin-password"
              name="password"
              type="password"
              className={styles.input}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          <div className={styles.actions}>
            <label className={styles.remember}>
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot" className={styles.link}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className={styles.submit}>
            Sign in
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link to="/register" className={styles.footerLink}>
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Signin;
