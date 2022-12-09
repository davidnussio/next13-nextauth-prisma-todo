"use client";

import { signIn } from "next-auth/react";

const LoginForm = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await fetch("/api/c");
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    console.log(email.value, password.value);
    signIn("credentials", {
      email: email.value,
      password: password.value,
      callbackUrl: "/",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email" className="text-white">
        Email
      </label>
      <input
        id="email"
        type="email"
        className="w-full rounded-md bg-white/10 text-white"
      />
      <label htmlFor="password" className="text-white">
        Password
      </label>
      <input
        id="password"
        type="password"
        className="w-full rounded-md bg-white/10 text-white"
      />
      <button
        type="submit"
        className="w-full rounded-md bg-white/10 text-white"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
