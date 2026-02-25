import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const newStatus = body?.status;

  if (newStatus !== "cancelled") {
    return NextResponse.json(
      { error: "Only cancellation is allowed." },
      { status: 400 }
    );
  }

  // Only allow cancel if booking belongs to user
  const { data, error } = await supabase
    .from("Bookings")
    .update({ status: "cancelled" })
    .eq("id", id)
    .eq("owner_id", user.id)
    .in("status", ["pending", "confirmed"]) // prevent cancelling completed
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Unable to cancel booking." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}