import React, { useState } from "react";

import { type UseFormReturn, useWatch } from "react-hook-form";

import { Button } from "../button/Button.js";
import { Field } from "../field/Field.js";

import styles from "./TagEditor.module.scss";

type FormWithTags = {
  tags: string[];
};

type Props = {
  form: Pick<UseFormReturn<FormWithTags>, "control" | "setValue">;
  id: string;
  name: string;
  placeholder: string;
  maxTags?: number;
  maxTagLength?: number;
};

export const TagEditor = ({
  form,
  id,
  name,
  placeholder,
  maxTags = 5,
  maxTagLength = 30,
}: Props) => {
  const [tag, setTag] = useState("");

  const tags = useWatch({
    control: form.control,
    name: "tags",
    defaultValue: [],
  });

  const onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    addTag();
  };

  const addTag = () => {
    const value = tag.trim();

    if (!value) return;
    if (value.length > maxTagLength) return;
    if (tags.length >= maxTags) return;
    if (tags.includes(value)) return;

    form.setValue("tags", [...tags, value], {
      shouldValidate: true,
      shouldDirty: true,
    });

    setTag("");
  };

  const removeTag = (tag: string) => {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tag),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  return (
    <div className={styles.tagsEditor}>
      <label htmlFor={id} className={styles.label}>
        Tags
      </label>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
            <span className={styles.tagClose} onClick={() => removeTag(tag)}>
              X
            </span>
          </span>
        ))}
      </div>
      <Field
        tag="input"
        id={id}
        name={name}
        className={styles.tagsInput}
        placeholder={placeholder}
        onKeyDown={onEnter}
        value={tag}
        onChange={(event) => setTag(event.target.value)}
      />
      <Button
        variant="primary"
        className={styles.addTagButton}
        disabled={tag.trim() === ""}
        onClick={() => addTag()}
      >
        Add
      </Button>
    </div>
  );
};
