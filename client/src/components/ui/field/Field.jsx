import styles from "./Field.module.scss";

const Field = ({ className = "", tag = "input", type = "text", ...rest }) => {
  const defaultClass = styles[tag] || "";
  const classes = [defaultClass, className].filter(Boolean).join(" ");

  if (tag === "textarea") {
    return <textarea type={type} className={classes} {...rest}></textarea>;
  } else if (tag === "input") {
    return <input type={type} className={classes} {...rest}></input>;
  }
};

export default Field;
