"use client";

import Link from "next/link";
import Image from "next/image";
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
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Close menu when route changes
  const handleNavClick = () => setMenuOpen(false);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services/Pricing" },
  ];

  return (
    <>
      <nav
        className={[
          "w-full sticky top-0 z-[var(--z-sticky)]",
          "transition-all duration-[var(--duration-slow)]",
          scrolled || menuOpen
            ? "bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
      >
        <div className="
          max-w-[var(--width-7xl)] mx-auto
          px-[var(--spacing-6)]
          h-[var(--spacing-16)]
          flex items-center justify-between
        ">

          {/* Logo */}
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex items-center no-underline shrink-0"
          >
            <Image
              src="/Yujie_Yap_logo.png"
              alt="Yujie & Yap Dog Boarding"
              width={120}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden md:flex items-center gap-[var(--spacing-8)] font-[var(--font-ui)] text-sm font-medium">
            {navLinks.map(({ href, label }) => (
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
                  text-sm font-semibold no-underline
                  border border-[var(--color-primary-light)]
                  hover:bg-[var(--color-green-100)]
                  transition-colors duration-[var(--duration-fast)]
                "
              >
                Client Dashboard
              </Link>
            )}

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

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-[var(--spacing-3)]">
            <BookOnlineButton />
            <AuthButton />
          </div>

          {/* Mobile: hamburger + book button */}
          <div className="flex md:hidden items-center gap-[var(--spacing-3)]">
            <BookOnlineButton />
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="
                inline-flex flex-col items-center justify-center
                w-[var(--spacing-10)] h-[var(--spacing-10)]
                rounded-[var(--radius-md)]
                gap-[5px]
                border border-[var(--color-border)]
                bg-[var(--color-surface)]
                hover:bg-[var(--color-bg-subtle)]
                transition-colors duration-[var(--duration-fast)]
                cursor-pointer
                shrink-0
              "
            >
              {/* Animated burger lines */}
              <span className={[
                "block w-5 h-px bg-[var(--color-text-primary)]",
                "transition-all duration-[var(--duration-normal)]",
                menuOpen ? "translate-y-[6px] rotate-45" : "",
              ].join(" ")} />
              <span className={[
                "block w-5 h-px bg-[var(--color-text-primary)]",
                "transition-all duration-[var(--duration-normal)]",
                menuOpen ? "opacity-0" : "",
              ].join(" ")} />
              <span className={[
                "block w-5 h-px bg-[var(--color-text-primary)]",
                "transition-all duration-[var(--duration-normal)]",
                menuOpen ? "-translate-y-[6px] -rotate-45" : "",
              ].join(" ")} />
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        <div className={[
          "md:hidden overflow-hidden",
          "transition-all duration-[var(--duration-slow)] ease-[var(--ease-out)]",
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}>
          <div className="
            bg-[var(--color-surface)]
            border-t border-[var(--color-border)]
            px-[var(--spacing-6)]
            pb-[var(--spacing-6)]
            flex flex-col gap-[var(--spacing-1)]
          ">

            {/* Nav links */}
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={handleNavClick}
                className="
                  text-base font-medium font-[var(--font-ui)] no-underline
                  text-[var(--color-text-secondary)]
                  px-[var(--spacing-3)] py-[var(--spacing-3)]
                  rounded-[var(--radius-lg)]
                  border border-transparent
                  hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-primary)] hover:border-[var(--color-border)]
                  transition-colors duration-[var(--duration-fast)]
                "
              >
                {label}
              </Link>
            ))}

            {user && (
              <Link
                href="/dashboard"
                onClick={handleNavClick}
                className="
                  text-base font-semibold font-[var(--font-ui)] no-underline
                  text-[var(--color-primary-dark)]
                  bg-[var(--color-primary-surface)]
                  px-[var(--spacing-3)] py-[var(--spacing-3)]
                  rounded-[var(--radius-lg)]
                  border border-[var(--color-primary-light)]
                  hover:bg-[var(--color-green-100)]
                  transition-colors duration-[var(--duration-fast)]
                "
              >
                Client Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin/bookings"
                onClick={handleNavClick}
                className="
                  text-xs font-medium font-[var(--font-ui)] no-underline
                  text-[var(--color-text-muted)]
                  px-[var(--spacing-3)] py-[var(--spacing-3)]
                  rounded-[var(--radius-lg)]
                  border border-[var(--color-border)]
                  tracking-[var(--letter-spacing-wider)] uppercase
                  hover:bg-[var(--color-bg-subtle)]
                  transition-colors duration-[var(--duration-fast)]
                "
              >
                Admin
              </Link>
            )}

            {/* Auth button in mobile menu */}
            <div className="pt-[var(--spacing-3)] mt-[var(--spacing-2)] border-t border-[var(--color-border)]">
              <AuthButton />
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}