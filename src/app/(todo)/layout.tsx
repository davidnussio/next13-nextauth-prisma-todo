import { redirect } from "next/navigation";
import { getCurrentUser } from "~/server/common/get-server-auth-session";

async function TodoLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-slate-50 to-slate-900 p-48">
      {children}
    </div>
  );
}

export default TodoLayout;
