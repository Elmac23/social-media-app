"use client";
import { login, LoginError, upsertConfirmEmailToken } from "@/api/auth";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/ui/Button";
import FormControl from "@/components/ui/formControl";
import FormError from "@/components/ui/formControl/FormError";
import Input from "@/components/ui/formControl/Input";
import Label from "@/components/ui/formControl/Label";
import InputOTP from "@/components/ui/InputOTP";
import Modal from "@/components/ui/modal";
import Typography from "@/components/ui/Typography";
import { useDeviceId } from "@/hooks/useDeviceId";
import { useModal } from "@/hooks/useModal";
import { loginSchema, LoginDto } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

function LoginForm() {
  const { setAccessToken } = useAuth(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [pendingLoginData, setPendingLoginData] =
    React.useState<LoginDto | null>(null);
  const [otp, setOtp] = React.useState("");
  const router = useRouter();
  useDeviceId();
  const resendMutation = useMutation({
    mutationFn: async (email: string) => upsertConfirmEmailToken(email),
  });

  const { close, isOpen, open } = useModal();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setOtp("");
      setPendingLoginData(null);
      close();
      setAccessToken(data.accessToken);
      router.refresh();
    },
    onError: (error) => {
      if (axios.isAxiosError<LoginError>(error)) {
        setErrorMessage(error.response?.data.message || "An error occurred");
        if (error.response?.data.code === "EMAIL_NOT_VERIFIED") {
          const email = error.response.data.email;
          resendMutation.mutate(email, {
            onSuccess: () => {
              router.push(`/auth/confirm-email?email=${email}`);
            },
          });
        } else if (error.response?.data.code === "DEVICE_NOT_VERIFIED") {
          open();
        }
      }
    },
  });

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    defaultValues: {
      loginOrEmail: "sakus04@wp.pl",
      password: "zaq1@WSX",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginDto) => {
    setErrorMessage("");
    setPendingLoginData(data);
    mutate(data);
  };

  const handleVerifyOtp = () => {
    if (!pendingLoginData) return;
    mutate({ ...pendingLoginData, otp });
  };

  const handleResendCode = () => {
    if (!pendingLoginData) return;
    mutate(pendingLoginData);
  };

  const t = useTranslations("Login");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl className="mb-4" error={errors.loginOrEmail?.message}>
        <Label>{t("loginOrEmail")}</Label>
        <Input {...register("loginOrEmail")} fullWidth />
        <FormError />
      </FormControl>
      <FormControl className="mb-2" error={errors.password?.message}>
        <Label>{t("password")}</Label>
        <Input {...register("password")} type="password" fullWidth />
        <FormError />
      </FormControl>
      <Typography className="text-red-500 mb-2">{errorMessage}</Typography>
      <Link
        href="/auth/reset-password/request"
        className="text-primary-500 mb-4 inline-block"
      >
        {t("forgotPassword")}
      </Link>

      <Modal isOpen={isOpen} onClose={close} className="p-6">
        <div>
          <div className="mb-6">
            <Typography as="h2" size="2xl" bold className="mb-2">
              {t("loginVerification")}
            </Typography>
            <Typography className="text-sm text-text-secondary">
              {t("description")}
            </Typography>
          </div>

          <FormControl className="mb-6" error="">
            <Label> {t("otpCode")}</Label>
            <div className="flex justify-center py-4">
              <InputOTP length={6} onChange={setOtp} />
            </div>
            <FormError />
          </FormControl>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" onClick={handleResendCode}>
              {t("resendCode")}
            </Button>
            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={!pendingLoginData || otp.length !== 6}
            >
              {t("verifyCode")}
            </Button>
          </div>
        </div>
      </Modal>

      <Button disabled={isPending} type="submit">
        {t("login")}
      </Button>
    </form>
  );
}

export default LoginForm;
