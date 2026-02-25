import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 400 });
  }

  if (!user) {
    return NextResponse.json({ user: null, isAdmin: false });
  }

  const { data: isAdmin, error: adminErr } =
    await supabase.rpc("is_admin");

  if (adminErr) {
    return NextResponse.json({ error: adminErr.message }, { status: 400 });
  }

  return NextResponse.json({
    user,
    isAdmin: Boolean(isAdmin),
  });
}