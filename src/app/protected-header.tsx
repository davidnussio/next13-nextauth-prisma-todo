import Link from "next/link";
import { useRouter } from "next/router";

// next page
export default function ProtectedHeader() {
  const router = useRouter();

  return (
    <>
      {router.pathname !== "/todo" ? (
        <Link href="/todo" className="text-xl font-bold">
          Todo
        </Link>
      ) : (
        "Todo"
      )}
      <div>{/* add an avatar image here */}avatar</div>
    </>
  );
}
