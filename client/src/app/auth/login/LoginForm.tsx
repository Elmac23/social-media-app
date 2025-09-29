"use client";
import { login } from "@/api/auth";
import { useAuth } from "@/components/AuthProvider";
import Button from "@/components/ui/Button";
import FormControl from "@/components/ui/formControl";
import FormError from "@/components/ui/formControl/FormError";
import Input from "@/components/ui/formControl/Input";
import Label from "@/components/ui/formControl/Label";
import Typography from "@/components/ui/Typography";
import { loginSchema, LoginDto } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

function LoginForm() {
  const { setAccessToken, accessToken } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState("");
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);
      // window.location.href = "/";
      router.refresh();
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
  } = useForm({
    defaultValues: {
      loginOrEmail: "a@wp.pl",
      password: "zaq1@WSX",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginDto) => mutate(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl className="mb-4" error={errors.loginOrEmail?.message}>
        <Label>Login or Email:</Label>
        <Input {...register("loginOrEmail")} />
        <FormError />
      </FormControl>
      <FormControl className="mb-4" error={errors.password?.message}>
        <Label>Password:</Label>
        <Input {...register("password")} type="password" />
        <FormError />
      </FormControl>
      <Typography className="text-red-500 mb-4">{errorMessage}</Typography>
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default LoginForm;
