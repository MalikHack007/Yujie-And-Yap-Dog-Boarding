//This is the API route that handles read/write on specific bookings

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient(); //create a supabase client on server side

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();  //verify user

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: isAdmin, error: adminErr } = await supabase.rpc("is_admin"); //check admin status using remote procedural call on supabase

  if (adminErr) {
    return NextResponse.json({ error: "Admin check failed." }, { status: 500 });
  }

  const body = await req.json();
  const newStatus = body?.status;
  const startAt = body?.start_at ? new Date(body.start_at) : null;
  const endAt = body?.end_at ? new Date(body.end_at) : null;
  const dogIds = Array.isArray(body?.dog_ids) ? (body.dog_ids as string[]) : null;

  // Booking modification flow (dates + dogs)
  if (!newStatus) {
    if (!startAt || !endAt || !(endAt > startAt) || !dogIds || dogIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid booking modification inputs." },
        { status: 400 }
      );
    }

    const { data: existingBooking, error: bookingErr } = await supabase
      .from("Bookings")
      .select("id,status,owner_id")
      .eq("id", id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (bookingErr || !existingBooking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (existingBooking.status === "completed" || existingBooking.status === "cancelled") {
      return NextResponse.json(
        { error: "Completed or cancelled bookings cannot be modified." },
        { status: 400 }
      );
    }

    const { error: updateErr } = await supabase
      .from("Bookings")
      .update({
        start_at: startAt.toISOString(),
        end_at: endAt.toISOString(),
      })
      .eq("id", id)
      .eq("owner_id", user.id);

    if (updateErr) {
      return NextResponse.json({ error: "Unable to update booking dates." }, { status: 400 });
    }

    const { error: deleteErr } = await supabase
      .from("booking_dogs")
      .delete()
      .eq("booking_id", id);
    if (deleteErr) {
      return NextResponse.json({ error: "Unable to update booking dogs." }, { status: 400 });
    }

    const bookingDogRows = dogIds.map((dogId) => ({
      booking_id: id,
      dog_id: dogId,
    }));
    const { error: insertErr } = await supabase.from("booking_dogs").insert(bookingDogRows);
    if (insertErr) {
      return NextResponse.json({ error: "Unable to update booking dogs." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  }

  if (newStatus !== "cancelled" && newStatus !== "confirmed") {
    return NextResponse.json(
      { error: "Only 'cancelled' or 'confirmed' is allowed." },
      { status: 400 }
    );
  } // Only allow cancelled or confirmed status updates from user.

  if (newStatus === "confirmed") {
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } //only admin can confirm a booking

    const { data, error } = await supabase
      .from("Bookings")
      .update({ status: "confirmed" })
      .eq("id", id)
      .eq("status", "pending") // only allow pending -> confirmed
      .select("id,status")
      .maybeSingle();
    /* 
    response: {
      success: True/False
      booking:{id:{id}, status:{new_status}}        
    }
    */

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
    .from("Bookings")    //targets the "Bookings" table
    .update({ status: "cancelled" })    //update rows and set the status column to cancelled
    .eq("id", id)    //Filter: Only update rows where id === id
    .in("status", ["pending", "confirmed"]);  //Filter: Only update rows where status is either "pending" or "confirmed"

  if (!isAdmin) {
    query = query.eq("owner_id", user.id); //if user is not an admin, filter for bookings that belong to the user only.
  }

  const { data, error } = await query
    .select("id,status")
    .maybeSingle(); //updating the booking status to cancelled

  if (error || !data) {
    return NextResponse.json(
      { error: "Unable to cancel booking." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
