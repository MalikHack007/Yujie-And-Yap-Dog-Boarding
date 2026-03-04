"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/me", { method: "GET" });
      const data = await res.json();
      if (!res.ok) { setUser(null); return; }
      setUser(data.user ?? null);
    }

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => { listener.subscription.unsubscribe(); };
  }, []);

  async function handleClick() {
    if (user) {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/");
    } else {
      router.push("/login");
    }
  }

  return (
    <button
      onClick={handleClick}
      className={[
        // Base styles shared by both states
        "inline-flex items-center",
        "text-sm font-medium font-[var(--font-ui)]",
        "tracking-[var(--letter-spacing-wide)]",
        "px-[var(--spacing-4)] py-[var(--spacing-2)]",
        "rounded-[var(--radius-button)]",
        "border",
        "transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)]",
        "hover:-translate-y-px active:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "cursor-pointer",

        // State-specific styles — color tokens only in text-[var()], size via named scale above
        user
          ? [
              "bg-transparent text-[var(--color-signal)]",
              "border-[var(--color-signal)]",
              "hover:bg-[var(--color-signal-surface)]",
              "focus-visible:ring-[var(--color-signal)]",
            ].join(" ")
          : [
              "bg-transparent text-[var(--color-text-secondary)]",
              "border-[var(--color-border)]",
              "hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]",
              "focus-visible:ring-[var(--color-border-focus)]",
            ].join(" "),
      ].join(" ")}
    >
      {user ? "Logout" : "Login"}
    </button>
  );
}