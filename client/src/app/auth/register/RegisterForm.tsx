"use client";

import Button from "@/components/ui/Button";
import { RegisterDto, registerSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { register as registerUser } from "@/api/auth";
import FormControl from "@/components/ui/formControl";
import FormError from "@/components/ui/formControl/FormError";
import Input from "@/components/ui/formControl/Input";
import Label from "@/components/ui/formControl/Label";
import Typography from "@/components/ui/Typography";
import { AxiosError } from "axios";
import { useDeviceId } from "@/hooks/useDeviceId";
import { useTranslations } from "next-intl";

function RegisterForm() {
  const [errorMessage, setErrorMessage] = React.useState("");
  useDeviceId();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: registerUser,
    onSuccess: (_, data) => {
      router.push(`/auth/confirm-email?email=${data.email}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data.message || "An error occurred");
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({
    defaultValues: {
      login: "jakubsternik",
      email: "sakus04@wp.pl",
      password: "zaq1@WSX",
      dateOfBirth: "2000-01-01",
      lastname: "Sternik",
      name: "Jakub",
    },
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = (data: RegisterDto) => mutate(data);

  const t = useTranslations("Register");
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl className="mb-4" error={errors.login?.message}>
        <Label>{t("login")}</Label>
        <Input {...register("login")} fullWidth />
        <FormError />
      </FormControl>

      <FormControl className="mb-4" error={errors.email?.message}>
        <Label>{t("email")}</Label>
        <Input {...register("email")} fullWidth />
        <FormError />
      </FormControl>

      <div className="grid grid-cols-2 gap-8">
        <FormControl className="mb-4" error={errors.name?.message}>
          <Label>{t("name")}</Label>
          <Input {...register("name")} />
          <FormError />
        </FormControl>

        <FormControl className="mb-4" error={errors.lastname?.message}>
          <Label>{t("lastname")}</Label>
          <Input {...register("lastname")} />
          <FormError />
        </FormControl>
      </div>

      <FormControl className="mb-4" error={errors.dateOfBirth?.message}>
        <Label>{t("dob")}</Label>
        <Input type="date" {...register("dateOfBirth")} fullWidth />
        <FormError />
      </FormControl>

      <FormControl className="mb-4" error={errors.password?.message}>
        <Label>{t("password")}</Label>
        <Input type="password" {...register("password")} fullWidth />
        <FormError />
      </FormControl>
      <Typography className="text-red-500 mb-4">{errorMessage}</Typography>
      <Button type="submit">{t("register")}</Button>
    </form>
  );
}

export default RegisterForm;
