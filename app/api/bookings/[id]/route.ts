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
