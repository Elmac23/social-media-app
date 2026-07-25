import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import React from "react";
import ResetPasswordForm from "./ResetPasswordForm";

type ConfirmEmailProps = {
  params: Promise<{ email: string }>;
};

function ConfirmEmailPage({}: ConfirmEmailProps) {
  return (
    <Card>
      <Typography size="lg" bold as="h2" className="mb-4">
        Reset Password
      </Typography>
      <ResetPasswordForm />
    </Card>
  );
}

export default ConfirmEmailPage;
