import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

// next page
export default function ProtectedHeader() {
  const segment = useSelectedLayoutSegment();

  return (
    <>
      {segment !== "/todo" ? (
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
