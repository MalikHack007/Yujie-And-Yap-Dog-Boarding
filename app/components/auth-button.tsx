"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  // Check auth state on mount
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/me", { method: "GET" });
      const data = await res.json();
  
      if (!res.ok) {
        setUser(null);
        return;
      }
  
      setUser(data.user ?? null);
    }

    fetchUser();
    
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleClick() {
    if (user) {
      // Logged in → logout
      await supabase.auth.signOut();
      setUser(null);
      router.push("/");
    } else {
      // Not logged in → go to signup
      router.push("/login");
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-lg transition ${
        user ? "bg-red-600 hover:bg-red-700 text-white" : "bg-black hover:bg-gray-800 text-white"
      }`}
    >
      {user ? "Logout" : "Login"}
    </button>
  );
}
