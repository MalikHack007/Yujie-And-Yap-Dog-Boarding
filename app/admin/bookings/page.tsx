"use client";

import { useEffect, useMemo, useState } from "react";
import type { BookingStatus } from "@/types/booking";
import type { ServiceType } from "@/types/booking";
import { formatDateTime, prettyServiceType } from "@/lib/booking/utils";
import { useSearchParams } from 'next/navigation'


type DogRef = { id: string; name: string };

type BookingRow = {
  id: string;
  service_type: ServiceType;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  dog: DogRef | null;
};

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

  const searchParams = useSearchParams();
  const gcal = searchParams.get("gcal");
  const reason = searchParams.get("reason");
  const desc = searchParams.get("desc");

  const [filter, setFilter] = useState<FilterKey>("all");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // 🔁 Fetch bookings via API
  async function fetchBookings() {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data?.error ?? "Failed to load bookings.");
        setBookings([]);
        return;
      }

      const rows: BookingRow[] =
        Array.isArray(data) ? data : data?.bookings ?? [];

      setBookings(rows);
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Failed to load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
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

  // 🔁 Update booking status via API
  async function setStatus(id: string, status: BookingStatus) {
    setBusyId(id);

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error ?? "Failed to update booking.");
        return;
      }

      // Optimistic update (no refetch needed)
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status } : b
        )
      );
    } catch (err: any) {
      alert(err?.message ?? "Failed to update booking.");
    } finally {
      setBusyId(null);
    }
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
        {gcal === "connected" && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
            Google Calendar connected.
          </div>
        )}

        {gcal === "error" && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            Google Calendar connection failed.
            {reason ? <div className="mt-1 opacity-80">Reason: {reason}</div> : null}
            {desc ? <div className="mt-1 opacity-80">{desc}</div> : null}
          </div>
        )}

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