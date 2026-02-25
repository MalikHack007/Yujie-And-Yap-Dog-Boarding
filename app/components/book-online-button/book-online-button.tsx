"use client";

import { useRouter } from "next/navigation";

export default function BookOnlineButton() {
  const router = useRouter();

  async function handleClick() {
    try {
      const res = await fetch("/api/session", {
        method: "GET",
        cache: "no-store", // ensure fresh auth check
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
      className="bg-black text-white px-6 py-3 rounded-lg"
    >
      Book Online
    </button>
  );
}
