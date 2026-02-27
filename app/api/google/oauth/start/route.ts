import { NextResponse } from "next/server";
import crypto from "crypto";
import { google } from "googleapis";

export async function GET() {
  // 1) Create OAuth client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  // 2) Generate anti-CSRF state
  const state = crypto.randomBytes(32).toString("hex");

  // 3) Generate Google consent URL (write access to events)
  const scopes = ["https://www.googleapis.com/auth/calendar.events.owned"];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // needed to get refresh_token (usually first consent)
    prompt: "consent", // helps ensure refresh_token is issued
    scope: scopes,
    include_granted_scopes: true,
    state,
  });
  
  const res = NextResponse.redirect(authorizationUrl);

  // 4) Store state in an HttpOnly cookie (server-only)
  
  res.cookies.set("gcal_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60, // 10 min
  });

  return res;
}