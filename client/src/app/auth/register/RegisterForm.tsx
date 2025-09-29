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

function RegisterForm() {
  const [errorMessage, setErrorMessage] = React.useState("");
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.push("/auth/login");
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
      login: "elmac",
      email: "a@wp.pl",
      password: "zaq1@WSX",
      dateOfBirth: "2000-01-01",
      lastname: "ee",
      name: "jakuc",
    },
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = (data: RegisterDto) => mutate(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl className="mb-4" error={errors.login?.message}>
        <Label>Login</Label>
        <Input {...register("login")} />
        <FormError />
      </FormControl>

      <FormControl className="mb-4" error={errors.email?.message}>
        <Label>Email</Label>
        <Input {...register("email")} />
        <FormError />
      </FormControl>

      <div className="grid grid-cols-2 gap-8">
        <FormControl className="mb-4" error={errors.name?.message}>
          <Label>Name</Label>
          <Input {...register("name")} />
          <FormError />
        </FormControl>

        <FormControl className="mb-4" error={errors.lastname?.message}>
          <Label>Lastname</Label>
          <Input {...register("lastname")} />
          <FormError />
        </FormControl>
      </div>

      <FormControl className="mb-4" error={errors.dateOfBirth?.message}>
        <Label>Date of birth</Label>
        <Input type="date" {...register("dateOfBirth")} />
        <FormError />
      </FormControl>

      <FormControl className="mb-4" error={errors.password?.message}>
        <Label>Password</Label>
        <Input type="password" {...register("password")} />
        <FormError />
      </FormControl>
      <Typography className="text-red-500 mb-4">{errorMessage}</Typography>
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default RegisterForm;
