import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Confirm } from "@/components/ui/confirm/Confirm.jsx";
import { useDeletePaste } from "@/hooks/pastes/useDeletePaste.js";
import { useUpdatePaste } from "@/hooks/pastes/useUpdatePaste.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useNotifications } from "@/hooks/useNotifications.js";
import { getDirtyBody } from "@/utils/getDirtyBody.js";
import { nullIfBlank } from "@/utils/nullIfBlank.js";
import { removeEmptyFields } from "@/utils/removeEmptyFields.js";

import { PasteHeader } from "./paste-header/PasteHeader.jsx";
import { PasteTextarea } from "./paste-textarea/PasteTextarea.jsx";

export const PasteContent = ({ isAuth, userId, pasteId, data }) => {
  const author = data.author;

  const queryClient = useQueryClient();

  const editForm = useForm({
    mode: "onSubmit",
    defaultValues: {
      content: data.content,
      title: data.title,
      description: data.description ?? "",
      tags: data.pasteTags,
      category: data.category,
      language: data.language,
      exposure: data.exposure,
    },
  });

  const { reload } = useAppNavigation();
  const { notifySuccess, notifyError } = useNotifications();

  const onDelete = async (id) => {
    try {
      const result = await deletePaste(id);

      if (result.id) {
        notifySuccess({
          title: "Paste deleted",
          message: "Paste has been deleted successfully",
        });
      }

      reload();
    } catch (error) {
      notifyError({
        title: "Paste not deleted",
        message: error.message,
      });
    }

    setIsConfirmOpen(false);
  };

  const onUpdate = async (body) => {
    try {
      const dirtyBody = getDirtyBody(body, editForm.formState.dirtyFields);

      if (Object.prototype.hasOwnProperty.call(dirtyBody, "description")) {
        dirtyBody.description = nullIfBlank(dirtyBody.description);
      }

      const filteredBody = removeEmptyFields(dirtyBody);

      if (Object.keys(filteredBody).length === 0) {
        return;
      }

      const result = await updatePaste({ id: pasteId, body: filteredBody });

      if (result.id) {
        notifySuccess({
          title: "Paste updated",
          message: "Paste has been updated successfully",
        });

        queryClient.setQueryData(["paste", pasteId], { ...result, author });

        editForm.reset({
          content: result.content,
          title: result.title,
          description: result.description ?? "",
          tags: result.pasteTags,
          category: result.category,
          language: result.language,
          exposure: result.exposure,
        });

        setIsEditing(false);
      }
    } catch (error) {
      notifyError({
        title: "Paste not updated",
        message: error.message,
      });
    }
  };

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { mutateAsync: deletePaste } = useDeletePaste();
  const { mutateAsync: updatePaste } = useUpdatePaste();

  return (
    <>
      {isConfirmOpen && (
        <Confirm
          title="Delete this paste?"
          description="Are you sure you want to delete this paste?"
          action="Delete"
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={() => onDelete(pasteId)}
        />
      )}
      <PasteHeader
        isAuth={isAuth}
        userId={userId}
        data={data}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setIsConfirmOpen={setIsConfirmOpen}
        onUpdate={onUpdate}
        editForm={editForm}
      />
      <PasteTextarea
        key={pasteId}
        isAuth={isAuth}
        userId={userId}
        pasteId={pasteId}
        data={data}
        isEditing={isEditing}
        editForm={editForm}
      />
    </>
  );
};
