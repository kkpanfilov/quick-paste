import React, { useState } from "react";

import { Button } from "../button/Button.js";
import { Field } from "../field/Field.js";

import styles from "./TagEditor.module.scss";

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
  id: string;
  name: string;
  placeholder: string;
  maxTags?: number;
  maxTagLength?: number;
};

export const TagEditor = ({
  tags,
  onChange,
  id,
  name,
  placeholder,
  maxTags = 5,
  maxTagLength = 30,
}: Props) => {
  const [tag, setTag] = useState("");

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

    onChange([...tags, value]);
    setTag("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
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
