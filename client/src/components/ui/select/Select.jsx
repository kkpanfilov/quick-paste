import styles from "./Select.module.scss";

export const Select = ({ className = "", children, ...rest }) => {
  const defaultClass = styles["select"] || "";
  const classes = [defaultClass, className].filter(Boolean).join(" ");

  return (
    <select className={classes} {...rest}>
      {children}
    </select>
  );
};
