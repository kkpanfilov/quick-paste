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

import styles from "./Register.module.scss";

const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { goHome } = useAppNavigation();
  const dispatch = useDispatch();

  useDocumentTitle("Register");

  const onSubmit = async (formData) => {
    const data = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
    };

    const response = await apiClient("POST", "auth/register", data);

    if (response.accessToken) {
      setAccessToken(response.accessToken);
      goHome();
    }

    dispatch(login({ userId: response.id, isAuth: true }));
  };

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

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors.username && (
              <ErrorMessage message={errors.username.message} />
            )}
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
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <ErrorMessage message={errors.confirmPassword.message} />
            )}
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
