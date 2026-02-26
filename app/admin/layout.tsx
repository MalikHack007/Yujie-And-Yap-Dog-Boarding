"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function TabLink({ href, label }: { href: string; label: string }) {
  //get current pathname and check if it matches the href to determine if this tab is active
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "px-4 py-2 text-sm font-medium border-b-2",
        active ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);


  // On mount, check if the user is an admin. If not, redirect to login or dashboard. Everytime the route changes, check again (in case they log out or something).
  useEffect(() => {
    async function guard() {
      const res = await fetch("/api/session", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data?.user) {
        setAllowed(false);
        router.replace("/login");
        return;
      }

      if (!data?.isAdmin) {
        setAllowed(false);
        router.replace("/dashboard");
        return;
      }

      setAllowed(true);
    }
    guard();
  }, [router]);

  if (allowed === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-600">
        Checking admin access…
      </div>
    );
  }

  if (allowed === false) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">Admin Dashboard</div>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:underline">
            Back to user dashboard
          </Link>
        </div>

        <div className="mx-auto max-w-6xl px-4 flex gap-2">
          <TabLink href="/admin/bookings" label="Bookings" />
          <TabLink href="/admin/clients" label="Clients" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}