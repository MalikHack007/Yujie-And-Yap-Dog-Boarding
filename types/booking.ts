export const BOOKING_STATUSES = [
    "pending",
    "confirmed",
    "current",
    "cancelled",
    "declined",
    "completed",
  ] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];
//TODO: Get rid of drop-in and walk service types
export const SERVICE_TYPES = [
    "boarding",
    "daycare"
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];
