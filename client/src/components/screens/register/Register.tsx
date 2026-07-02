import { type SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router";

import { isApiError } from "@/api/apiClient.ts";
import { Button } from "@/components/ui/button/Button.tsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.tsx";
import { Field } from "@/components/ui/field/Field.tsx";
import { useRegister } from "@/hooks/auth/useRegister.ts";
import { useAppNavigation } from "@/hooks/useAppNavigation.ts";
import { useAuth } from "@/hooks/useAuth.ts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";
import { setAccessToken } from "@/shared/authStore.ts";
import type { RegisterDto } from "@/types/auth.types.ts";

import styles from "./Register.module.scss";

type FormData = RegisterDto & {
  confirmPassword: string;
};

export const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { notifySuccess, notifyError } = useNotifications();

  const { goHome } = useAppNavigation();

  const { mutateAsync: registerUser, isPending } = useRegister();

  const { login } = useAuth();

  useDocumentTitle("Register");

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const body: RegisterDto = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      };

      const data = await registerUser(body);

      if (!data) return;

      if (data.accessToken) {
        notifySuccess({
          title: "Registration successful",
          message: "You have been registered successfully",
        });
        setAccessToken(data.accessToken);
        goHome();
      }

      login({ userId: data.id });
    } catch (error: unknown) {
      notifyError({
        title: "Registration error",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }
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
              type="email"
              className={styles.registerField}
              placeholder="name@example.com"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email",
                },
                minLength: {
                  value: 6,
                  message: "Email must be at least 6 characters long",
                },
                maxLength: {
                  value: 50,
                  message: "Email must be at most 50 characters long",
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
              type="text"
              className={styles.registerField}
              placeholder="your-username"
              autoComplete="username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 4,
                  message: "Username must be at least 4 characters long",
                },
                maxLength: {
                  value: 20,
                  message: "Username must be at most 20 characters long",
                },
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
              type="password"
              className={styles.registerField}
              placeholder="Create password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,64}$/,
                  message:
                    "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
                },
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                maxLength: {
                  value: 64,
                  message: "Password must be at most 64 characters long",
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

          <Button
            type="submit"
            variant="primary"
            className={styles.submit}
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create account"}
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
