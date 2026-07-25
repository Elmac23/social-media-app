import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import React from "react";
import ResetPasswordRequestForm from "./ResetPasswordRequestForm";
import { getTranslations } from "next-intl/server";

type ConfirmEmailProps = {
  params: Promise<{ email: string }>;
};

async function ConfirmEmailPage({}: ConfirmEmailProps) {
  const t = await getTranslations("ForgotPassword");
  return (
    <Card>
      <Typography size="lg" bold as="h2" className="mb-4">
        {t("resetPassword")}
      </Typography>
      <ResetPasswordRequestForm />
    </Card>
  );
}

export default ConfirmEmailPage;
