"use client";

export function ConnectGoogleCalendarButton() {
  return (
    <button
      onClick={() => {
        window.location.href = "/api/google/oauth/start";
      }}
      className="px-4 py-2 rounded bg-black text-white"
    >
      Connect Google Calendar
    </button>
  );
}