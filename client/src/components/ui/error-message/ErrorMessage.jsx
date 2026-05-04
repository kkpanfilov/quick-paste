import styles from "./ErrorMessage.module.scss";

const ErrorMessage = ({ message }) => {
  return <p className={styles.errorText}>{message}</p>;
};

export default ErrorMessage;
