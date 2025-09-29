"use client";

import React from "react";
import AboutFieldWrapper, { UserEdit } from "./AboutFieldWrapper";
import { UpdateUser, UserProfile } from "@/types/user";
import EditableInput from "./EditableInput";
import { updateUser } from "@/api/users";
import { useAuth } from "@/components/AuthProvider";
import EditableSelect from "./EditableSelect";
import { Option } from "@/components/ui/formControl/Select";

function AboutTab({
  profile,
  isSelf,
}: {
  profile: UserProfile;
  isSelf: boolean;
}) {
  const { accessToken } = useAuth();

  const submit = async (value: UpdateUser) => {
    return updateUser(profile.id, value, accessToken);
  };

  const displayName = ({ name, lastname }: UserEdit) => {
    if (name || lastname) {
      return `${name || ""} ${lastname || ""}`.trim();
    }
    return "No name provided";
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
        return "Not specified";
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
        mainLabel={"Name"}
      >
        <EditableInput label="Name" name="name" />
        <EditableInput label="Lastname" name="lastname" />
      </AboutFieldWrapper>
      <AboutFieldWrapper
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
        mainLabel="Login"
      >
        <EditableInput label="Login" name="login" />
      </AboutFieldWrapper>
      <AboutFieldWrapper
        onSubmit={async (value) =>
          submit({
            email: value.email,
          })
        }
        initialValues={{
          email: profile.email,
        }}
        isYour={false}
        displayValue={displayEmail}
        mainLabel="Email"
      >
        <EditableInput label="Email" name="email" />
      </AboutFieldWrapper>
      <AboutFieldWrapper
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
        mainLabel="Location"
      >
        <EditableInput label="Country" name="country" />
        <EditableInput label="City" name="city" />
      </AboutFieldWrapper>
      <AboutFieldWrapper
        initialValues={{
          sex: profile.userData?.sex,
        }}
        isYour={isSelf}
        displayValue={displaySex}
        mainLabel="Sex"
        onSubmit={(value) =>
          submit({
            userData: {
              sex: value.sex,
            },
          })
        }
      >
        <EditableSelect label="Sex" name="sex">
          <Option value={""}>Not specified</Option>
          <Option value="MALE">Male</Option>
          <Option value="FEMALE">Female</Option>
        </EditableSelect>
      </AboutFieldWrapper>
    </div>
  );
}

export default AboutTab;
