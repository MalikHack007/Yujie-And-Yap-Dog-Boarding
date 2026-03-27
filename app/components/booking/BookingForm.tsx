"use client";

import { useEffect, useMemo, useState } from "react";
import type { ServiceType } from "@/types/booking";

type DogOption = {
  id: string;
  name: string;
};

//TODO: Get rid of drop-in and dog walk service types
const SERVICE_LABELS: Record<ServiceType, string> = {
  boarding: "Boarding",
  daycare: "Daycare",
  drop_in: "Drop-in",
  walk: "Dog Walk",
};

//TODO: Get rid of drop-in and dog walk service types
const SERVICE_ICONS: Record<ServiceType, string> = {
  boarding: "🏡",
  daycare: "☀️",
  drop_in: "🚪",
  walk: "🦮",
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

  const [startAt, setStartAt] = useState<string>("");
  const [endAt, setEndAt] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

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

  useEffect(() => {
    async function loadDogs() {
      setDogsLoading(true);
      setMessage("");
      try {
        const res = await fetch("/api/dogs", { method: "GET" });
        const data = await res.json();
        if (!res.ok) {
          setDogs([]);
          setMessageType("error");
          setMessage(data?.error ?? "Please log in to request a booking.");
          return;
        }
        const options: DogOption[] = (data ?? []).map((dog: any) => ({
          id: dog.id,
          name: dog.name,
        }));
        setDogs(options);
        setDogsLoading(false);
      } catch (e: any) {
        setDogs([]);
        setMessageType("error");
        setMessage(e?.message ?? "Error loading dogs.");
      }
    }
    loadDogs();
  }, []);

  function toggleDog(dogId: string) {
    setSelectedDogIds((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
    );
  }

  useEffect(() => {
    async function fetchQuote() {
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
            serviceType === "boarding" ? "nights" :
            serviceType === "daycare"  ? "days"   :
            serviceType === "drop_in"  ? "drop-in": "walk",
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
          setMessageType("error");
          setMessage(data?.error ?? "Could not compute quote.");
          return;
        }
        setQuote(data.quote as Quote);
      } catch (e: any) {
        setMessageType("error");
        setMessage(e?.message ?? "Could not compute quote.");
      }
    }
    fetchQuote();
  }, [serviceType, startAt, endAt, selectedDogIds.length]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (selectedDogIds.length === 0) {
      setMessageType("error");
      setMessage("Please select at least one dog.");
      return;
    }
    if (!startAt || !endAt) {
      setMessageType("error");
      setMessage("Please select both drop-off and pick-up date/time.");
      return;
    }
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (!(end > start)) {
      setMessageType("error");
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
        setMessageType("error");
        setMessage(data?.error ?? "Error submitting booking.");
        return;
      }
      setMessageType("success");
      setMessage("Booking submitted! We'll confirm shortly. 🐾");
      setSelectedDogIds([]);
      setServiceType("boarding");
      setStartAt("");
      setEndAt("");
    } finally {
      setSubmitting(false);
    }
  }

  // Shared label style
  const labelClass = "block text-sm font-semibold text-[var(--color-text-primary)] mb-[var(--spacing-2)]";

  // Shared input style
  const inputClass = `
    w-full
    text-sm text-[var(--color-text-primary)]
    bg-[var(--color-surface)]
    border border-[var(--color-border)]
    rounded-[var(--radius-input)]
    px-[var(--spacing-4)] py-[var(--spacing-3)]
    font-[var(--font-ui)]
    placeholder:text-[var(--color-text-muted)]
    transition-colors duration-[var(--duration-fast)]
    focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)]/20
  `;

  return (
    <div className="
      w-full max-w-[var(--width-lg)]
      bg-[var(--color-surface)]
      rounded-[var(--radius-card)]
      shadow-[var(--shadow-xl)]
      border border-[var(--color-border)]
      overflow-hidden
    ">

      {/* Card header */}
      <div className="
        px-[var(--spacing-8)] py-[var(--spacing-7)]
        bg-[linear-gradient(135deg,var(--color-green-800)_0%,var(--color-green-600)_100%)]
        border-b border-[var(--color-green-700)]
      ">
        <p className="
          text-xs font-semibold
          text-[var(--color-green-300)]
          tracking-[var(--letter-spacing-widest)] uppercase
          mb-[var(--spacing-1)]
        ">
          🐾 &nbsp;Pawsome Pet Care
        </p>
        <h2 className="
          font-[var(--font-display)]
          text-2xl font-bold
          text-white
          leading-[var(--line-height-tight)]
        ">
          Request a Booking
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="px-[var(--spacing-8)] py-[var(--spacing-7)] space-y-[var(--spacing-6)]">

        {/* Service Type */}
        <div>
          <label className={labelClass}>Service Type</label>
          <div className="grid grid-cols-2 gap-[var(--spacing-2)]">
            {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setServiceType(key)}
                className={[
                  "flex items-center gap-[var(--spacing-2)]",
                  "text-sm font-medium font-[var(--font-ui)]",
                  "px-[var(--spacing-3)] py-[var(--spacing-3)]",
                  "rounded-[var(--radius-lg)]",
                  "border",
                  "transition-all duration-[var(--duration-fast)]",
                  "cursor-pointer",
                  serviceType === key
                    ? "bg-[var(--color-primary-surface)] border-[var(--color-primary)] text-[var(--color-primary-dark)] shadow-[var(--shadow-xs)]"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]",
                ].join(" ")}
              >
                <span>{SERVICE_ICONS[key]}</span>
                {SERVICE_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Dogs */}
        <div>
          <label className={labelClass}>Select Dog(s)</label>
          {dogsLoading ? (
            <div className="
              text-sm text-[var(--color-text-muted)]
              font-[var(--font-ui)]
              px-[var(--spacing-4)] py-[var(--spacing-3)]
              border border-[var(--color-border)]
              rounded-[var(--radius-input)]
              bg-[var(--color-bg)]
            ">
              Loading your dogs...
            </div>
          ) : dogs.length === 0 ? (
            <div className="
              text-sm text-[var(--color-text-muted)]
              font-[var(--font-ui)]
              px-[var(--spacing-4)] py-[var(--spacing-3)]
              border border-[var(--color-border)]
              rounded-[var(--radius-input)]
              bg-[var(--color-bg)]
            ">
              No dogs found. Add a dog first, then come back here.
            </div>
          ) : (
            <div className="
              border border-[var(--color-border)]
              rounded-[var(--radius-input)]
              divide-y divide-[var(--color-border)]
              overflow-hidden
            ">
              {dogs.map((dog) => {
                const checked = selectedDogIds.includes(dog.id);
                return (
                  <label
                    key={dog.id}
                    className={[
                      "flex items-center gap-[var(--spacing-3)]",
                      "px-[var(--spacing-4)] py-[var(--spacing-3)]",
                      "cursor-pointer",
                      "transition-colors duration-[var(--duration-fast)]",
                      "font-[var(--font-ui)] text-sm",
                      checked
                        ? "bg-[var(--color-primary-surface)] text-[var(--color-primary-dark)]"
                        : "bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg)]",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDog(dog.id)}
                      className="accent-[var(--color-primary)] w-4 h-4 rounded cursor-pointer"
                    />
                    <span>🐶 {dog.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Date/time inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-4)]">
          <div>
            <label className={labelClass}>Drop-off</label>
            <input
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Pick-up</label>
            <input
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Price breakdown */}
        <div className="
          rounded-[var(--radius-lg)]
          border border-[var(--color-border)]
          bg-[var(--color-bg)]
          overflow-hidden
        ">
          <div className="
            px-[var(--spacing-4)] py-[var(--spacing-3)]
            border-b border-[var(--color-border)]
            bg-[var(--color-bg-subtle)]
          ">
            <p className="
              text-xs font-semibold
              text-[var(--color-text-secondary)]
              tracking-[var(--letter-spacing-wider)] uppercase
            ">
              Price Breakdown
            </p>
          </div>

          <div className="px-[var(--spacing-4)] py-[var(--spacing-4)] space-y-[var(--spacing-2)]">
            {[
              { label: "Service",      value: SERVICE_LABELS[serviceType] },
              { label: "Rate",         value: quote.canCompute ? `${quote.currency} ${quote.rate.toFixed(2)}` : "—" },
              { label: "Units",        value: quote.canCompute ? `${quote.units} ${quote.unitLabel}` : "—" },
              { label: "Dogs",         value: `${selectedDogIds.length}` },
              { label: "Per-dog total",value: quote.canCompute ? `${quote.currency} ${quote.perDogTotal.toFixed(2)}` : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center font-[var(--font-ui)]">
                <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
                <span className="text-sm font-medium text-[var(--color-text-primary)]">{value}</span>
              </div>
            ))}

            <div className="
              pt-[var(--spacing-3)] mt-[var(--spacing-1)]
              border-t border-[var(--color-border)]
              flex justify-between items-center
              font-[var(--font-ui)]
            ">
              <span className="text-base font-semibold text-[var(--color-text-primary)]">
                Estimated Total
              </span>
              <span className="
                text-base font-bold
                text-[var(--color-primary-dark)]
              ">
                {quote.canCompute ? `${quote.currency} ${quote.total.toFixed(2)}` : "—"}
              </span>
            </div>

            {!quote.canCompute && (
              <p className="text-xs text-[var(--color-text-muted)] pt-[var(--spacing-1)]">
                Enter a valid date range to see your estimate.
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || dogsLoading || dogs.length === 0}
          className="
            w-full
            inline-flex items-center justify-center gap-[var(--spacing-2)]
            bg-[var(--color-primary)] text-white
            text-sm font-bold font-[var(--font-ui)]
            tracking-[var(--letter-spacing-wide)]
            py-[var(--spacing-4)]
            rounded-[var(--radius-button)]
            shadow-[var(--shadow-green)]
            transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)]
            hover:bg-[var(--color-primary-dark)] hover:-translate-y-px hover:shadow-[var(--shadow-lg)]
            active:translate-y-0 active:shadow-[var(--shadow-sm)]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none
            cursor-pointer
          "
        >
          {submitting ? "Submitting..." : "Submit Booking 🐾"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <div className={[
          "mx-[var(--spacing-8)] mb-[var(--spacing-7)]",
          "px-[var(--spacing-4)] py-[var(--spacing-3)]",
          "rounded-[var(--radius-lg)]",
          "border",
          "font-[var(--font-ui)] text-sm font-medium text-center",
          messageType === "success"
            ? "bg-[var(--color-success-surface)] border-[var(--color-primary-light)] text-[var(--color-primary-dark)]"
            : "bg-[var(--color-error-surface)] border-[var(--color-terra-200)] text-[var(--color-signal)]",
        ].join(" ")}>
          {message}
        </div>
      )}
    </div>
  );
}
