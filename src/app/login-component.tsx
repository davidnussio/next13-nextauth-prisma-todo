import type { User } from "next-auth";
import Link from "next/link";
import { getCurrentUser } from "~/server/common/get-server-auth-session";
import { LogoutButton } from "./logout-button";

export async function LoginComponent() {
  const user = (await getCurrentUser()) as User;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {user && <span>Logged in as {user?.email}</span>}
      </p>

      {user ? (
        <LogoutButton />
      ) : (
        <Link
          href="/login"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          prefetch={false}
        >
          Login
        </Link>
      )}
    </div>
  );
}
