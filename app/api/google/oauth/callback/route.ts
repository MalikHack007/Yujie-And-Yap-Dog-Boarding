import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import { supabase } from "@/lib/supabase/admin";

// OPTIONAL: replace with your own place to send admins after connect
const SUCCESS_REDIRECT = "/admin/bookings?gcal=connected"; 
const ERROR_REDIRECT = "/admin/bookings?gcal=error";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  // 1) Handle "error=access_denied" etc.
  const error = url.searchParams.get("error");
  if (error) {
    const errDesc = url.searchParams.get("error_description") ?? "";
    return NextResponse.redirect(
      new URL(`${ERROR_REDIRECT}&reason=${encodeURIComponent(error)}&desc=${encodeURIComponent(errDesc)}`, url.origin)
    );
  }

  // 2) Read code + state
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  if (!code || !returnedState) {
    return NextResponse.redirect(new URL(`${ERROR_REDIRECT}&reason=missing_code_or_state`, url.origin));
  }

  // 3) Verify state (CSRF protection)
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("gcal_oauth_state")?.value;

  if (!expectedState || expectedState !== returnedState) {
    return NextResponse.redirect(new URL(`${ERROR_REDIRECT}&reason=invalid_state`, url.origin));
  }

  // 4) Exchange code -> tokens
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI! // must match what you used in start route + Google console
  );

  const { tokens } = await oauth2Client.getToken(code);

  // tokens.access_token: short-lived
  // tokens.refresh_token: long-lived (often only returned on first consent)
  //
  // IMPORTANT: If refresh_token is missing, you may already have it stored from a prior connect.
  // Google often returns refresh_token only the first time unless you force prompt=consent.
  const refreshToken = tokens.refresh_token;

  if (refreshToken) {
    const { error: upsertErr } = await supabase
      .from("google_oauth_tokens")
      .upsert(
        {
          key: "business_calendar",
          refresh_token: refreshToken,
          scope: tokens.scope ?? null,
          token_type: tokens.token_type ?? null,
          expiry_date: tokens.expiry_date ?? null,
        },
        { onConflict: "key" }
      );
  
    if (upsertErr) {
      // Handle/log the error and redirect with failure
      return NextResponse.redirect(
        new URL("/admin/bookings?gcal=error&reason=token_store_failed", url.origin)
      );
    }
  }

  // 6) Clear the state cookie now that it’s used
  const res = NextResponse.redirect(new URL(SUCCESS_REDIRECT, url.origin));
  res.cookies.set("gcal_oauth_state", "", { path: "/", maxAge: 0 });

  return res;
}