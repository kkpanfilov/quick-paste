import type { ComponentPropsWithoutRef } from "react";

import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "ghost" | "soft" | "red";

type Props = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "ghost" | "soft" | "red";
};

const variants: Record<ButtonVariant, string> = {
  primary: "primary-button",
  ghost: "ghost-button",
  soft: "soft-button",
  red: "red-button",
};

export const Button = ({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...rest
}: Props) => {
  const variantClass = styles[variants[variant]] || "";
  const classes = [variantClass, className].filter(Boolean).join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
};
