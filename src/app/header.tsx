import Link from "next/link";

// next page
export default function Header() {
  // Create header using tailwind with links home, todo and login
  return (
    <header className="flex items-center justify-between bg-white/10 p-3">
      <Link href="/" className="text-xl font-bold">
        Home
      </Link>
      {/* only show the Todo link if the user is logged in */}
      {/* you will need to add logic to check if the user is logged in here */}
      <Link href="/todo" className="text-xl font-bold">
        Todo
      </Link>
      <div>{/* add an avatar image here */}avatar</div>
    </header>
  );
}
