"use client";

import type { User } from "@prisma/client";
import { signIn, signOut } from "next-auth/react";

const LoginButton = ({ user }: { user: User | undefined }) => {
  // const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined }
  // );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {user && <span>Logged in as {user?.email}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={user ? () => signOut() : () => signIn()}
      >
        {user ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default LoginButton;
