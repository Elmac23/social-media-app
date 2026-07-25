"use client";

import { resetPassword, ResetPasswordData } from "@/api/auth";
import Button from "@/components/ui/Button";
import FormControl from "@/components/ui/formControl";
import FormError from "@/components/ui/formControl/FormError";
import Input from "@/components/ui/formControl/Input";
import Label from "@/components/ui/formControl/Label";
import InputOTP from "@/components/ui/InputOTP";
import Typography from "@/components/ui/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

const resetPasswordSchema = z
  .object({
    email: z.email(),
    otp: z
      .string()
      .length(6, "OTP must contain 6 digits")
      .regex(/^\d+$/, "OTP can contain only numbers"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please repeat your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
      email: email as string,
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const router = useRouter();
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordData) => resetPassword(data),
    onSuccess: () => {
      router.push("/auth/login");
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = (data) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography as="h2" className="mb-4">
        One time code was sent to your email. <br /> Please enter the code and
        your new password.
      </Typography>

      <FormControl className="mb-4" error={errors.otp?.message}>
        <Label>OTP Code</Label>
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <InputOTP length={6} onChange={field.onChange} />
          )}
        />
        <FormError />
      </FormControl>

      <FormControl className="mb-4" error={errors.password?.message}>
        <Label>New Password</Label>
        <Input type="password" {...register("password")} fullWidth />
        <FormError />
      </FormControl>

      <FormControl className="mb-4" error={errors.confirmPassword?.message}>
        <Label>Repeat New Password</Label>
        <Input type="password" {...register("confirmPassword")} fullWidth />
        <FormError />
      </FormControl>

      <Button type="submit">Reset Password</Button>
    </form>
  );
}

export default ResetPasswordForm;
