import { useState } from "react";

import { Button } from "@/components/ui/button/Button.jsx";
import { Confirm } from "@/components/ui/confirm/Confirm.jsx";
import { useLogout } from "@/hooks/auth/useLogout.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useAuth } from "@/hooks/useAuth.js";
import { useNotifications } from "@/hooks/useNotifications.js";

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
    } catch (error) {
      notifyError({ title: "Logout error", message: error.message });
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
        {isAuth ? (
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
