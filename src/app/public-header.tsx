import Link from "next/link";

// next page
export default function PublicHeader() {
  return (
    <>
      <Link
        href="/login"
        prefetch={false}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      >
        Login
      </Link>
    </>
  );
}
