"use client";

import { getCsrfToken, signIn } from "next-auth/react";
import { useState } from "react";
import EmailInput from "./email";
import VerificationCode from "./verification-code";

export default function VerificationCodeFlow() {
  const [hasStartedVerification, setHasStartedVerification] = useState(false);
  const [credentials, setCredentials] = useState<{
    email: string;
    token: string;
  }>();

  const startVerification = async ({ email, recaptcha }: any) => {
    const csrfToken = await getCsrfToken();

    const response = await fetch("/api/auth-verification/code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, csrfToken, recaptcha }),
    });
    const { code } = await response.json();
    console.log(code);
    setCredentials({ email, token: code });
    setHasStartedVerification(true);
  };

  const checkVerification = async ({ verificationCode }: any) => {
    await signIn("credentials", { ...credentials, verificationCode });
  };

  if (!hasStartedVerification) {
    return <EmailInput onSubmit={startVerification} />;
  } else {
    return (
      <VerificationCode
        onSubmit={checkVerification}
        code={credentials?.token}
      />
    );
  }
}
