import styles from "./ErrorMessage.module.scss";

type Props = {
  message: string | undefined;
};

export const ErrorMessage = ({ message }: Props) => {
  return <p className={styles.errorText}>{message}</p>;
};
