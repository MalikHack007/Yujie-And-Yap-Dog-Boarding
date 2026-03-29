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

export type Dog = {
  id: string;
  name: string;
  breed: string;
  sex: string;
  weight: number;
  age: number;
  photo_url: string;
  feeding_schedule: string;
  exercise_schedule: string;
  behavior_notes: string;
  medication_needs: string;
  updated_at: string;
  deleted_at: string | null;
}

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
