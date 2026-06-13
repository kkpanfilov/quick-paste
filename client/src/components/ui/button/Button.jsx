import styles from "./Button.module.scss";

export const Button = ({
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}) => {
  const variants = {
    primary: "primary-button",
    ghost: "ghost-button",
    soft: "soft-button",
    red: "red-button",
  };

  const variantClass = styles[variants[variant]] || "";
  const classes = [variantClass, className].filter(Boolean).join(" ");

  return <button type={type} className={classes} {...rest}></button>;
};
