"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function BookOnlineButton() {
  const router = useRouter();

  async function handleClick() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      // Not logged in → go to signup
      router.push("/signup");
    } else {
      // Logged in → go to booking page
      router.push("/book");
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
