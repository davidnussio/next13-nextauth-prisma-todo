import { redirect } from "next/navigation";
import LoginButton from "~/app/login-button";
import { getCurrentUser } from "~/server/common/get-server-auth-session";

// Login page
export default async function LoginPage() {
  // Get current user
  const user = await getCurrentUser();

  // If user is logged in, redirect to home page
  if (user) {
    redirect("/");
  }

  // Return login page
  return (
    <div className="mx-auto flex max-w-md flex-col">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Login
      </h1>
      <LoginButton user={user} />
    </div>
  );
}
