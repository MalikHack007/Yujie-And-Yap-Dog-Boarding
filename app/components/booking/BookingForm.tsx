"use client";

import { useState } from "react";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    dropOffTime: "",
    pickUpTime: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setMessage("Booking submitted successfully!");
      console.log(result);
    } catch (error) {
      setMessage("Something went wrong.");
      console.error(error);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Book Your Stay</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Date */}
        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Drop-off Time */}
        <div>
          <label className="block mb-1 font-medium">Drop-off Time</label>
          <input
            type="time"
            name="dropOffTime"
            value={formData.dropOffTime}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Pick-up Time */}
        <div>
          <label className="block mb-1 font-medium">Pick-up Time</label>
          <input
            type="time"
            name="pickUpTime"
            value={formData.pickUpTime}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Submit Booking
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-green-600 font-medium">
          {message}
        </p>
      )}
    </div>
  );
}
