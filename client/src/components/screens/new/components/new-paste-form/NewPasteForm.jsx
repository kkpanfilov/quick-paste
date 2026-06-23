import { Button } from "@/components/ui/button/Button.jsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { Select } from "@/components/ui/select/Select.jsx";
import { TagEditor } from "@/components/ui/tag-editor/TagEditor.jsx";
import {
  categoryList,
  expirationList,
  languageList,
} from "@/shared/lists/new-paste.list.js";

import { useNewPasteForm } from "./hooks/useNewPasteForm.jsx";

import styles from "./NewPasteForm.module.scss";

export const NewPasteForm = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    errors,
    onSubmit,
    isPending,
    availableExposureList,
  } = useNewPasteForm();

  const newPasteForm = {
    control,
    setValue,
  };

  return (
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

      <TagEditor
        form={newPasteForm}
        id="new-tags"
        name="tags"
        placeholder="Add tags to your paste (optional)"
      />

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
          {errors.content && <ErrorMessage message={errors.content.message} />}
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
  );
};
