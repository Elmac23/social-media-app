"use client";

import { useToggle } from "@/hooks/useToggle";
import { User, UserData, UserPrivacy } from "@/types/user";
import React from "react";
import ContentField from "./ContentField";
import Button from "@/components/ui/Button";
import { MdAdd, MdEdit, MdSave } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosResponse } from "axios";
import PrivacySelect from "./PrivacySelect";

export type UserEdit = Partial<Record<keyof (User & UserData), string>>;

type AboutFieldContext = {
  isEdited: boolean;
  setEditTrue: () => void;
  setEditFalse: () => void;
  value: UserEdit;
  setValue: (value: UserEdit) => void;
  mainLabel: string;
  privacyName: string;
  privacySettings: UserPrivacy;
};

const aboutFieldContext = React.createContext<AboutFieldContext>({
  isEdited: false,
  setEditTrue: () => {},
  setEditFalse: () => {},
  value: {} as UserEdit,
  privacySettings: {} as UserPrivacy,
  privacyName: "",
  setValue: (value: UserEdit) => {},
  mainLabel: "",
});

export function useAboutField() {
  return React.useContext(aboutFieldContext);
}

type AboutFieldWrapperProps = React.PropsWithChildren & {
  initialValues: UserEdit;
  withPrivacy?: boolean;
  privacyName?: string;
  privacySettings: UserPrivacy;
  isYour: boolean;
  forbidEdit?: boolean;
  displayValue: (value: UserEdit) => string;
  mainLabel: string;
  onSubmit: (value: UserEdit) => Promise<AxiosResponse<unknown, unknown>>;
};

function AboutFieldWrapper({
  children,
  initialValues,
  isYour,
  forbidEdit = false,
  displayValue,
  onSubmit,
  privacyName,
  privacySettings,
  mainLabel,
  withPrivacy,
}: AboutFieldWrapperProps) {
  const { value: isEdited, setFalse, setTrue } = useToggle(false);
  const [value, setValue] = React.useState<UserEdit>(initialValues);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: onSubmit,
    onSuccess: () => {
      setFalse();
      router.refresh();
    },
  });

  const isAddable = isYour && !displayValue(value);

  return (
    <aboutFieldContext.Provider
      value={{
        isEdited,
        setEditTrue: setTrue,
        setEditFalse: setFalse,
        value,
        setValue,
        mainLabel,
        privacyName: privacyName || mainLabel.toLocaleLowerCase(),
        privacySettings,
      }}
    >
      {!isEdited && (
        <ContentField label={mainLabel} value={displayValue(value)}>
          {isYour && !forbidEdit && (
            <>
              <Button
                size="small"
                onClick={setTrue}
                variant={isAddable ? "primary" : "outline"}
                icon={isAddable ? <MdAdd /> : <MdEdit />}
              >
                {isAddable ? "Add" : "Edit"}
              </Button>
            </>
          )}
          {withPrivacy && isYour ? <PrivacySelect /> : undefined}
        </ContentField>
      )}

      {isEdited && children}

      {isYour && isEdited && (
        <div className="flex gap-2 mt-2">
          <Button size="small" onClick={() => mutate(value)} icon={<MdSave />}>
            Save
          </Button>
          <Button
            size="small"
            onClick={() => {
              setValue(initialValues);
              setFalse();
            }}
            variant="outline"
            icon={<MdEdit />}
          >
            Cancel
          </Button>
        </div>
      )}
    </aboutFieldContext.Provider>
  );
}

export default AboutFieldWrapper;
