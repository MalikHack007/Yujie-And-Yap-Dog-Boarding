import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // 1️⃣ Auth check
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

  // 2️⃣ Verify admin (important — do NOT rely on frontend)
  const { data: isAdmin, error: adminError } = await supabase
    .rpc("is_admin");

  if (adminError || !isAdmin) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

//   type BookingRow = {
//     id: string;
//     service_type: ServiceType;
//     start_at: string;
//     end_at: string;
//     status: BookingStatus;
//     dog: DogRef | null;
//   };

  // 3️⃣ Fetch ALL bookings
  const { data, error } = await supabase
    .from("Bookings")
    .select(`
      id,
      service_type,
      start_at,
      end_at,
      status,
      dog:dog_id (
        id,
        name
      )
    `)
    .order("start_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const bookings =
    (data ?? []).map((b) => ({
      id: b.id,
      service_type: b.service_type,
      start_at: b.start_at,
      end_at: b.end_at,
      status: b.status,
      dog: b.dog ?? null,
    }));

  return NextResponse.json({ bookings });
}