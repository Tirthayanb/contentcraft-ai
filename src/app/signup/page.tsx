"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border border-[#E7E5E0] rounded-xl p-6">
        <h1 className="text-xl font-bold mb-4">Sign up</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border border-[#E7E5E0] rounded-lg px-3 py-2 text-sm" type="text" placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full border border-[#E7E5E0] rounded-lg px-3 py-2 text-sm" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full border border-[#E7E5E0] rounded-lg px-3 py-2 text-sm" type="password" placeholder="Password (min 8)" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button className="w-full bg-[#2B2D2A] text-white rounded-lg py-2 text-sm">Sign up</button>
        </form>
        <p className="mt-3 text-xs text-[#6B6B66]">Already have an account? <Link href="/login" className="underline">Login</Link></p>
      </div>
    </div>
  );
}
