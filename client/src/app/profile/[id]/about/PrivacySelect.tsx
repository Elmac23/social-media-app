"use client";

import Select from "@/components/ui/formControl/Select";
import React from "react";
import { Option } from "@/components/ui/formControl/Select";
import { PrivacyOptions, UserPrivacyPartial } from "@/types/user";
import { useAboutField } from "./AboutFieldWrapper";
import { useMutation } from "@tanstack/react-query";
import { updatePrivacy } from "@/api/privacy";
import { useAuth } from "@/components/AuthProvider";
import { useTranslations } from "next-intl";

function PrivacySelect() {
  const { privacyName, privacySettings } = useAboutField();
  const [privacy, setPrivacy] = React.useState<PrivacyOptions>(
    privacySettings[privacyName as keyof typeof privacySettings] || "PUBLIC",
  );

  const { user } = useAuth();

  const { mutate } = useMutation({
    mutationFn: (newPrivacy: PrivacyOptions) =>
      updatePrivacy(user!.id, {
        [privacyName]: newPrivacy,
      } as UserPrivacyPartial),
    onSuccess: (data, variables) => {
      setPrivacy(variables);
    },
  });

  const t = useTranslations("UserProfile.about.visibility");

  return (
    <Select
      size="small"
      value={privacy}
      setValue={(e) => mutate(e as PrivacyOptions)}
    >
      <Option value="PUBLIC">{t("public")}</Option>
      <Option value="FRIENDS">{t("friends")}</Option>
      <Option value="PRIVATE">{t("hidden")}</Option>
    </Select>
  );
}

export default PrivacySelect;
