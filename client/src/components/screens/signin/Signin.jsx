import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router";

import { apiClient } from "@/api/apiClient.js";
import Button from "@/components/ui/button/Button.jsx";
import ErrorMessage from "@/components/ui/error-message/ErrorMessage.jsx";
import Field from "@/components/ui/field/Field.jsx";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";
import { setAccessToken } from "@/shared/authStore.js";
import { login } from "@/store/auth/authSlice.js";

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

  const { goHome } = useAppNavigation();
  const dispatch = useDispatch();

  useDocumentTitle("Sign in");

  const onSubmit = async (data) => {
    const response = await apiClient("POST", "auth/login", data);

    if (response.accessToken) {
      setAccessToken(response.accessToken);
      goHome();
    }

    dispatch(login({ userId: response.id, isAuth: true }));
  };

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
            <Field
              id="signin-email"
              name="email"
              type="email"
              className={styles.signInField}
              placeholder="name@example.com"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && <ErrorMessage message={errors.email.message} />}
          </div>
          <div className={styles.group}>
            <label htmlFor="signin-password" className={styles.label}>
              Password
            </label>
            <Field
              id="signin-password"
              name="password"
              type="password"
              className={styles.signInField}
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
            {errors.password && (
              <ErrorMessage message={errors.password.message} />
            )}
          </div>
          <div className={styles.actions}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                name="remember"
                {...register("agree", { required: "Agree is required" })}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot" className={styles.link}>
              Forgot password?
            </Link>
          </div>
          {errors.agree && <ErrorMessage message={errors.agree.message} />}

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
