"use client";

import { requestResetPassword } from "@/api/auth";
import Button from "@/components/ui/Button";
import FormControl from "@/components/ui/formControl";
import FormError from "@/components/ui/formControl/FormError";
import Input from "@/components/ui/formControl/Input";
import Label from "@/components/ui/formControl/Label";
import Typography from "@/components/ui/Typography";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { SubmitEventHandler, useState } from "react";
import z from "zod";

function ResetPasswordRequestForm() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const requestResetPasswordMutation = useMutation({
    mutationFn: () => requestResetPassword(value),
    onSettled: () => {
      router.push(`/auth/reset-password?email=${value}`);
    },
  });
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const result = z.email().safeParse(value);
    if (result.success) {
      requestResetPasswordMutation.mutate();
    } else {
      setError("Invalid email!");
    }
  };

  const t = useTranslations("ForgotPassword");
  return (
    <form onSubmit={handleSubmit}>
      <FormControl className="mb-4" error={error}>
        <Label>{t("email")}</Label>
        <Input
          placeholder={t("exampleMail")}
          value={value}
          onInput={(e) => {
            setValue(e.currentTarget.value);
            setError("");
          }}
        />
        <FormError />
      </FormControl>

      <Typography as="h2" className="mb-4">
        {t("description")}
      </Typography>
      <Button disabled={requestResetPasswordMutation.isPending} type="submit">
        {t("resetPassword")}
      </Button>
    </form>
  );
}

export default ResetPasswordRequestForm;
