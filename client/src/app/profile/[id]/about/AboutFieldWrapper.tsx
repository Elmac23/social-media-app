"use client";

import { useToggle } from "@/hooks/useToggle";
import { User, UserData } from "@/types/user";
import React from "react";
import ContentField from "./ContentField";
import Button from "@/components/ui/Button";
import { MdAdd, MdEdit, MdSave } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosResponse } from "axios";
import Select, { Option } from "@/components/ui/formControl/Select";

export type UserEdit = Partial<Record<keyof (User & UserData), string>>;

type AboutFieldContext = {
  isEdited: boolean;
  setEditTrue: () => void;
  setEditFalse: () => void;
  value: UserEdit;
  setValue: (value: UserEdit) => void;
  mainLabel: string;
};

const aboutFieldContext = React.createContext<AboutFieldContext>({
  isEdited: false,
  setEditTrue: () => {},
  setEditFalse: () => {},
  value: {} as UserEdit,
  setValue: (value: UserEdit) => {
    console.log(value);
  },
  mainLabel: "",
});

export function useAboutField() {
  return React.useContext(aboutFieldContext);
}

type AboutFieldWrapperProps = React.PropsWithChildren & {
  initialValues: UserEdit;
  isYour: boolean;
  displayValue: (value: UserEdit) => string;
  mainLabel: string;
  onSubmit: (value: UserEdit) => Promise<AxiosResponse<unknown, unknown>>;
};

function AboutFieldWrapper({
  children,
  initialValues,
  isYour,
  displayValue,
  onSubmit,
  mainLabel,
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

  const [privacy, setPrivacy] = React.useState<"public" | "private">("public");

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
      }}
    >
      {!isEdited && (
        <ContentField label={mainLabel} value={displayValue(value)}>
          {isYour && (
            <>
              <Button
                size="small"
                onClick={setTrue}
                variant={isAddable ? "primary" : "outline"}
                icon={isAddable ? <MdAdd /> : <MdEdit />}
              >
                {isAddable ? "Add" : "Edit"}
              </Button>
              <Select
                size="small"
                className="bg-primary-500"
                value={privacy}
                setValue={(v) => setPrivacy(v as "public" | "private")}
              >
                <Option value="public">Public</Option>
                <Option value="friends">Friends</Option>
                <Option value="private">Hidden</Option>
              </Select>
            </>
          )}
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
