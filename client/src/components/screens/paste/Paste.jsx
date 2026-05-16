import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router";
import SyntaxHighlighter from "react-syntax-highlighter";
import { anOldHope } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { Button } from "@/components/ui/button/Button.jsx";
import { Confirm } from "@/components/ui/confirm/Confirm.jsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { Loader } from "@/components/ui/loader/Loader.jsx";
import { Select } from "@/components/ui/select/Select.jsx";
import { useDeletePaste } from "@/hooks/pastes/useDeletePaste.js";
import { useGetPaste } from "@/hooks/pastes/useGetPaste.js";
import { useUpdatePaste } from "@/hooks/pastes/useUpdatePaste.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useAuth } from "@/hooks/useAuth.js";
import { useDocumentTitle } from "@/hooks/useDocumentTitle.js";
import { addNotification } from "@/store/notification/notificationSlice.js";
import { countLines } from "@/utils/countLines.js";
import { getContentSize } from "@/utils/getContentSize.js";

import { ErrorPage } from "../error/ErrorPage.jsx";
import { categoryMap } from "../home/assets/category.map.js";
import { languageMap } from "../home/assets/language.map.js";
import { categoryList, languageList } from "../home/assets/new-paste.list.js";
import { NotFound } from "../not-found/NotFound.jsx";

import styles from "./Paste.module.scss";

// TODO: implement password protection
// TODO: implement unlisted/private paste protection
export const Paste = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  useDocumentTitle("Paste");

  const { reload } = useAppNavigation();

  const queryClient = useQueryClient();

  const { isAuth, userId } = useAuth();
  const dispatch = useDispatch();

  const params = useParams();
  const pasteId = params.id;

  const { data, isLoading, error } = useGetPaste(pasteId);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { mutateAsync: deletePaste } = useDeletePaste();
  const { mutateAsync: updatePaste } = useUpdatePaste();

  if (isLoading) {
    return (
      <main>
        <Loader isVisible label="Loading paste..." />
      </main>
    );
  }

  if (error) {
    if (error.message === "Paste not found") {
      return (
        <NotFound
          title="Paste not found"
          description="The paste you are looking for does not exist"
        />
      );
    } else {
      return (
        <ErrorPage
          title="Failed to load paste"
          description="The paste is temporarily unavailable"
        />
      );
    }
  }

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

  const onDelete = async (id) => {
    try {
      const result = await deletePaste(id);

      if (result.id) {
        dispatch(
          addNotification({
            type: "success",
            title: "Paste deleted",
            message: "Paste has been deleted successfully",
          }),
        );
      }

      reload();
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Paste not deleted",
          message: error.message,
        }),
      );
    }

    setIsConfirmOpen(false);
  };

  const onUpdate = async (body) => {
    try {
      const result = await updatePaste({ id: pasteId, body });

      if (result.id) {
        dispatch(
          addNotification({
            type: "success",
            title: "Paste updated",
            message: "Paste has been updated successfully",
          }),
        );

        queryClient.setQueryData(["paste", pasteId], { ...result, author });

        setIsEditing(false);
      }
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Paste not updated",
          message: error.message,
        }),
      );
    }
  };

  return (
    <>
      {isConfirmOpen && (
        <Confirm
          title="Delete this paste?"
          description="Are you sure you want to delete this paste?"
          action="Delete"
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={() => onDelete(pasteId)}
        />
      )}
      <main className={styles.screen}>
        <article className={styles.container} aria-labelledby="paste-title">
          <header className={styles.header}>
            <div className={styles.heading}>
              <p className={styles.eyebrow}>{data.exposure} paste</p>
              {errors.title && <ErrorMessage message={errors.title.message} />}
              {isEditing ? (
                <Field
                  tag="input"
                  id="new-title"
                  name="title"
                  type="text"
                  className={styles.pasteInput}
                  defaultValue={data.title}
                  {...register("title", {
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
                      {...register("category", {
                        required: "Category is required",
                      })}
                    >
                      {categoryList.map(({ label, value }) => (
                        <option
                          selected={value === data.category}
                          key={value}
                          value={value}
                        >
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
                      {...register("language", {
                        required: "Language is required",
                      })}
                    >
                      {languageList.map(({ label, value }) => (
                        <option
                          selected={value === data.language}
                          key={value}
                          value={value}
                        >
                          {label}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <dd>{languageMap[data.language]}</dd>
                  )}
                </div>
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
                    <Link to={`/users/${data.authorId}`}>{author}</Link>
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
                      onClick={handleSubmit(onUpdate)}
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

          <section className={styles.content} aria-label="Paste content">
            <div className={styles.toolbar}>
              <span className={styles.fileName}>
                {errors.content && (
                  <ErrorMessage message={errors.content.message} />
                )}
              </span>
              <span className={styles.status}>Read only</span>
            </div>
            {isEditing ? (
              <Field
                tag="textarea"
                id="paste-content"
                name="content"
                className={styles.pasteTextarea}
                defaultValue={data.content}
                {...register("content", {
                  required: "Content is required",
                  maxLength: {
                    value: 100000,
                    message: "Content is too long",
                  },
                })}
              />
            ) : (
              <SyntaxHighlighter
                className={styles.codeBlock}
                language={data.language}
                style={anOldHope}
              >
                {data.content}
              </SyntaxHighlighter>
            )}
          </section>

          <section className={styles.comments} aria-labelledby="comments-title">
            <div className={styles.commentsHeader}>
              <div>
                <p className={styles.eyebrow}>Discussion</p>
                <h2 id="comments-title" className={styles.commentsTitle}>
                  Comments
                </h2>
              </div>
              <span className={styles.commentsCount}>2</span>
            </div>

            <form className={styles.commentForm}>
              <Field
                tag="textarea"
                className={styles.commentTextarea}
                placeholder="Write a comment..."
                aria-label="Write a comment"
                rows={4}
              />
              <div className={styles.commentFormActions}>
                <Button variant="primary" className={styles.commentButton}>
                  Send comment
                </Button>
              </div>
            </form>

            <div className={styles.commentList}>
              <article className={styles.comment}>
                <header className={styles.commentHeader}>
                  <div className={styles.avatar} aria-hidden="true">
                    A
                  </div>
                  <div>
                    <h3 className={styles.commentAuthor}>Alex Morgan</h3>
                    <p className={styles.commentDate}>2 hours ago</p>
                  </div>
                </header>
                <p className={styles.commentText}>
                  This helper is clean. I would only keep the middleware naming
                  consistent with the route guards.
                </p>
              </article>

              <article className={styles.comment}>
                <header className={styles.commentHeader}>
                  <div className={styles.avatar} aria-hidden="true">
                    M
                  </div>
                  <div>
                    <h3 className={styles.commentAuthor}>Maya Chen</h3>
                    <p className={styles.commentDate}>Yesterday</p>
                  </div>
                </header>
                <p className={styles.commentText}>
                  Worth adding one test for the expired token case before this
                  becomes shared auth code.
                </p>
              </article>
            </div>
          </section>
        </article>
      </main>
    </>
  );
};
