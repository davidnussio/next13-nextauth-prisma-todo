"use client";

import { signIn } from "next-auth/react";

const LoginForm = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    console.log(email.value, password.value);
    signIn("email-password-credentials", {
      email: email.value,
      password: password.value,
      // callbackUrl: "http://localhost:3000/",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div>
          <label htmlFor="email" className="text-white">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-white/40 bg-white/10 p-2 text-white"
          />
        </div>
        <div className="">
          <label htmlFor="password" className="text-white">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md border-white/40 bg-white/10 p-2 text-white"
          />
        </div>
        <div className="">
          <button
            type="submit"
            className="w-full rounded-md border-white/40 bg-white/10 p-2 text-white"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
