import type { User } from "next-auth";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { getCurrentUser } from "~/server/common/get-server-auth-session";
import ProtectedHeader from "./protected-header";
import PublicHeader from "./public-header";

// next page
export default async function Header() {
  const user = (await getCurrentUser()) as User;
  const segment = useSelectedLayoutSegment();

  return (
    <header className="flex items-center justify-between bg-white/10 p-3">
      {segment !== "/" ? (
        <Link href="/" prefetch={false} className="text-xl font-bold">
          Home
        </Link>
      ) : (
        "Home"
      )}
      {user ? <ProtectedHeader /> : <PublicHeader />}
    </header>
  );
}
