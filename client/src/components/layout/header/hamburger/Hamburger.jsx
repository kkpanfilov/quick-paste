import { useState } from "react";

import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button/Button.jsx";
import { Confirm } from "@/components/ui/confirm/Confirm.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { SearchIcon } from "@/components/ui/search-icon/SearchIcon.jsx";
import { useLogout } from "@/hooks/auth/useLogout.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useAuth } from "@/hooks/useAuth.js";
import { logout } from "@/store/auth/authSlice.js";
import { addNotification } from "@/store/notification/notificationSlice.js";

import styles from "./Hamburger.module.scss";

export const Hamburger = () => {
  const dispatch = useDispatch();

  const [isShow, setIsShow] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { goNew, goSignIn, goUser } = useAppNavigation();

  const { mutateAsync: logoutFn } = useLogout();
  const { isAuth, userId } = useAuth();

  const onLogout = async () => {
    try {
      const result = await logoutFn();

      if (result.success) {
        dispatch(logout());
        dispatch(
          addNotification({
            type: "success",
            title: "Successfully logged out",
            message: "You have successfully logged out",
          }),
        );
      }
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Logout error",
          message: error.message,
        }),
      );
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
          onClick={() => setIsShow(!isShow)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          className={styles.menuList}
          data-state={isShow ? "open" : "closed"}
          isShow={isShow}
        >
          <form className={styles.search} role="search">
            <SearchIcon />
            <Field
              className={styles.searchField}
              type="search"
              name="query"
              placeholder="Search pastes"
              autoComplete="off"
            />
          </form>

          <Button
            variant="primary"
            className={styles.menuLinkPrimary}
            onClick={() => {
              goNew();
              setIsShow(false);
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
                  goUser(userId);
                  setIsShow(false);
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
                setIsShow(false);
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
