import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { useWatch } from "react-hook-form";
import { Link } from "react-router";

import { categoryMap } from "@/components/screens/home/assets/category.map.js";
import { exposureMap } from "@/components/screens/home/assets/exposure.map.js";
import { languageMap } from "@/components/screens/home/assets/language.map.js";
import {
  categoryList,
  exposureList,
  languageList,
} from "@/components/screens/home/assets/new-paste.list.js";
import { Button } from "@/components/ui/button/Button.jsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { Select } from "@/components/ui/select/Select.jsx";
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
