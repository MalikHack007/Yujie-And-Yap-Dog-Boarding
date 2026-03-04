"use client";

import { useRouter } from "next/navigation";

export default function BookOnlineButton() {
  const router = useRouter();

  async function handleClick() {
    try {
      const res = await fetch("/api/session", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data.user) {
        router.push("/login");
        return;
      }

      router.push("/book");
    } catch {
      router.push("/login");
    }
  }

  return (
    <button
      onClick={handleClick}
      className="
        inline-flex items-center gap-[var(--spacing-2)]
        bg-[var(--color-primary)] text-white
        text-sm font-semibold
        font-[var(--font-ui)]
        tracking-[var(--letter-spacing-wide)]
        px-[var(--spacing-5)] py-[var(--spacing-2-5)]
        rounded-[var(--radius-button)]
        shadow-[var(--shadow-green)]
        transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)]
        hover:bg-[var(--color-primary-dark)] hover:-translate-y-px hover:shadow-[var(--shadow-lg)]
        active:translate-y-0 active:shadow-[var(--shadow-sm)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2
        cursor-pointer
      "
    >
      Book Online
    </button>
  );
}