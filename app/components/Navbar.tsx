"use client";

import Link from "next/link";

export default function Navbar() {
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
        </div>

        {/* Book Online Button */}
        <Link
          href="/book"
          className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Book Online
        </Link>

      </div>
    </nav>
  );
}
