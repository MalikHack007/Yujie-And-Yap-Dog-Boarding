"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ServiceType = "boarding" | "daycare" | "drop_in" | "walk";

type DogOption = {
  id: string;
  name: string;
};

const SERVICE_LABELS: Record<ServiceType, string> = {
  boarding: "Boarding ($50 / night)",
  daycare: "Daycare ($55 / day)",
  drop_in: "Drop-in ($30 / drop-in)",
  walk: "Dog Walk ($55 / walk)",
};

const DEFAULT_RATES: Record<ServiceType, number> = {
  boarding: 50,
  daycare: 55,
  drop_in: 30,
  walk: 55,
};

//strip a date down to local midnight (start of day) for accurate day boundary calculations
function startOfLocalDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

//calculate how many nigths between two dates.
function diffDaysLocal(a: Date, b: Date) {
  // difference in whole local days between start-of-day values
  const ms = startOfLocalDay(b).getTime() - startOfLocalDay(a).getTime();
  return Math.round(ms / 86400000);
}

/**
 * Boarding units:
 * - base nights = number of day boundaries crossed: date(end) - date(start)
 * - extra:
 *    - if pickup is 2–8 hours later than dropoff time-of-day => +0.5
 *    - if pickup is 8+ hours later than dropoff time-of-day => +1.0
 */
function computeBoardingUnits(startAt: Date, endAt: Date) {
  if (!(endAt > startAt)) return 0;

  const baseNights = Math.max(0, diffDaysLocal(startAt, endAt));

  const startMinutes = startAt.getHours() * 60 + startAt.getMinutes();
  const endMinutes = endAt.getHours() * 60 + endAt.getMinutes();

  let minutesLater = endMinutes - startMinutes;
  // If pickup is earlier in the day than dropoff time, it doesn't count as extra time
  if (minutesLater < 0) minutesLater = 0; 

  const hoursLater = minutesLater / 60;

  let extra = 0;

  if (hoursLater >= 8) extra = 1;
  else if (hoursLater >= 2) extra = 0.5;
  else extra = 0;

  return baseNights + extra;
}

function computeDaycareUnits(startAt: Date, endAt: Date) {
  // Count calendar days inclusive (min 1)
  const days = diffDaysLocal(startAt, endAt) + 1;
  return Math.max(1, days);
}

function roundMoney(n: number) {
  //saves the two decimal places to the right
  return Math.round(n * 100) / 100;
}

export default function BookingForm() {
  const [dogs, setDogs] = useState<DogOption[]>([]);
  const [dogsLoading, setDogsLoading] = useState(true);

  const [serviceType, setServiceType] = useState<ServiceType>("boarding");
  const [selectedDogIds, setSelectedDogIds] = useState<string[]>([]);

  // Use datetime-local for cleaner UX (date + time together)
  const [startAt, setStartAt] = useState<string>(""); // "YYYY-MM-DDTHH:mm"
  const [endAt, setEndAt] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  //load users dogs on mount
  useEffect(() => {
    // Load user's dogs and set state
    async function loadDogs() {
      setDogsLoading(true);
      setMessage("");

      const { data: userRes } = await supabase.auth.getUser();

      if (!userRes?.user) {
          setDogs([]);
          setDogsLoading(false);
          setMessage("Please log in to request a booking.");
          return;
      }

      const { data, error } = await supabase
        .from("dogs")
        .select("id,name")
        .order("created_at", { ascending: false });

      if (error) {
        setDogs([]);
        setMessage("Error loading dogs: " + error.message);
      } else {
        setDogs((data ?? []) as DogOption[]);
      }

      setDogsLoading(false);
    }

    loadDogs();
  }, []);

  //update the selected dogs state when a checkbox is toggled on and off
  function toggleDog(dogId: string) {
    setSelectedDogIds((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
    );
  }

  //calculate the pricing whenever relevant states change, and memoize it to avoid unnecessary recalculations on every render. 
  const pricing = useMemo(() => {
    const rate = DEFAULT_RATES[serviceType];

    const start = startAt ? new Date(startAt) : null;
    const end = endAt ? new Date(endAt) : null;

    let units = 0;
    let unitLabel = "";

    
    const canCompute = !!start && !!end && end > start; //purpose of !! is to convert from Date | null to boolean for the check. We want both start and end to be valid dates, and end must be after start.

    if (!canCompute) {
      return {
        canCompute: false,
        rate,
        units: 0,
        unitLabel: serviceType === "boarding" ? "nights" : serviceType === "daycare" ? "days" : "unit",
        perDogTotal: 0,
        dogsCount: selectedDogIds.length,
        total: 0,
      };
    }

    if (serviceType === "boarding") {
      units = computeBoardingUnits(start!, end!);//! is used to assert that start and end are not null, since we checked canCompute above. This allows us to call the computeBoardingUnits function without TypeScript complaining about possible null values.
      unitLabel = "nights";
    } else if (serviceType === "daycare") {
      units = computeDaycareUnits(start!, end!);
      unitLabel = "days";
    } else if (serviceType === "drop_in") {
      units = 1;
      unitLabel = "drop-in";
    } else {
      units = 1;
      unitLabel = "walk";
    }

    const perDogTotal = roundMoney(units * rate);
    const dogsCount = selectedDogIds.length;
    const total = roundMoney(perDogTotal * dogsCount);

    return {
      canCompute: true,
      rate,
      units,
      unitLabel,
      perDogTotal,
      dogsCount,
      total,
    };
  }, [serviceType, startAt, endAt, selectedDogIds]);

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

    const { data: userRes, error: userErr } = await supabase.auth.getUser();

    if (userErr || !userRes?.user) {
      setMessage("You must be logged in to submit a booking.");
      return;
    }

    // Compute per-dog units & totals (each dog gets its own booking row)
    const rate = DEFAULT_RATES[serviceType];

    let units = 0;
    if (serviceType === "boarding") units = computeBoardingUnits(start, end);
    else if (serviceType === "daycare") units = computeDaycareUnits(start, end);
    else units = 1;

    const perDogTotal = roundMoney(units * rate);

    const rows = selectedDogIds.map((dogId) => ({
      dog_id: dogId,
      owner_id: userRes.user.id,
      service_type: serviceType, // must match your table column name
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      rate,
      units,
      total_cost: perDogTotal,
      currency: "USD",
      status: "pending",
    }));

    setSubmitting(true);
    try {
      const { error } = await supabase.from("Bookings").insert(rows);
      if (error) {
        setMessage("Error submitting booking: " + error.message);
        return;
      }

      setMessage("Booking submitted! Status: pending.");
      //reset
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

        {/* Price breakdown (pre-submit) */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="font-semibold mb-2">Price Breakdown</div>

          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Service</span>
              <span className="font-medium">{SERVICE_LABELS[serviceType]}</span>
            </div>

            <div className="flex justify-between">
              <span>Rate</span>
              <span className="font-medium">${pricing.rate.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Units</span>
              <span className="font-medium">
                {pricing.canCompute ? pricing.units : "—"} {pricing.unitLabel}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Dogs selected</span>
              <span className="font-medium">{pricing.dogsCount}</span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between">
              <span>Per-dog total</span>
              <span className="font-medium">
                {pricing.canCompute ? `$${pricing.perDogTotal.toFixed(2)}` : "—"}
              </span>
            </div>

            <div className="flex justify-between text-base">
              <span className="font-semibold">Estimated total</span>
              <span className="font-semibold">
                {pricing.canCompute ? `$${pricing.total.toFixed(2)}` : "—"}
              </span>
            </div>

            {!pricing.canCompute && (
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