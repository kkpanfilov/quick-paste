import { useEffect } from "react";

import { type SubmitHandler, useForm, useWatch } from "react-hook-form";

import { isApiError } from "@/api/apiClient.ts";
import { useCreatePaste } from "@/hooks/pastes/useCreatePaste.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { useNotifications } from "@/hooks/useNotifications.ts";
import { exposureList } from "@/shared/lists/new-paste.list.js";
import type { CreatePasteDto } from "@/types/paste.types.ts";
import { nullIfBlank } from "@/utils/nullIfBlank.js";

type FormData = Omit<CreatePasteDto, "isBurn">;

const DEFAULT_VALUES: FormData = {
  title: "",
  content: "",
  description: "",
  tags: [],
  language: "plain",
  expiration: "never",
  category: "none",
  exposure: "public",
  password: "",
};

export function useNewPasteForm() {
  const newPasteForm = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: DEFAULT_VALUES,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = newPasteForm;

  const { notifySuccess, notifyError } = useNotifications();

  const { goPaste } = useAppNavigation();

  const { mutateAsync: createPaste, isPending } = useCreatePaste();

  const password = useWatch({
    control,
    name: "password",
  });

  const exposure = useWatch({
    control,
    name: "exposure",
  });

  const hasPassword = password?.trim().length > 0;

  const availableExposureList = hasPassword
    ? exposureList.filter((item) => item.value !== "public")
    : exposureList;

  useEffect(() => {
    if (hasPassword && exposure === "public") {
      setValue("exposure", "unlisted");
    }
  }, [hasPassword, exposure, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    try {
      const body: CreatePasteDto = {
        ...values,
        isBurn: values.expiration === "burn",
        description: values.description
          ? nullIfBlank(values.description)
          : null,
      };

      const data = await createPaste(body);

      if (data.id) {
        notifySuccess({
          title: "Paste added",
          message: "Paste has been added successfully",
        });
        goPaste(data.id);
      }
    } catch (error: unknown) {
      notifyError({
        title: "Comment not added",
        message: isApiError(error) ? error.message : "Unknown error",
      });
    }
  };

  return {
    register,
    handleSubmit,
    control,
    setValue,
    errors,
    onSubmit,
    isPending,
    availableExposureList,
  };
}
