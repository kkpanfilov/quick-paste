import { useState } from "react";

import { isApiError } from "@/api/apiClient.ts";
import { Button } from "@/components/ui/button/Button.tsx";
import { Confirm } from "@/components/ui/confirm/Confirm.tsx";
import { useLogout } from "@/hooks/auth/useLogout.ts";
import { useAppNavigation } from "@/hooks/useAppNavigation.ts";
import { useAuth } from "@/hooks/useAuth.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";

import styles from "./Actions.module.scss";

export const Actions = () => {
  const { notifySuccess, notifyError } = useNotifications();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { goNew, goSignIn, goUser } = useAppNavigation();

  const { isAuth, userId, logout } = useAuth();
  const { mutateAsync: logoutFn } = useLogout();

  const onLogout = async () => {
    try {
      const result = await logoutFn();

      if (result.success) {
        logout();
        notifySuccess({
          title: "Successfully logged out",
          message: "You have successfully logged out",
        });
      }
    } catch (error: unknown) {
      notifyError({
        title: "Logout error",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }

    setIsConfirmOpen(false);
  };

  return (
    <>
      {isConfirmOpen && (
        <Confirm
          title="Logout from account?"
          description="Are you sure you want to logout?"
          action="Logout"
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={() => onLogout()}
        />
      )}
      <div className={styles.actions}>
        <Button
          variant="primary"
          className={styles.newPasteButton}
          onClick={() => goNew()}
          type="button"
        >
          New paste
        </Button>
        {isAuth && userId ? (
          <>
            <Button
              variant="soft"
              className={styles.signInButton}
              onClick={() => goUser(userId)}
              type="button"
            >
              Profile
            </Button>
            <Button
              variant="red"
              className={styles.signInButton}
              onClick={() => setIsConfirmOpen(true)}
              type="button"
            >
              <svg width="20" height="20">
                <use href="/icons.svg#logout-icon" />
              </svg>
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            className={styles.signInButton}
            onClick={() => goSignIn()}
            type="button"
          >
            Sign in
          </Button>
        )}
      </div>
    </>
  );
};
