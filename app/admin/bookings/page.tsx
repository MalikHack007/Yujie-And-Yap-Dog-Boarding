"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { BookingStatus } from "@/types/booking";
import type { ServiceType } from "@/types/booking";

type DogRef = { id: string; name: string };

type BookingRow = {
  id: string;
  service_type: ServiceType;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  dog: DogRef | null;
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
  return s.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type FilterKey = "all" | "pending" | "upcoming" | "current" | "past" | "cancelled";

function classifyBooking(b: BookingRow): FilterKey {
  const now = new Date();
  const start = new Date(b.start_at);
  const end = new Date(b.end_at);

  if (b.status === "cancelled") return "cancelled";
  if (b.status === "pending") return "pending";
  if (end < now) return "past";
  if (start <= now && end >= now) return "current";
  if (start > now) return "upcoming";
  return "all";
}

function SidebarItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left px-4 py-3 border-b text-sm",
        active ? "bg-gray-100 font-medium" : "hover:bg-gray-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function fetchBookings() {
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase
      .from("Bookings")
      .select(
        `
        id,
        service_type,
        start_at,
        end_at,
        status,
        dog:dog_id(id,name)
        `
      )
      .order("start_at", { ascending: false })
      .overrideTypes<BookingRow[]>();
    
    

    if (error) {
      console.log("Error fetching bookings:", error);
      setErrorMsg(error.message);
      setBookings([]);
    } else {
      console.log("Fetched bookings:", data);
      setBookings((data ?? []) as BookingRow[]);
    }

    setLoading(false);
  }

  //fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // filter bookings based on selected filter
  const filtered = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => classifyBooking(b) === filter);
  }, [bookings, filter]);

  //update booking status
  async function setStatus(id: string, status: BookingStatus) {
    setBusyId(id);
    const { error } = await supabase.from("Bookings").update({ status }).eq("id", id);
    setBusyId(null);

    if (error) {
      alert(error.message);
      return;
    }
    // refresh list
    fetchBookings();
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left sidebar */}
      <aside className="col-span-12 md:col-span-3 border rounded">
        <SidebarItem label="All" active={filter === "all"} onClick={() => setFilter("all")} />
        <SidebarItem label="Pending" active={filter === "pending"} onClick={() => setFilter("pending")} />
        <SidebarItem label="Upcoming" active={filter === "upcoming"} onClick={() => setFilter("upcoming")} />
        <SidebarItem label="Current" active={filter === "current"} onClick={() => setFilter("current")} />
        <SidebarItem label="Past" active={filter === "past"} onClick={() => setFilter("past")} />
        <SidebarItem
          label="Cancelled"
          active={filter === "cancelled"}
          onClick={() => setFilter("cancelled")}
        />
      </aside>

      {/* Main content */}
      <main className="col-span-12 md:col-span-9">
        {loading && <div className="text-sm text-gray-600">Loading bookings…</div>}

        {errorMsg && (
          <div className="text-sm text-red-600 border border-red-200 bg-red-50 p-3 rounded">
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && filtered.length === 0 && (
          <div className="text-sm text-gray-600">No bookings found for this filter.</div>
        )}

        <div className="space-y-4">
          {filtered.map((b) => {
            const dogName = b.dog?.name ?? "Unknown dog";

            return (
              <div key={b.id} className="border rounded p-4">
                <div className="flex flex-col gap-2">
                  <div className="text-sm">
                    <span className="font-medium">Dog:</span> {dogName}
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Service Type:</span> {prettyServiceType(b.service_type)}{" "}
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="font-medium">Dates:</span>{" "}
                    {formatDateTime(b.start_at)} to {formatDateTime(b.end_at)}
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Booking Status:</span>{" "}
                    <span className="capitalize">{b.status}</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={busyId === b.id}
                      onClick={() => setStatus(b.id, "confirmed")}
                      className="px-4 py-2 text-sm rounded border hover:bg-gray-50 disabled:opacity-50"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      disabled={busyId === b.id}
                      onClick={() => setStatus(b.id, "cancelled")}
                      className="px-4 py-2 text-sm rounded border hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}