import { useForm } from "react-hook-form";
import { Link } from "react-router";

import Button from "@/components/ui/button/Button.jsx";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import styles from "./Signin.module.scss";

const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      agree: false,
    },
  });

  const onSubmit = async (data) => {
    console.log("Data:", data);
  };

  useDocumentTitle("Sign in");

  // TODO: перенести inputs, fields, buttons в отдельные ui компоненты (components/ui)
  return (
    <main className={styles.screen}>
      <section className={styles.card} aria-labelledby="signin-title">
        <header className={styles.header}>
          <h1 id="signin-title" className={styles.title}>
            Welcome back
          </h1>
          <p className={styles.subtitle}>Sign in to continue to Quick Paste.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Некорректный email",
                },
              })}
            />
            {errors.email && <p>{errors.email.message}</p>}
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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <div className={styles.actions}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                name="remember"
                {...register("agree", { required: true })}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot" className={styles.link}>
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" className={styles.submit}>
            Sign in
          </Button>
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
