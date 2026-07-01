import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import { isApiError } from "@/api/apiClient.ts";
import { Confirm } from "@/components/ui/confirm/Confirm.tsx";
import { useDeletePaste } from "@/hooks/pastes/useDeletePaste.ts";
import { useUpdatePaste } from "@/hooks/pastes/useUpdatePaste.ts";
import { useAppNavigation } from "@/hooks/useAppNavigation.ts";
import { useNotifications } from "@/hooks/useNotifications.ts";
import type { Paste, UpdatePasteDto } from "@/types/paste.types.ts";
import { getDirtyBody } from "@/utils/getDirtyBody.ts";
import { nullIfBlank } from "@/utils/nullIfBlank.ts";
import { removeEmptyFields } from "@/utils/removeEmptyFields.ts";

import { PasteHeader } from "./paste-header/PasteHeader.tsx";
import { PasteTextarea } from "./paste-textarea/PasteTextarea.tsx";

type FormData = UpdatePasteDto;

type PasteContentProps = {
  isAuth: boolean;
  userId: string | null;
  pasteId: string;
  data: Paste;
};

const DEFAULT_VALUES: FormData = {
  content: "",
  title: "",
  description: "",
  tags: [],
  category: "none",
  language: "plain",
  exposure: "public",
};

export const PasteContent = ({
  isAuth,
  userId,
  pasteId,
  data,
}: PasteContentProps) => {
  const author = data.author;

  const queryClient = useQueryClient();

  const editForm = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: DEFAULT_VALUES,
  });

  const { reload } = useAppNavigation();
  const { notifySuccess, notifyError } = useNotifications();

  const onDelete = async (id: string) => {
    try {
      const result = await deletePaste(id);

      if (result.id) {
        notifySuccess({
          title: "Paste deleted",
          message: "Paste has been deleted successfully",
        });
      }

      reload();
    } catch (error: unknown) {
      notifyError({
        title: "Paste not deleted",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }

    setIsConfirmOpen(false);
  };

  const onUpdate: SubmitHandler<FormData> = async (body) => {
    try {
      const dirtyBody = getDirtyBody(body, editForm.formState.dirtyFields);

      if (
        Object.prototype.hasOwnProperty.call(dirtyBody, "description") &&
        dirtyBody.description
      ) {
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

        queryClient.setQueryData<Paste>(["paste", pasteId], {
          ...result,
          author,
        });

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
    } catch (error: unknown) {
      notifyError({
        title: "Paste not updated",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }
  };

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { mutateAsync: deletePaste } = useDeletePaste();
  const { mutateAsync: updatePaste } = useUpdatePaste();

  useEffect(() => {
    editForm.reset({
      content: data.content,
      title: data.title,
      description: data.description ?? "",
      tags: data.pasteTags,
      category: data.category,
      language: data.language,
      exposure: data.exposure,
    });
  }, [data, editForm]);

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
