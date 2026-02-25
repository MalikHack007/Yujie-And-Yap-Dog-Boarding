import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ServiceType } from "@/types/booking";

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
  }

  const rows = dog_ids.map((dogId) => ({
    dog_id: dogId,
    owner_id: userRes.user.id,
    service_type,
    start_at: start_at.toISOString(),
    end_at: end_at.toISOString(),
    status: "pending",
  }));

  const { error } = await supabase.from("Bookings").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true }, { status: 201 });
}
