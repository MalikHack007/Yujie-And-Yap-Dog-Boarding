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

  const { data: isAdmin, error: adminErr } = await supabase.rpc("is_admin");

  if (adminErr) {
    return NextResponse.json({ error: "Admin check failed." }, { status: 500 });
  }

  const body = await req.json();
  const newStatus = body?.status;

  if (newStatus !== "cancelled" && newStatus !== "confirmed") {
    return NextResponse.json(
      { error: "Only 'cancelled' or 'confirmed' is allowed." },
      { status: 400 }
    );
  }

  if (newStatus === "confirmed") {
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("Bookings")
      .update({ status: "confirmed" })
      .eq("id", id)
      .eq("status", "pending") // only allow pending -> confirmed
      .select("id,status")
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { error: "Unable to confirm booking." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, booking: data });
  }

  // Only allow cancel if booking belongs to user
  let query = supabase
    .from("Bookings")
    .update({ status: "cancelled" })
    .eq("id", id)
    .in("status", ["pending", "confirmed"]);

  if (!isAdmin) {
    query = query.eq("owner_id", user.id);
  }

  const { data, error } = await query
    .select("id,status")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "Unable to cancel booking." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}