import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import React from "react";
import ResendEmailButton from "./ConfirmEmailButton";
import { getTranslations } from "next-intl/server";

type ConfirmEmailProps = {
  params: Promise<{ email: string }>;
};

async function ConfirmEmailPage({}: ConfirmEmailProps) {
  const t = await getTranslations("EmailConfirmation");
  return (
    <Card>
      <Typography size="lg" bold as="h2" className="mb-4">
        {t("emailConfirmation")}
      </Typography>
      <Typography as="h2" className="mb-2">
        {t("confirmDescription")}
      </Typography>
      <ResendEmailButton />
    </Card>
  );
}

export default ConfirmEmailPage;
