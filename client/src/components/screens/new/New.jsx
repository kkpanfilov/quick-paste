import { useEffect, useState } from "react";

import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button/Button.jsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { Select } from "@/components/ui/select/Select.jsx";
import { useCreatePaste } from "@/hooks/pastes/useCreatePaste.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useAuth } from "@/hooks/useAuth.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";
import { nullIfBlank } from "@/utils/nullIfBlank.js";

import {
  categoryList,
  expirationList,
  exposureList,
  languageList,
} from "../../../shared/lists/new-paste.list.js";

import styles from "./New.module.scss";

export const New = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      content: "",
      description: "",
      tags: [],
      language: "plain",
      expiration: "never",
      category: "none",
      exposure: "public",
      password: "",
    },
  });

  const { isAuth } = useAuth();
  const { goSignIn, goPaste } = useAppNavigation();

  useEffect(() => {
    if (!isAuth) goSignIn();
  });

  const { mutateAsync: createPaste, isPending } = useCreatePaste();

  useDocumentTitle("New");

  const password = useWatch({
    control,
    name: "password",
  });

  const exposure = useWatch({
    control,
    name: "exposure",
  });

  const hasPassword = password?.trim().length > 0;

  const availableExposureList = hasPassword
    ? exposureList.filter((item) => item.value !== "public")
    : exposureList;

  useEffect(() => {
    if (hasPassword && exposure === "public") {
      setValue("exposure", "unlisted");
    }
  }, [hasPassword, exposure, setValue]);

  const onSubmit = async (body) => {
    if (body.expiration === "burn") {
      body.isBurn = true;
      body.expiration = null;
    } else {
      body.isBurn = false;
    }

    body.description = nullIfBlank(body.description);

    const data = await createPaste(body);

    if (data.id) goPaste(data.id);
  };

  const [tag, setTag] = useState("");

  const tags = useWatch({
    control,
    name: "tags",
  });

  const onEnter = (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    addTag();
  };

  const addTag = () => {
    const value = tag.trim();

    if (!value) return;
    if (value.length < 1 || value.length > 30) return;
    if (tags.length >= 5) return;
    if (tags.includes(value)) return;

    setValue("tags", [...tags, value], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setTag("");
  };

  const removeTag = (tag) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
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

          <div className={styles.group}>
            <label htmlFor="new-description" className={styles.label}>
              Description{" "}
              {errors.description && (
                <ErrorMessage message={errors.description.message} />
              )}
            </label>
            <Field
              tag="textarea"
              id="new-description"
              name="description"
              className={styles.textarea}
              placeholder="Add a description to your paste (optional)"
              rows={3}
              {...register("description", {
                maxLength: {
                  value: 1000,
                  message: "is too long",
                },
              })}
            />
          </div>

          <div className={styles.group}>
            <label htmlFor="new-tags" className={styles.label}>
              Tags
            </label>
            <div className={styles.tags}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <span
                    className={styles.tagClose}
                    onClick={() => removeTag(tag)}
                  >
                    X
                  </span>
                </span>
              ))}
            </div>
            <Field
              id="new-tags"
              name="tags"
              type="text"
              className={styles.input}
              placeholder="Add tags (optional)"
              onKeyDown={onEnter}
              value={tag}
              onChange={(event) => setTag(event.target.value)}
            ></Field>
            <Button
              variant="primary"
              className={styles.addTagButton}
              disabled={tag === ""}
              onClick={() => addTag(event)}
            >
              Add
            </Button>
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
                {languageList.map(({ label, value }) => (
                  <option key={value} value={value}>
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
                {expirationList.map(({ label, value }) => (
                  <option key={value} value={value}>
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
                {categoryList.map(({ label, value }) => (
                  <option key={value} value={value}>
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
                {availableExposureList.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className={styles.group}>
            <label htmlFor="new-password" className={styles.label}>
              Password
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
              rows={10}
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
