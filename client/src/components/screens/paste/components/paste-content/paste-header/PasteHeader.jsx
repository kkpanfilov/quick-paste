import { useState } from "react";

import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { useWatch } from "react-hook-form";
import { Link } from "react-router";

import { Button } from "@/components/ui/button/Button.jsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { Select } from "@/components/ui/select/Select.jsx";
import { categoryMap } from "@/shared/lists/category.map.js";
import { exposureMap } from "@/shared/lists/exposure.map.js";
import { languageMap } from "@/shared/lists/language.map.js";
import {
  categoryList,
  exposureList,
  languageList,
} from "@/shared/lists/new-paste.list.js";
import { addNotification } from "@/store/notification/notificationSlice.js";
import { countLines } from "@/utils/countLines.js";
import { getContentSize } from "@/utils/getContentSize.js";

import styles from "./PasteHeader.module.scss";

export const PasteHeader = ({
  dispatch,
  isAuth,
  userId,
  data,
  isEditing,
  setIsEditing,
  setIsConfirmOpen,
  onUpdate,
  editForm,
}) => {
  const author = data.author;

  const onCopy = () => {
    navigator.clipboard.writeText(data.content);
    dispatch(
      addNotification({
        type: "success",
        title: "Paste copied",
        message: "Paste has been copied to clipboard",
      }),
    );
  };

  const exposure = useWatch({
    control: editForm.control,
    name: "exposure",
    defaultValue: data.exposure,
  });

  const [tag, setTag] = useState("");

  const tags = useWatch({
    control: editForm.control,
    name: "tags",
    defaultValue: data.pasteTags,
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

    editForm.setValue("tags", [...tags, value], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setTag("");
  };

  const removeTag = (tag) => {
    editForm.setValue(
      "tags",
      tags.filter((t) => t !== tag),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
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
              name="title"
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
                name="description"
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
                  id="new-language"
                  name="language"
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
                  name="language"
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
                  name="exposure"
                  className={styles.pasteSelect}
                  {...editForm.register("exposure", {
                    required: "Exposure is required",
                    validate: (value, formValues) => {
                      if (
                        value === "protected" &&
                        data.exposure !== "protected" &&
                        !formValues.password
                      ) {
                        dispatch(
                          addNotification({
                            type: "error",
                            title: "Password is required",
                            message:
                              "Password is required to protect your paste",
                          }),
                        );
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
                  name="password"
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
            <div className={styles.tagsEditor}>
              <label htmlFor="paste-tags">Tags</label>
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
                tag="input"
                id="paste-tags"
                name="tags"
                className={styles.tagsInput}
                placeholder="Add a tags to your paste (optional)"
                onKeyDown={onEnter}
                value={tag}
                onChange={(event) => setTag(event.target.value)}
              />
              <Button
                variant="primary"
                className={styles.addTagButton}
                disabled={tag === ""}
                onClick={() => addTag(event)}
              >
                Add
              </Button>
            </div>
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
