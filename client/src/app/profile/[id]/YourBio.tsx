"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/formControl/Input";
import Typography from "@/components/ui/Typography";
import { useToggle } from "@/hooks/useToggle";
import React from "react";
import { is } from "zod/locales";
import Bio from "./Bio";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/api/users";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Textarea from "@/components/ui/formControl/Textarea";

type BioProps = {
  value?: string;
  userId: string;
};

function YourBio({ userId, value }: BioProps) {
  const { setFalse, value: isEdited, toggle } = useToggle(false);
  const [editedValue, setEditedValue] = React.useState(value || "");
  const { accessToken } = useAuth();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: (bio: string) => updateUser(userId, { bio }, accessToken),
    onSuccess: () => {
      setFalse();
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate(editedValue);
      }}
    >
      <Bio
        header={
          <>
            <Typography size="lg" as="h3" className="font-bold">
              About me
            </Typography>
            <div className="flex gap-2">
              {isEdited && (
                <>
                  <Button size="small" variant="primary" type="submit">
                    Save
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setEditedValue(value || "");
                      setFalse();
                    }}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </>
              )}
              {!isEdited && (
                <Button size="small" onClick={toggle} variant="primary">
                  {value ? "Edit" : "Add Bio"}
                </Button>
              )}
            </div>
          </>
        }
      >
        {isEdited && (
          <Textarea
            name="bio"
            value={editedValue}
            rows={5}
            onInput={(e) => {
              const value = (e.target as HTMLInputElement).value;
              setEditedValue(value);
            }}
          />
        )}
        {!isEdited && (
          <Typography as="pre" color={value ? "primary" : "muted"}>
            {value || "No bio added yet."}
          </Typography>
        )}
      </Bio>
    </form>
  );
}

export default YourBio;
