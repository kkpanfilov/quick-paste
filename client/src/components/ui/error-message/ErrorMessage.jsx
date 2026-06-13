import styles from "./ErrorMessage.module.scss";

export const ErrorMessage = ({ message }) => {
  return <p className={styles.errorText}>{message}</p>;
};
