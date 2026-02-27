import { NextResponse } from "next/server";
import { google } from "googleapis";
import { supabase } from "@/lib/supabase/admin";

export async function GET() {
  try {
    // 1️⃣ Get refresh token from DB
    const { data, error } = await supabase
      .from("google_oauth_tokens")
      .select("refresh_token")
      .eq("key", "business_calendar")
      .single();

    if (error || !data?.refresh_token) {
      return NextResponse.json(
        { error: "No refresh token found" },
        { status: 400 }
      );
    }

    // 2️⃣ Create OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    );

    // 3️⃣ Attach refresh token
    oauth2Client.setCredentials({
      refresh_token: data.refresh_token,
    });

    // 4️⃣ Create calendar client
    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    // 5️⃣ Define today's time range
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    // 6️⃣ Fetch events
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];

    // 7️⃣ Print to console
    console.log("Today's events:");
    events.forEach((event) => {
      console.log(
        `${event.summary} - ${event.start?.dateTime || event.start?.date}`
      );
    });

    return NextResponse.json({ events });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}