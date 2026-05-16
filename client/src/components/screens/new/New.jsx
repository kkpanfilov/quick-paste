import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button/Button.jsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { Select } from "@/components/ui/select/Select.jsx";
import { useCreatePaste } from "@/hooks/pastes/useCreatePaste.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useAuth } from "@/hooks/useAuth.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";

import {
  categoryList,
  expirationList,
  exposureList,
  languageList,
} from "../home/assets/new-paste.list.js";

import styles from "./New.module.scss";

export const New = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      content: "",
      language: "plain",
      expiration: "never",
      category: "none",
      exposure: "public",
      password: null,
    },
  });

  const { isAuth } = useAuth();
  const { goSignIn, goPaste } = useAppNavigation();

  useEffect(() => {
    if (!isAuth) goSignIn();
  });

  const { mutateAsync: createPaste, isPending } = useCreatePaste();

  useDocumentTitle("New");

  const onSubmit = async (body) => {
    if (body.expiration === "burn") {
      body.isBurn = true;
      body.expiration = null;
    } else {
      body.isBurn = false;
    }

    const data = await createPaste(body);

    if (data.id) goPaste(data.id);
  };

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

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.group}>
            <label htmlFor="new-title" className={styles.label}>
              Title{" "}
              {errors.title && <ErrorMessage message={errors.title.message} />}
            </label>
            <Field
              id="new-title"
              name="title"
              type="text"
              className={styles.input}
              placeholder="e.g. api-gateway-notes.ts"
              {...register("title", {
                required: "is required",
                maxLength: {
                  value: 64,
                  message: "is too long",
                },
              })}
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.group}>
              <label htmlFor="new-language" className={styles.label}>
                Language{" "}
                {errors.language && (
                  <ErrorMessage message={errors.language.message} />
                )}
              </label>
              <Select
                id="new-language"
                name="language"
                className={styles.select}
                {...register("language", {
                  required: "is required",
                })}
              >
                {languageList.map(({ label, value, selected }) => (
                  <option selected={selected} key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div className={styles.group}>
              <label htmlFor="new-expire" className={styles.label}>
                Expiration{" "}
                {errors.expiration && (
                  <ErrorMessage message={errors.expiration.message} />
                )}
              </label>
              <Select
                id="new-expire"
                name="expiration"
                className={styles.select}
                {...register("expiration", {
                  required: "is required",
                })}
              >
                {expirationList.map(({ label, value, selected }) => (
                  <option selected={selected} key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div className={styles.group}>
              <label htmlFor="new-category" className={styles.label}>
                Category{" "}
                {errors.category && (
                  <ErrorMessage message={errors.category.message} />
                )}
              </label>
              <Select
                id="new-category"
                name="category"
                className={styles.select}
                {...register("category", {
                  required: "is required",
                })}
              >
                {categoryList.map(({ label, value, selected }) => (
                  <option selected={selected} key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div className={styles.group}>
              <label htmlFor="new-exposure" className={styles.label}>
                Exposure{" "}
                {errors.exposure && (
                  <ErrorMessage message={errors.exposure.message} />
                )}
              </label>
              <Select
                id="new-exposure"
                name="exposure"
                className={styles.select}
                {...register("exposure", {
                  required: "is required",
                })}
              >
                {exposureList.map(({ label, value, selected }) => (
                  <option selected={selected} key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className={styles.group}>
            <label htmlFor="new-password" className={styles.label}>
              Password{" "}
              {errors.password && (
                <ErrorMessage message={errors.password.message} />
              )}
            </label>
            <Field
              id="new-password"
              name="password"
              type="text"
              className={styles.input}
              placeholder="Password (optional)"
              {...register("password", {
                maxLength: {
                  value: 32,
                  message: "is too long",
                },
              })}
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="new-content" className={styles.label}>
              Content{" "}
              {errors.content && (
                <ErrorMessage message={errors.content.message} />
              )}
            </label>
            <Field
              tag="textarea"
              id="new-content"
              name="content"
              className={styles.textarea}
              placeholder="Paste code or text here..."
              {...register("content", {
                required: "is required",
                maxLength: {
                  value: 100000,
                  message: "is too long",
                },
              })}
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="submit"
              variant="primary"
              className={styles.createPasteButton}
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create paste"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
};
