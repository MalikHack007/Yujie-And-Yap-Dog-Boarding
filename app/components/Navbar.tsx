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
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/session");
      const data: SessionResponse = await res.json();

      console.log("Session data:", data);

      if (!res.ok) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      setUser(data.user ?? null);
      setIsAdmin(Boolean(data.isAdmin));
    }

    loadSession();


    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
    
        if (!currentUser) {
          setIsAdmin(false);
          return;
        }
    
        try {
          const res = await fetch("/api/session");
          const data = await res.json();
    
          if (res.ok) {
            setIsAdmin(Boolean(data.isAdmin));
          } else {
            setIsAdmin(false);
          }
        } catch {
          setIsAdmin(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };  

  }, []);
  
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          LOGO
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/about" className="hover:text-gray-600 transition">
            About
          </Link>
          <Link href="/services" className="hover:text-gray-600 transition">
            Services
          </Link>
          <Link href="/team" className="hover:text-gray-600 transition">
            Meet The Team
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Client Dashboard
            </Link>
          ) : ""}

          {/* Only show if admin */}
          {isAdmin && (
            <Link
              href="/admin/bookings"
              className="text-sm font-medium px-3 py-1.5 rounded border hover:bg-gray-50"
            >
              View Admin Dashboard
            </Link>
          )}
        </div>

        {/* Book Online Button */}
        <div>
          <BookOnlineButton />
          <AuthButton />
        </div>
        


      </div>
    </nav>
  );
}
