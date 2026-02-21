"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type DogRef = { id: string; name: string };

type BookingRow = {
  id: string;
  service_type: string;
  start_at: string;
  end_at: string;
  status: string;

  dogs: DogRef | null;
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function prettyServiceType(s: string) {
  return s
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusBadgeClasses(status: string) {
  // Simple styling without hardcoding colors too much
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "cancelled":
    case "declined":
      return "bg-red-100 text-red-800";
    case "completed":
      return "bg-gray-200 text-gray-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-yellow-100 text-yellow-800"; // pending
  }
}

export default function BookingsList() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function fetchBookings() {
    setLoading(true);
    setErrorMsg("");

    // RLS should handle ownership filtering, but we also ensure logged-in user exists
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes?.user) {
      setBookings([]);
      setLoading(false);
      setErrorMsg("Please log in to view your bookings.");
      return;
    }

    // Join dogs so we can display the dog name.
    // This requires a FK relationship bookings.dog_id -> dogs.id
    const { data, error } = await supabase
      .from("Bookings")
      .select(
        `
        id,
        service_type,
        start_at,
        end_at,
        status,
        dogs:dog_id(
          id,
          name
        )
      `
      )
      .order("start_at", { ascending: false })
      .returns<BookingRow[]>();

    if (error) {
      setBookings([]);
      setErrorMsg("Error loading bookings: " + error.message);
    } else {
      setBookings((data ?? []) as BookingRow[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchBookings();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) setBookings([]);
      else fetchBookings();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const empty = useMemo(() => !loading && bookings.length === 0, [loading, bookings.length]);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-semibold">Your Bookings</h2>
        <button
          type="button"
          onClick={fetchBookings}
          className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : errorMsg ? (
        <p className="text-sm text-red-600">{errorMsg}</p>
      ) : empty ? (
        <p>You don’t have any bookings yet.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="border rounded-xl p-4 shadow-sm bg-white flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-lg">{prettyServiceType(b.service_type)}</div>
                  <div className="text-sm text-gray-600">
                    Dog: <span className="font-medium text-gray-800">{b.dogs?.name ?? "Unknown"}</span>
                  </div>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadgeClasses(
                    b.status
                  )}`}
                >
                  {prettyServiceType(b.status)}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-gray-500">Start</div>
                  <div className="font-medium">{formatDateTime(b.start_at)}</div>
                </div>
                <div>
                  <div className="text-gray-500">End</div>
                  <div className="font-medium">{formatDateTime(b.end_at)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}