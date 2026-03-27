import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ServiceType } from "@/types/booking";

//Create a new booking from client
export async function POST(req: Request) {
  const supabase = await createClient();

  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const service_type = body.service_type as ServiceType;
  const start_at = new Date(body.start_at);
  const end_at = new Date(body.end_at);
  const dog_ids = (body.dog_ids ?? []) as string[];

  if (!service_type || !Array.isArray(dog_ids) || dog_ids.length === 0 || !(end_at > start_at)) {
    return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });
  } //data validation

  const bookingRow = {
    owner_id: userRes.user.id,
    service_type,
    start_at: start_at.toISOString(),
    end_at: end_at.toISOString(),
    status: "pending",
  };

  const { data: booking, error: bookingError } = await supabase
    .from("Bookings")
    .insert(bookingRow)
    .select("id")
    .single();
  if (bookingError || !booking) {
    return NextResponse.json(
      { error: bookingError?.message ?? "Unable to create booking." },
      { status: 400 }
    );
  }

  const bookingDogRows = dog_ids.map((dogId) => ({
    booking_id: booking.id,
    dog_id: dogId,
  }));

  const { error: bookingDogsError } = await supabase
    .from("booking_dogs")
    .insert(bookingDogRows);
  if (bookingDogsError) {
    return NextResponse.json({ error: bookingDogsError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}


//read the bookings of a specific user
export async function GET() {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Fetch bookings for this user
  // Only return the columns the UI needs
  const { data, error } = await supabase
    .from("Bookings")
    .select(`
      id,
      service_type,
      start_at,
      end_at,
      status,
      booking_dogs (
        dogs (
          id,
          name
        )
      )
    `)
    .eq("owner_id", user.id)
    .order("start_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Normalize response shape (important)
  const bookings =
    (data ?? []).map((b) => ({
      id: b.id,
      service_type: b.service_type,
      start_at: b.start_at,
      end_at: b.end_at,
      status: b.status,
      dogs: (b.booking_dogs ?? [] as { dogs: { id: string; name: string } | null }[])
        .map((bd) => bd.dogs)
        .filter(Boolean),
    }));

  return NextResponse.json({ bookings });
}
