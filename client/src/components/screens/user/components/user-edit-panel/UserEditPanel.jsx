import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button/Button.jsx";
import { Confirm } from "@/components/ui/confirm/Confirm.jsx";
import { ErrorMessage } from "@/components/ui/error-message/ErrorMessage.jsx";
import { Field } from "@/components/ui/field/Field.jsx";
import { Select } from "@/components/ui/select/Select.jsx";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useDeleteUser } from "@/hooks/users/useDeleteUser.js";
import { useUpdateUser } from "@/hooks/users/useUpdateUser.js";
import { logout } from "@/store/auth/authSlice.js";
import { addNotification } from "@/store/notification/notificationSlice.js";
import { getDirtyBody } from "@/utils/getDirtyBody.js";
import { nullIfBlank } from "@/utils/nullIfBlank.js";
import { removeEmptyFields } from "@/utils/removeEmptyFields.js";

import styles from "./UserEditPanel.module.scss";

export const UserEditPanel = ({ data, isMe, paramUserId, setIsEditing }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: "onSubmit",
    shouldUnregister: true,
    defaultValues: {
      username: data?.username ?? "",
      description: data?.description ?? "",
      email: data?.email ?? "",
      exposure: data?.exposure ?? "",
    },
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { goHome } = useAppNavigation();

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: deleteUser } = useDeleteUser();

  const onUpdate = async (body) => {
    try {
      const dirtyBody = getDirtyBody(body, dirtyFields);

      if (Object.prototype.hasOwnProperty.call(dirtyBody, "description")) {
        dirtyBody.description = nullIfBlank(dirtyBody.description);
      }

      const filteredBody = removeEmptyFields(dirtyBody);

      if (Object.keys(filteredBody).length === 0) {
        return;
      }

      const result = await updateUser({
        id: paramUserId,
        body: filteredBody,
      });

      if (result.id) {
        dispatch(
          addNotification({
            type: "success",
            title: "User updated",
            message: "User has been updated successfully",
          }),
        );

        queryClient.setQueryData(["user", paramUserId], (oldData) => ({
          ...oldData,
          ...result,
        }));

        reset({
          username: result?.username ?? "",
          description: result?.description ?? "",
          email: result?.email ?? "",
          exposure: result?.exposure ?? "",
        });

        setIsEditing(false);
      }
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "User not updated",
          message: error.message,
        }),
      );
    }
  };

  const onDelete = async (userId) => {
    try {
      const result = await deleteUser(userId);

      if (result.success) {
        dispatch(
          addNotification({
            type: "success",
            title: "Your profile deleted",
            message: "Your profile has been deleted successfully",
          }),
        );

        goHome();
        dispatch(logout());
      }
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          title: "Your profile not deleted",
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
          title="Are you sure?"
          description="Are you sure you want to delete your profile?"
          action="Confirm"
          onCancel={() => {
            setIsConfirmOpen(false);
          }}
          onConfirm={() => {
            onDelete(paramUserId);
          }}
        />
      )}
      <section className={styles.profile}>
        <div className={styles.identity}>
          <div className={styles.avatar} aria-hidden="true">
            {data.username[0].toUpperCase()}
          </div>
          <div className={styles.profileFormWrapper}>
            <p className={styles.eyebrow}>{"Edit profile"}</p>
            <div className={styles.profileForm}>
              {errors.username && (
                <ErrorMessage message={errors.username.message} />
              )}
              <Field
                tag="input"
                id="new-username"
                name="username"
                className={clsx(styles.input, styles.usernameField)}
                placeholder="New username"
                {...register("username", {
                  minLength: {
                    value: 4,
                    message: "Username must be at least 4 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "Username must be at most 20 characters long",
                  },
                })}
              />
              {errors.description && (
                <ErrorMessage message={errors.description.message} />
              )}
              <Field
                tag="textarea"
                id="new-description"
                name="description"
                className={clsx(styles.textarea)}
                placeholder="New description"
                rows="4"
                {...register("description", {
                  maxLength: {
                    value: 1000,
                    message: "Description must be at most 1000 characters long",
                  },
                })}
              />
              {errors.email && <ErrorMessage message={errors.email.message} />}
              <Field
                tag="input"
                id="new-email"
                name="email"
                className={clsx(styles.input)}
                placeholder="New email"
                {...register("email", {
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email",
                  },
                  minLength: {
                    value: 6,
                    message: "Email must be at least 6 characters long",
                  },
                  maxLength: {
                    value: 50,
                    message: "Email must be at most 50 characters long",
                  },
                })}
              />
              <Select
                id="new-exposure"
                name="exposure"
                className={styles.select}
                {...register("exposure")}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Select>
            </div>
          </div>
        </div>

        <div className={styles.profileActions} aria-label="Profile actions">
          {isMe && (
            <>
              <Button
                variant="primary"
                className={styles.primaryAction}
                disabled={Object.keys(dirtyFields).length === 0}
                onClick={handleSubmit(onUpdate)}
              >
                Save
              </Button>
              <Button
                variant="red"
                className={styles.primaryAction}
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="red"
                className={styles.primaryAction}
                onClick={() => {
                  setIsConfirmOpen(true);
                }}
              >
                Delete profile
              </Button>
            </>
          )}
        </div>
      </section>
    </>
  );
};
