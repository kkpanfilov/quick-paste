import { useState } from "react";

import { isApiError } from "@/api/apiClient.js";
import { Button } from "@/components/ui/button/Button.jsx";
import { Confirm } from "@/components/ui/confirm/Confirm.jsx";
import { useLogout } from "@/hooks/auth/useLogout.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useAuth } from "@/hooks/useAuth.js";
import { useNotifications } from "@/hooks/useNotifications.js";

import { Search } from "../search/Search.js";

import styles from "./Hamburger.module.scss";

type Props = {
  isHamburgerOpen: boolean;
  setIsHamburgerOpen: (value: boolean) => void;
};

export const Hamburger = ({ isHamburgerOpen, setIsHamburgerOpen }: Props) => {
  const { notifySuccess, notifyError } = useNotifications();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { goNew, goSignIn, goUser } = useAppNavigation();

  const { mutateAsync: logoutFn } = useLogout();
  const { isAuth, userId, logout } = useAuth();

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

      <div className={styles.hamburger}>
        <button
          className={styles.menuButton}
          type="button"
          aria-label="Open menu"
          onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          className={styles.menuList}
          data-state={isHamburgerOpen ? "open" : "closed"}
        >
          <Search type="mobile" setIsHamburgerOpen={setIsHamburgerOpen} />{" "}
          <Button
            variant="primary"
            className={styles.menuLinkPrimary}
            onClick={() => {
              goNew();
              setIsHamburgerOpen(false);
            }}
          >
            New paste
          </Button>
          {isAuth ? (
            <>
              <Button
                variant="soft"
                className={styles.menuLinkSoft}
                onClick={() => {
                  if (userId) goUser(userId);
                  setIsHamburgerOpen(false);
                }}
              >
                Profile
              </Button>
              <Button
                variant="red"
                className={styles.menuLinkRed}
                onClick={() => setIsConfirmOpen(true)}
                type="button"
              >
                Log out
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              className={styles.menuLinkGhost}
              onClick={() => {
                goSignIn();
                setIsHamburgerOpen(false);
              }}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
