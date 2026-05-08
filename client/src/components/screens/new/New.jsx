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
    },
  });

  const { isAuth } = useAuth();
  const { goSignIn, goPaste } = useAppNavigation();

  // TODO: even with access token user redirects to sign in
  useEffect(() => {
    if (!isAuth) goSignIn();
  });

  const { mutateAsync: createPaste, isPending } = useCreatePaste();

  useDocumentTitle("New");

  const onSubmit = async (body) => {
    const data = await createPaste(body);

    console.log(data);

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
            Add title, select language, and paste your content.
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
                <option selected value="plain">
                  Plain text
                </option>
                <option value="markdown">Markdown</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="java">Java</option>
                <option value="sql">SQL</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="toml">TOML</option>
                <option value="bash">Bash</option>
                <option value="dockerfile">Dockerfile</option>
                <option value="lua">Lua</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
                <option value="scala">Scala</option>
                <option value="r">R</option>
                <option value="dart">Dart</option>
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
                <option selected value="never">
                  Never
                </option>
                <option value="burn">Burn after read</option>
                <option value="10m">10 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="1d">1 Day</option>
                <option value="3d">3 Days</option>
                <option value="1w">1 Week</option>
                <option value="2w">2 Weeks</option>
                <option value="1m">1 Month</option>
                <option value="6m">6 Months</option>
                <option value="1y">1 Year</option>
              </Select>
            </div>
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
                  value: 10000,
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
