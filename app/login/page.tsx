"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          padding: 24,
          borderRadius: 12,
          border: "1px solid #ddd",
          display: "grid",
          gap: 12,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>
          {mode === "login" ? "Log in" : "Create account"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10 }}
        />

        {error && (
          <div style={{ color: "red", fontSize: 14 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 10,
            background: "#1f6f43",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Log in"
            : "Create account"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          style={{
            background: "transparent",
            border: "none",
            color: "#1f6f43",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {mode === "login"
            ? "Create an account"
            : "Back to login"}
        </button>
      </form>
    </div>
  );
}
