import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import {
  type SubmitHandler,
  type UseFormReturn,
  useWatch,
} from "react-hook-form";
import { Link } from "react-router";

import { isApiError } from "@/api/apiClient.ts";
import { Button } from "@/components/ui/button/Button.tsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.tsx";
import { Field } from "@/components/ui/field/Field.tsx";
import { Select } from "@/components/ui/select/Select.tsx";
import { TagEditor } from "@/components/ui/tag-editor/TagEditor.tsx";
import { useNotifications } from "@/hooks/useNotifications.ts";
import { categoryMap } from "@/shared/lists/category.map.ts";
import { exposureMap } from "@/shared/lists/exposure.map.ts";
import { languageMap } from "@/shared/lists/language.map.ts";
import {
  categoryList,
  exposureList,
  languageList,
} from "@/shared/lists/new-paste.list.ts";
import type { Paste, UpdatePasteDto } from "@/types/paste.types.ts";
import { countLines } from "@/utils/countLines.ts";
import { getContentSize } from "@/utils/getContentSize.ts";

import styles from "./PasteHeader.module.scss";

type Props = {
  isAuth: boolean;
  userId: string | null;
  data: Paste;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  setIsConfirmOpen: (value: boolean) => void;
  onUpdate: SubmitHandler<UpdatePasteDto>;
  editForm: UseFormReturn<UpdatePasteDto>;
};

export const PasteHeader = ({
  isAuth,
  userId,
  data,
  isEditing,
  setIsEditing,
  setIsConfirmOpen,
  onUpdate,
  editForm,
}: Props) => {
  const author = data.author;

  const { notifySuccess, notifyError } = useNotifications();

  const onCopy = () => {
    try {
      navigator.clipboard.writeText(data.content);
      notifySuccess({
        title: "Paste copied",
        message: "Paste has been copied to clipboard",
      });
    } catch (error: unknown) {
      notifyError({
        title: "Paste not copied",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }
  };

  const exposure = useWatch({
    control: editForm.control,
    name: "exposure",
    defaultValue: data.exposure,
  });

  const tags = useWatch({
    control: editForm.control,
    name: "tags",
    defaultValue: [],
  });

  const onTagsChange = (tags: string[]) => {
    editForm.setValue("tags", tags, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <>
      <p className={styles.eyebrow}>{data.exposure} paste</p>
      <header className={styles.header}>
        <div className={styles.heading}>
          {editForm.formState.errors.title && (
            <ErrorMessage message={editForm.formState.errors.title.message} />
          )}
          {isEditing ? (
            <Field
              tag="input"
              id="new-title"
              type="text"
              className={styles.pasteInput}
              {...editForm.register("title", {
                required: "Title is required",
                maxLength: {
                  value: 64,
                  message: "Title is too long",
                },
              })}
            />
          ) : (
            <h1 id="paste-title" className={styles.title}>
              {data.title}
            </h1>
          )}
          {editForm.formState.errors.description && (
            <ErrorMessage
              message={editForm.formState.errors.description.message}
            />
          )}
          {isEditing ? (
            <div className={styles.descriptionEditor}>
              <label htmlFor="paste-description">Description</label>
              <Field
                tag="textarea"
                id="paste-description"
                className={styles.descriptionInput}
                placeholder="Add a description to your paste (optional)"
                rows={3}
                {...editForm.register("description", {
                  maxLength: {
                    value: 1000,
                    message: "Description is too long",
                  },
                })}
              />
            </div>
          ) : (
            data.description && (
              <p className={styles.description}>{data.description}</p>
            )
          )}
          <dl className={styles.meta}>
            <div>
              <dt>Category</dt>
              {isEditing ? (
                <Select
                  id="new-category"
                  className={styles.pasteSelect}
                  {...editForm.register("category", {
                    required: "Category is required",
                  })}
                >
                  {categoryList.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              ) : (
                <dd>
                  {categoryMap[data.category]
                    ? categoryMap[data.category]
                    : "None"}
                </dd>
              )}
            </div>
            <div>
              <dt>Language</dt>
              {isEditing ? (
                <Select
                  id="new-language"
                  className={styles.pasteSelect}
                  {...editForm.register("language", {
                    required: "Language is required",
                  })}
                >
                  {languageList.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              ) : (
                <dd>{languageMap[data.language]}</dd>
              )}
            </div>
            <div>
              <dt>Exposure</dt>
              {isEditing ? (
                <Select
                  id="new-exposure"
                  className={styles.pasteSelect}
                  {...editForm.register("exposure", {
                    required: "Exposure is required",
                    validate: (value, formValues) => {
                      if (
                        value === "protected" &&
                        data.exposure !== "protected" &&
                        !formValues.password
                      ) {
                        notifyError({
                          title: "Password is required",
                          message: "Password is required to protect your paste",
                        });
                        return "Password is required";
                      }
                    },
                  })}
                >
                  {exposureList.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              ) : (
                <dd>{exposureMap[data.exposure]}</dd>
              )}
            </div>
            {isEditing && exposure === "protected" && (
              <div className={styles.passwordBlock}>
                <dt>
                  New password{" "}
                  {editForm.formState.errors.password && (
                    <ErrorMessage
                      message={editForm.formState.errors.password.message}
                    />
                  )}
                </dt>
                <Field
                  tag="input"
                  id="new-password"
                  type="text"
                  className={clsx(styles.pasteInput, styles.passwordInput)}
                  placeholder="New password (optional)"
                  {...editForm.register("password", {
                    maxLength: {
                      value: 32,
                      message: "Password is too long",
                    },
                  })}
                />
              </div>
            )}

            <div hidden={isEditing}>
              <dt>Created</dt>
              <dd>
                {formatDistanceToNow(new Date(data.createdAt), {
                  includeSeconds: true,
                  addSuffix: true,
                })}
              </dd>
            </div>
            <div hidden={isEditing}>
              <dt>Created by</dt>
              <dd>
                <Link to={`/user/${data.authorId}`}>{author}</Link>
              </dd>
            </div>
            <div hidden={isEditing}>
              <dt>Size</dt>
              <dd>
                {countLines(data.content)} lines /{" "}
                {getContentSize(data.content)}
              </dd>
            </div>
          </dl>
          {isEditing && (
            <TagEditor
              tags={tags}
              onChange={onTagsChange}
              id="paste-tags"
              name="tags"
              placeholder="Add tags to your paste (optional)"
            />
          )}
        </div>

        <div className={styles.actions} aria-label="Paste actions">
          <Button
            variant="ghost"
            className={styles.actionButton}
            onClick={onCopy}
            hidden={isEditing}
          >
            Copy
          </Button>
          {isAuth && userId === data.authorId && (
            <>
              <Button
                variant="red"
                className={styles.actionButton}
                onClick={() => setIsConfirmOpen(true)}
                hidden={isEditing}
              >
                Delete
              </Button>
              {isEditing && (
                <Button
                  variant="primary"
                  className={styles.actionButton}
                  disabled={
                    Object.keys(editForm.formState.dirtyFields).length === 0
                  }
                  onClick={editForm.handleSubmit(onUpdate)}
                >
                  Save
                </Button>
              )}
              <Button
                variant={isEditing ? "red" : "primary"}
                className={styles.actionButton}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </>
          )}
        </div>
      </header>
    </>
  );
};
