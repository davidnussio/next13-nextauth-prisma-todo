import LoginForm from "./login-form";

import VerificationCodeFlow from "./sms-code";

// Login page
export default async function LoginPage() {
  // Return login page
  return (
    <div className="mx-auto flex max-w-md flex-col">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Login
      </h1>
      <LoginForm />
      <hr className="my-4 border-white/40" />
      <h2>Code auth</h2>
      <VerificationCodeFlow />
    </div>
  );
}
