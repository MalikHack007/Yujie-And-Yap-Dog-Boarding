export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "current",
  "cancelled",
  "declined",
  "completed",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const SERVICE_TYPES = ["boarding", "daycare"] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export type DogRef = {
  id: string;
  name: string;
};

export type BookingRow = {
  id: string;
  service_type: ServiceType;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  dogs: DogRef[];
};

export type BookingQuote = {
  canCompute: boolean;
  currency: string;
  rate: number;
  units: number;
  unitLabel: string;
  perDogTotal: number;
  dogsCount: number;
  total: number;
};
