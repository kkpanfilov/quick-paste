import { Link } from "react-router";

import Button from "@/components/ui/button/Button.jsx";
import Field from "@/components/ui/field/Field.jsx";
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
            <Field
              id="register-email"
              name="email"
              type="email"
              className={styles.registerField}
              placeholder="name@example.com"
              autoComplete="email"
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="register-username" className={styles.label}>
              Username
            </label>
            <Field
              id="register-username"
              name="username"
              type="text"
              className={styles.registerField}
              placeholder="your-username"
              autoComplete="username"
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="register-password" className={styles.label}>
              Password
            </label>
            <Field
              id="register-password"
              name="password"
              type="password"
              className={styles.registerField}
              placeholder="Create password"
              autoComplete="new-password"
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="register-confirm-password" className={styles.label}>
              Confirm password
            </label>
            <Field
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              className={styles.registerField}
              placeholder="Repeat password"
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" variant="primary" className={styles.submit}>
            Create account
          </Button>
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
