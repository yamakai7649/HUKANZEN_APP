"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();

  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [user, authLoading, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      setError(msg || "ログインに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black text-white">
      <div className="w-full max-w-sm px-8">
        <h1 className="text-2xl tracking-[0.3em] uppercase mb-12 text-center font-light">
          HUKANZEN
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-transparent border-b border-white/20 py-3 text-sm tracking-widest placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-transparent border-b border-white/20 py-3 text-sm tracking-widest placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
          />

          {error && (
            <p className="text-red-400 text-xs tracking-wider text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 text-xs tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors duration-500 disabled:opacity-30"
          >
            {isSubmitting ? "..." : "LOGIN"}
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-white/30 tracking-widest">
          <Link href="/register" className="hover:text-white/60 transition-colors">
            CREATE ACCOUNT
          </Link>
        </p>
      </div>
    </div>
  );
}
