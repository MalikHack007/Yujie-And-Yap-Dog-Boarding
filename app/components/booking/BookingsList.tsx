"use client";

import { useEffect, useMemo, useState } from "react";
import type { BookingStatus, ServiceType } from "@/types/booking";
import { formatDateTime, prettyServiceType } from "@/lib/booking/utils";

type DogRef = { id: string; name: string };

type BookingRow = {
  id: string;
  service_type: ServiceType;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  dogs: DogRef | null;
};

function statusBadgeClasses(status: BookingStatus) {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "current":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-gray-100 text-gray-800";
    case "declined":
      return "bg-red-100 text-red-800";
    case "completed":
      return "bg-gray-200 text-gray-800";

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

    try {
      const res = await fetch("/api/bookings", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setBookings([]);
        setErrorMsg(data?.error ?? "Unable to load bookings.");
        return;
      }

      // supports either: array response OR { bookings: array }
      const rows: BookingRow[] = Array.isArray(data) ? data : data?.bookings ?? [];
      setBookings(rows);
    } catch (err: any) {
      setBookings([]);
      setErrorMsg(err?.message ?? "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId: string) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error ?? "Failed to cancel booking.");
        return;
      }

      // Refresh list
      fetchBookings();
    } catch (err: any) {
      alert(err?.message ?? "Failed to cancel booking.");
    }
  }
    useEffect(() => {
    fetchBookings();
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

              {b.status === "pending" || b.status === "confirmed" ? (
                <div className="mt-3">
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="text-sm px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Cancel Booking
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}