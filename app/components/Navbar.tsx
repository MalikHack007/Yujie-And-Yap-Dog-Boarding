"use client";

import Link from "next/link";
import BookOnlineButton from "./book-online-button/book-online-button";
import AuthButton from "./auth-button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {

    async function checkUserAndAdmin() {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes?.user;

      if (!user) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");

      setIsAdmin(Boolean(data) && !error);

      setUser(user);
    }

    checkUserAndAdmin();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
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
