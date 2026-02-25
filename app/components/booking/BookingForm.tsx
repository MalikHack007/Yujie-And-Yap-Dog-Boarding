"use client";

import { useEffect, useMemo, useState } from "react";
import type { ServiceType } from "@/types/booking";

type DogOption = {
  id: string;
  name: string;
};

const SERVICE_LABELS: Record<ServiceType, string> = {
  boarding: "Boarding",
  daycare: "Daycare",
  drop_in: "Drop-in",
  walk: "Dog Walk",
};

type Quote = {
  canCompute: boolean;
  currency: string;
  rate: number;
  units: number;
  unitLabel: string;
  perDogTotal: number;
  dogsCount: number;
  total: number;
};

export default function BookingForm() {
  const [dogs, setDogs] = useState<DogOption[]>([]);
  const [dogsLoading, setDogsLoading] = useState(true);

  const [serviceType, setServiceType] = useState<ServiceType>("boarding");
  const [selectedDogIds, setSelectedDogIds] = useState<string[]>([]);

  const [startAt, setStartAt] = useState<string>(""); // "YYYY-MM-DDTHH:mm"
  const [endAt, setEndAt] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  const [quote, setQuote] = useState<Quote>({
    canCompute: false,
    currency: "USD",
    rate: 0,
    units: 0,
    unitLabel: "unit",
    perDogTotal: 0,
    dogsCount: 0,
    total: 0,
  });

  // Load user's dogs on mount (via API)
  useEffect(() => {

    async function loadDogs() {
      setDogsLoading(true);
      setMessage("");

      try {
        const res = await fetch("/api/dogs", { method: "GET" });
        const data = await res.json();

        if (!res.ok) {
          setDogs([]);
          setMessage(data?.error ?? "Please log in to request a booking.");
          return;
        }

        const options: DogOption[] = (data ?? []).map((dog: any) => ({
          id: dog.id,
          name: dog.name,
        }));

        setDogs(options);

      } catch (e: any) {
        setDogs([]);
        setMessage(e?.message ?? "Error loading dogs.");
      }
    }

    loadDogs();
  }, []);

  //set toggled dog state whenever a dog is toggled on and off
  function toggleDog(dogId: string) {
    setSelectedDogIds((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
    );
  }

  // Fetch quote whenever inputs change (backend computes rate + units + totals)
  useEffect(() => {

    async function fetchQuote() {
      // Reset quote if can't compute yet
      const start = startAt ? new Date(startAt) : null;
      const end = endAt ? new Date(endAt) : null;
      const canCompute = !!start && !!end && end > start;

      if (!canCompute) {
        setQuote((q) => ({
          ...q,
          canCompute: false,
          dogsCount: selectedDogIds.length,
          units: 0,
          perDogTotal: 0,
          total: 0,
          unitLabel:
            serviceType === "boarding"
              ? "nights"
              : serviceType === "daycare"
              ? "days"
              : serviceType === "drop_in"
              ? "drop-in"
              : "walk",
        }));
        return;
      }

      try {
        const res = await fetch("/api/bookings/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_type: serviceType,
            start_at: start!.toISOString(),
            end_at: end!.toISOString(),
            dogs_count: selectedDogIds.length,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          // Keep UI usable; just show error in message
          setMessage(data?.error ?? "Could not compute quote.");
          return;
        }

        setQuote(data.quote as Quote);
      } catch (e: any) {
        setMessage(e?.message ?? "Could not compute quote.");
      }
    }

  }, [serviceType, startAt, endAt, selectedDogIds.length]);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setMessage("");

    if (selectedDogIds.length === 0) {
      setMessage("Please select at least one dog.");
      return;
    }

    if (!startAt || !endAt) {
      setMessage("Please select both drop-off and pick-up date/time.");
      return;
    }

    const start = new Date(startAt);
    const end = new Date(endAt);

    if (!(end > start)) {
      setMessage("Pick-up must be after drop-off.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_type: serviceType,
          start_at: start.toISOString(),
          end_at: end.toISOString(),
          dog_ids: selectedDogIds,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.error ?? "Error submitting booking.");
        return;
      }

      setMessage("Booking submitted! Status: pending.");

      // reset
      setSelectedDogIds([]);
      setServiceType("boarding");
      setStartAt("");
      setEndAt("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Request a Booking</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Type */}
        <div>
          <label className="block mb-1 font-medium">Service Type</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ServiceType)}
            className="w-full border rounded-lg p-2"
          >
            {Object.keys(SERVICE_LABELS).map((key) => (
              <option key={key} value={key}>
                {SERVICE_LABELS[key as ServiceType]}
              </option>
            ))}
          </select>
        </div>

        {/* Dogs */}
        <div>
          <label className="block mb-1 font-medium">Select Dog(s)</label>

          {dogsLoading ? (
            <div className="text-sm text-gray-600">Loading your dogs...</div>
          ) : dogs.length === 0 ? (
            <div className="text-sm text-gray-600">
              You don’t have any dogs yet. Add a dog first, then come back here.
            </div>
          ) : (
            <div className="border rounded-lg p-3 space-y-2">
              {dogs.map((dog) => (
                <label key={dog.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDogIds.includes(dog.id)}
                    onChange={() => toggleDog(dog.id)}
                  />
                  <span>{dog.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Drop-off */}
        <div>
          <label className="block mb-1 font-medium">Drop-off (Start)</label>
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Pick-up */}
        <div>
          <label className="block mb-1 font-medium">Pick-up (End)</label>
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Price breakdown */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="font-semibold mb-2">Price Breakdown</div>

          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Service</span>
              <span className="font-medium">{SERVICE_LABELS[serviceType]}</span>
            </div>

            <div className="flex justify-between">
              <span>Rate</span>
              <span className="font-medium">
                {quote.canCompute ? `${quote.currency} ${quote.rate.toFixed(2)}` : "—"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Units</span>
              <span className="font-medium">
                {quote.canCompute ? quote.units : "—"} {quote.unitLabel}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Dogs selected</span>
              <span className="font-medium">{selectedDogIds.length}</span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between">
              <span>Per-dog total</span>
              <span className="font-medium">
                {quote.canCompute ? `${quote.currency} ${quote.perDogTotal.toFixed(2)}` : "—"}
              </span>
            </div>

            <div className="flex justify-between text-base">
              <span className="font-semibold">Estimated total</span>
              <span className="font-semibold">
                {quote.canCompute ? `${quote.currency} ${quote.total.toFixed(2)}` : "—"}
              </span>
            </div>

            {!quote.canCompute && (
              <div className="text-xs text-gray-600 mt-2">
                Enter a valid date/time range to see totals.
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || dogsLoading || dogs.length === 0}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Booking"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-gray-800">
          {message}
        </p>
      )}
    </div>
  );

}