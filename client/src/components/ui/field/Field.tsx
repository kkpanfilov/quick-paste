import type { ComponentPropsWithoutRef } from "react";

import styles from "./Field.module.scss";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  tag?: "input";
  type?: "email" | "password" | "text" | "date";
};

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  tag: "textarea";
};

type Props = InputProps | TextareaProps;

export const Field = (props: Props) => {
  if (props.tag === "textarea") {
    const { tag, className, ...rest } = props;

    const defaultClass = styles[tag];
    const classes = [defaultClass, className].filter(Boolean).join(" ");

    return <textarea className={classes} {...rest} />;
  }

  const { tag = "input", type = "text", className, ...rest } = props;

  const defaultClass = styles[tag];
  const classes = [defaultClass, className].filter(Boolean).join(" ");

  return <input type={type} className={classes} {...rest} />;
};
