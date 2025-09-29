import Typography from "@/components/ui/Typography";
import React from "react";
import Card from "@/components/ui/Card";
import RegisterForm from "./RegisterForm";

function RegisterPage() {
  return (
    <main className="container mx-auto p-8">
      <Typography size="2xl" className="text-center font-bold mb-4">
        Register
      </Typography>
      <Card className="mx-auto max-w-md">
        <RegisterForm />
      </Card>
    </main>
  );
}

export default RegisterPage;
