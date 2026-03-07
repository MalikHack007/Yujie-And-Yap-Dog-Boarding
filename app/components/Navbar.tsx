"use client";

import Link from "next/link";
import BookOnlineButton from "./book-online-button/book-online-button";
import AuthButton from "./auth-button";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useMemo } from "react";

type SessionResponse = {
  user: any | null;
  isAdmin: boolean;
};

export default function Navbar() {
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/session");
      const data: SessionResponse = await res.json();
      if (!res.ok) { setUser(null); setIsAdmin(false); return; }
      setUser(data.user ?? null);
      setIsAdmin(Boolean(data.isAdmin));
    }
    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (!currentUser) { setIsAdmin(false); return; }
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        if (res.ok) setIsAdmin(Boolean(data.isAdmin));
        else setIsAdmin(false);
      } catch { setIsAdmin(false); }
    });

    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={[
        "w-full sticky top-0 z-[var(--z-sticky)]",
        "transition-all duration-[var(--duration-slow)]",
        scrolled
          ? "bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-[var(--shadow-sm)] backdrop-blur-md"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <div className="
        max-w-[var(--width-7xl)] mx-auto
        px-[var(--spacing-6)]
        h-[var(--spacing-16)]
        flex items-center justify-between
      ">

        {/* Logo — text-xl for size, text-[var(--color-primary-dark)] for color, no collision */}
        <Link
          href="/"
          className="
            flex items-center gap-[var(--spacing-2)]
            font-[var(--font-display)]
            text-xl font-bold
            text-[var(--color-primary-dark)]
            tracking-[var(--letter-spacing-tight)]
            no-underline
          "
        >
          {/* Icon span — text-base for size only, color set via text-white */}
          <span className="
            inline-flex items-center justify-center
            w-[var(--spacing-8)] h-[var(--spacing-8)]
            rounded-[var(--radius-full)]
            bg-[var(--color-primary)]
            text-base text-white
          ">
            🐾
          </span>
          Yujie & Yap
        </Link>

        {/* Center Links — text-sm for size on the wrapper, colors on individual children */}
        <div className="hidden md:flex items-center gap-[var(--spacing-8)] font-[var(--font-ui)] text-sm font-medium">
          {[
            { href: "/about", label: "About" },
            { href: "/services", label: "Services" },
            { href: "/team", label: "Meet the Team" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="
                text-[var(--color-text-secondary)] no-underline
                tracking-[var(--letter-spacing-wide)]
                pb-[var(--spacing-1)] border-b-2 border-transparent
                hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]
                transition-colors duration-[var(--duration-fast)]
              "
            >
              {label}
            </Link>
          ))}

          {user && (
            <Link
              href="/dashboard"
              className="
                bg-[var(--color-primary-surface)] text-[var(--color-primary-dark)]
                px-[var(--spacing-4)] py-[var(--spacing-1-5)]
                rounded-[var(--radius-full)]
                text-sm font-semibold
                no-underline
                border border-[var(--color-primary-light)]
                hover:bg-[var(--color-green-100)]
                transition-colors duration-[var(--duration-fast)]
              "
            >
              Client Dashboard
            </Link>
          )}

          {/* Admin link — text-xs for size, text-[var(--color-text-muted)] for color, on separate elements */}
          {isAdmin && (
            <Link
              href="/admin/bookings"
              className="
                text-xs text-[var(--color-text-muted)]
                px-[var(--spacing-3)] py-[var(--spacing-1-5)]
                rounded-[var(--radius-md)]
                font-medium no-underline
                border border-[var(--color-border)]
                tracking-[var(--letter-spacing-wider)] uppercase
                hover:bg-[var(--color-bg-subtle)]
                transition-colors duration-[var(--duration-fast)]
              "
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-[var(--spacing-3)]">
          <BookOnlineButton />
          <AuthButton />
        </div>

      </div>
    </nav>
  );
}