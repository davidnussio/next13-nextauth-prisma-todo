import Link from "next/link";

// next page
export default function ProtectedHeader() {
  return (
    <>
      <Link href="/todo" className="text-xl font-bold">
        Todo
      </Link>
      <div>{/* add an avatar image here */}avatar</div>
    </>
  );
}
