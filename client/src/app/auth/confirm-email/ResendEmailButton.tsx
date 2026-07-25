"use client";

import { upsertConfirmEmailToken } from "@/api/auth";
import Button from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

function ResendEmailButton() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const resendMutation = useMutation({
    mutationFn: async () => upsertConfirmEmailToken(email!),
  });
  const t = useTranslations("EmailConfirmation");
  return <Button onClick={() => resendMutation.mutate()}>{t("resend")}</Button>;
}

export default ResendEmailButton;
