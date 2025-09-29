import Typography from "@/components/ui/Typography";
import React from "react";
import LoginForm from "./LoginForm";
import Card from "@/components/ui/Card";
import ForbidLoggedIn from "../ForbidLoggedIn";

function LoginPage() {
  return (
    <ForbidLoggedIn>
      <main className="container mx-auto p-8">
        <Typography size="2xl" className="text-center font-bold mb-4">
          Login
        </Typography>
        <Card className="mx-auto max-w-md">
          <LoginForm />
        </Card>
      </main>
    </ForbidLoggedIn>
  );
}

export default LoginPage;
