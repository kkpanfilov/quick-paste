import { useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import { isApiError } from "@/api/apiClient.ts";
import { Button } from "@/components/ui/button/Button.jsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { useUnlockPaste } from "@/hooks/pastes/useUnlockPaste.js";
import { useNotifications } from "@/hooks/useNotifications.js";
import type { Paste } from "@/types/paste.types.ts";

import styles from "./PastePassword.module.scss";

type Props = {
  pasteId: string;
  onCancel: () => void;
};

type FormData = {
  password: string;
};

const DEFAULT_VALUES: FormData = {
  password: "",
};

export const PastePassword = ({ pasteId, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: DEFAULT_VALUES,
  });

  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useNotifications();

  const { mutateAsync: unlockPaste } = useUnlockPaste();

  const onSubmit: SubmitHandler<FormData> = async ({ password }) => {
    try {
      const result = await unlockPaste({ id: pasteId, password });

      if (result.id) {
        notifySuccess({
          title: "Paste unlocked",
          message: "Paste has been unlocked successfully",
        });

        queryClient.setQueryData<Paste>(["paste", pasteId], result);
      }
    } catch (error: unknown) {
      notifyError({
        title: "Paste not unlocked",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }
  };

  return (
    <main className={styles.screen}>
      <section
        className={styles.card}
        aria-labelledby="paste-password-title"
        aria-describedby="paste-password-description"
      >
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.content}>
            <h2 id="paste-password-title" className={styles.title}>
              Protected paste
            </h2>
            <p id="paste-password-description" className={styles.description}>
              Enter the password to view this paste.
            </p>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            {errors.password && (
              <ErrorMessage message={errors.password.message} />
            )}
            <Field
              tag="input"
              type="password"
              className={styles.input}
              placeholder="Enter password"
              autoComplete="current-password"
              {...register("password", {
                required: "Password is required",
              })}
            />
          </label>

          <div className={styles.actions}>
            <Button
              variant="ghost"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className={styles.submitButton}
            >
              Unlock
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
};
