"use client";

import { confirmEmail } from "@/api/auth";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

function ResendEmailButton() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const router = useRouter();

  const conifrmEmailMutation = useMutation({
    mutationFn: async () => confirmEmail(token!, email!),
    onSuccess: () => {
      router.push("/auth/login");
    },
  });
  const t = useTranslations("EmailConfirmation");
  return (
    <>
      <Button className="mb-4" onClick={() => conifrmEmailMutation.mutate()}>
        {t("confirm")}
      </Button>
      {conifrmEmailMutation.isError && (
        <Typography color="danger">Token has expired!</Typography>
      )}
    </>
  );
}

export default ResendEmailButton;
