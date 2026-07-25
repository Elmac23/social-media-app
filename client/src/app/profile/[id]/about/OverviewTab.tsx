"use client";

import React from "react";
import AboutFieldWrapper, { UserEdit } from "./AboutFieldWrapper";
import { UpdateUser, UserPrivacy, UserProfile } from "@/types/user";
import EditableInput from "./EditableInput";
import { updateUser } from "@/api/users";
import EditableSelect from "./EditableSelect";
import { Option } from "@/components/ui/formControl/Select";
import { useTranslations } from "next-intl";

function AboutTab({
  profile,
  isSelf,
  privacySettings,
}: {
  profile: UserProfile;
  isSelf: boolean;
  privacySettings: UserPrivacy;
}) {
  const submit = async (value: UpdateUser) => {
    return updateUser(profile.id, value);
  };

  const displayName = ({ name, lastname }: UserEdit) => {
    if (name || lastname) {
      return `${name || ""} ${lastname || ""}`.trim();
    }
    return "";
  };

  const displayLogin = ({ login }: UserEdit) => {
    if (login) {
      return `@${login}`;
    }
    return "";
  };

  const displaySex = ({ sex }: UserEdit) => {
    switch (sex) {
      case "MALE":
        return "Male";
      case "FEMALE":
        return "Female";
      default:
        return "";
    }
  };

  const displayEmail = ({ email }: UserEdit) => {
    return email || "";
  };

  const displayLocation = ({ country, city }: UserEdit) => {
    if (country || city) {
      return `${city || ""}${country ? (city ? ", " : "") + country : ""}`;
    }
    return "";
  };

  const t = useTranslations("UserProfile.about");

  return (
    <div className="flex flex-col gap-4">
      <AboutFieldWrapper
        onSubmit={async (value) =>
          submit({
            name: value.name,
            lastname: value.lastname,
          })
        }
        initialValues={{
          name: profile.name,
          lastname: profile.lastname,
        }}
        isYour={isSelf}
        displayValue={displayName}
        mainLabel={t("name")}
        privacySettings={privacySettings}
      >
        <EditableInput label={t("name")} name="name" />
        <EditableInput label={t("lastname")} name="lastname" />
      </AboutFieldWrapper>
      <AboutFieldWrapper
        privacySettings={privacySettings}
        onSubmit={async (value) =>
          submit({
            login: value.login,
          })
        }
        initialValues={{
          login: profile.login,
        }}
        isYour={isSelf}
        displayValue={displayLogin}
        mainLabel={t("login")}
      >
        <EditableInput label={t("login")} name="login" />
      </AboutFieldWrapper>
      <AboutFieldWrapper
        privacySettings={privacySettings}
        onSubmit={async (value) =>
          submit({
            email: value.email,
          })
        }
        initialValues={{
          email: profile.email,
        }}
        isYour={isSelf}
        forbidEdit
        displayValue={displayEmail}
        mainLabel={t("email")}
        withPrivacy
      >
        <EditableInput label={t("email")} name="email" />
      </AboutFieldWrapper>
      <AboutFieldWrapper
        privacySettings={privacySettings}
        onSubmit={async (value) =>
          submit({
            userData: {
              country: value.country,
              city: value.city,
            },
          })
        }
        initialValues={{
          city: profile.userData?.city || "",
          country: profile.userData?.country || "",
        }}
        isYour={isSelf}
        displayValue={displayLocation}
        mainLabel={t("location")}
        withPrivacy
      >
        <EditableInput label={t("country")} name="country" />
        <EditableInput label={t("city")} name="city" />
      </AboutFieldWrapper>
      <AboutFieldWrapper
        privacySettings={privacySettings}
        initialValues={{
          sex: profile.userData?.sex,
        }}
        isYour={isSelf}
        displayValue={displaySex}
        mainLabel={t("sex")}
        onSubmit={(value) =>
          submit({
            userData: {
              sex: value.sex,
            },
          })
        }
      >
        <EditableSelect label={t("sex")} name="sex">
          <Option value={""}>{t("notSpecified")}</Option>
          <Option value="MALE">{t("male")}</Option>
          <Option value="FEMALE">{t("female")}</Option>
        </EditableSelect>
      </AboutFieldWrapper>
    </div>
  );
}

export default AboutTab;
