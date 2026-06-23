import { useEffect } from "react";

import { useForm, useWatch } from "react-hook-form";

import { useCreatePaste } from "@/hooks/pastes/useCreatePaste.js";
import { useAppNavigation } from "@/hooks/useAppNavigation.js";
import { exposureList } from "@/shared/lists/new-paste.list.js";
import { nullIfBlank } from "@/utils/nullIfBlank.js";

const DEFAULT_VALUES = {
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
  const newPasteForm = useForm({
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

  const onSubmit = async (values) => {
    const body = {
      ...values,
      isBurn: values.expiration === "burn",
      description: nullIfBlank(values.description),
    };

    const data = await createPaste(body);

    if (data.id) goPaste(data.id);
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
