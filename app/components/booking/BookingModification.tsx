"use client";

import { useEffect, useMemo, useState } from "react";
import type { BookingQuote, BookingRow, DogRef } from "@/types/booking";

type Props = {
  booking: BookingRow;
  onSaved: () => void;
  onCancel: () => void;
};

function toLocalInputValue(iso: string) {
  const date = new Date(iso);
  const tzOffsetMs = date.getTimezoneOffset() * 60_000;
  const local = new Date(date.getTime() - tzOffsetMs);
  return local.toISOString().slice(0, 16);
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export default function BookingModification({ booking, onSaved, onCancel }: Props) {
  const [dogs, setDogs] = useState<DogRef[]>([]);
  const [dogsLoading, setDogsLoading] = useState(true);

  const [startAt, setStartAt] = useState<string>(() => toLocalInputValue(booking.start_at));
  const [endAt, setEndAt] = useState<string>(() => toLocalInputValue(booking.end_at));
  const [selectedDogIds, setSelectedDogIds] = useState<string[]>(
    booking.dogs.map((dog) => dog.id)
  );

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const [quote, setQuote] = useState<BookingQuote>({
    canCompute: false,
    currency: "USD",
    rate: 0,
    units: 0,
    unitLabel: booking.service_type === "boarding" ? "nights" : "days",
    perDogTotal: 0,
    dogsCount: selectedDogIds.length,
    total: 0,
  });

  const blocked = booking.status === "completed" || booking.status === "cancelled";

  const dateRangeValid = useMemo(() => {
    if (!startAt || !endAt) return false;
    const start = new Date(startAt);
    const end = new Date(endAt);
    return end > start;
  }, [startAt, endAt]);

  useEffect(() => {
    async function loadDogs() {
      setDogsLoading(true);
      try {
        const res = await fetch("/api/dogs", { method: "GET" });
        const data = (await res.json()) as Array<{ id: string; name: string }> | { error?: string };
        if (!res.ok || !Array.isArray(data)) {
          setDogs([]);
          setMessageType("error");
          setMessage(!Array.isArray(data) ? data.error ?? "Unable to load your dogs." : "Unable to load your dogs.");
          return;
        }
        setDogs(data.map((dog) => ({ id: dog.id, name: dog.name })));
      } catch (err: unknown) {
        setDogs([]);
        setMessageType("error");
        setMessage(err instanceof Error ? err.message : "Unable to load your dogs.");
      } finally {
        setDogsLoading(false);
      }
    }

    loadDogs();
  }, []);

  useEffect(() => {
    async function fetchQuote() {
      if (!dateRangeValid) {
        setQuote((q) => ({
          ...q,
          canCompute: false,
          dogsCount: selectedDogIds.length,
          units: 0,
          perDogTotal: 0,
          total: 0,
        }));
        return;
      }

      try {
        const res = await fetch("/api/bookings/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_type: booking.service_type,
            start_at: new Date(startAt).toISOString(),
            end_at: new Date(endAt).toISOString(),
            dogs_count: selectedDogIds.length,
          }),
        });

        const data = (await res.json()) as { error?: string; quote?: BookingQuote };
        if (!res.ok || !data.quote) {
          setMessageType("error");
          setMessage(data.error ?? "Could not compute updated pricing.");
          return;
        }

        setQuote(data.quote);
      } catch (err: unknown) {
        setMessageType("error");
        setMessage(err instanceof Error ? err.message : "Could not compute updated pricing.");
      }
    }

    fetchQuote();
  }, [booking.service_type, dateRangeValid, endAt, selectedDogIds.length, startAt]);

  function toggleDog(dogId: string) {
    setSelectedDogIds((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
    );
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (blocked) {
      setMessageType("error");
      setMessage("Completed or cancelled bookings cannot be modified.");
      return;
    }

    if (!dateRangeValid) {
      setMessageType("error");
      setMessage("End date/time must be after start date/time.");
      return;
    }

    if (selectedDogIds.length === 0) {
      setMessageType("error");
      setMessage("Please select at least one pet.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_at: new Date(startAt).toISOString(),
          end_at: new Date(endAt).toISOString(),
          dog_ids: selectedDogIds,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMessageType("error");
        setMessage(data.error ?? "Could not update booking.");
        return;
      }

      setMessageType("success");
      setMessage("Booking updated successfully.");
      onSaved();
    } catch (err: unknown) {
      setMessageType("error");
      setMessage(err instanceof Error ? err.message : "Could not update booking.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleConfirm} className="mt-3 border rounded-lg bg-gray-50 p-4 space-y-4">
      <h3 className="font-semibold text-lg">Modify Booking</h3>

      {blocked ? (
        <p className="text-sm text-red-600">Completed or cancelled bookings cannot be modified.</p>
      ) : null}

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="block text-gray-600 mb-1">Start date/time</span>
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            disabled={blocked}
            className="w-full rounded border px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-600 mb-1">End date/time</span>
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            disabled={blocked}
            className="w-full rounded border px-3 py-2"
          />
        </label>
      </div>

      <div>
        <div className="text-sm text-gray-600 mb-2">Pets included</div>
        {dogsLoading ? (
          <p className="text-sm text-gray-500">Loading pets...</p>
        ) : dogs.length === 0 ? (
          <p className="text-sm text-gray-500">No pets available.</p>
        ) : (
          <div className="space-y-2">
            {dogs.map((dog) => {
              const checked = selectedDogIds.includes(dog.id);
              return (
                <label key={dog.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleDog(dog.id)}
                    disabled={blocked}
                  />
                  <span>{dog.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded border bg-white p-3 text-sm">
        <div className="font-semibold mb-1">Updated pricing</div>
        {quote.canCompute ? (
          <>
            <div>
              {quote.units} {quote.unitLabel} × {formatMoney(quote.rate, quote.currency)} / pet
            </div>
            <div>Per pet: {formatMoney(quote.perDogTotal, quote.currency)}</div>
            <div>Pets: {quote.dogsCount}</div>
            <div className="font-semibold">Total: {formatMoney(quote.total, quote.currency)}</div>
          </>
        ) : (
          <p className="text-gray-500">Select a valid date range to see pricing.</p>
        )}
      </div>

      {message ? (
        <p className={`text-sm ${messageType === "error" ? "text-red-600" : "text-green-700"}`}>
          {message}
        </p>
      ) : null}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting || blocked}
          className="text-sm px-3 py-1.5 rounded border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Confirm changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
