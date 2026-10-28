import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm text-[#6B6B66]">Protected route. User ID: {session.userId}</p>
    </div>
  );
}
