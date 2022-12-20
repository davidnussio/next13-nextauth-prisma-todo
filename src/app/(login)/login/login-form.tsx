"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/ui/button";
import { FormInput } from "~/ui/form-input";

const LoginForm = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    signIn("email", {
      email: email.value,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <div>
            <FormInput
              label="Email address"
              id="email"
              name="email"
              type="email"
            />
          </div>

          <div className="">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </div>
      </form>
      <hr className="my-4 border-white/40" />
      <Button type="submit" onClick={() => signIn("google")} className="w-full">
        Login with Google
      </Button>
    </>
  );
};

export default LoginForm;
