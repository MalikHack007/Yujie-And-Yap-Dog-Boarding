import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ServiceType } from "@/types/booking";
import { computeBoardingUnits, computeDaycareUnits } from "@/lib/pricing/units";
import { roundMoney } from "@/lib/pricing/money-utils";



export async function POST(req: Request) {
  const supabase = await createClient();

  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const service_type = body.service_type as ServiceType;
  const start_at = new Date(body.start_at);
  const end_at = new Date(body.end_at);
  const dogs_count = Number(body.dogs_count ?? 0);

  if (!service_type || !(end_at > start_at)) {
    return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });
  }

  // rate lookup: user override first
  const { data: userRate } = await supabase
    .from("service_rates_user")
    .select("rate,currency")
    .eq("user_id", userRes.user.id)
    .eq("service_type", service_type)
    .single();

  const { data: defaultRate } = await supabase
    .from("service_rates_default")
    .select("rate,currency")
    .eq("service_type", service_type)
    .maybeSingle();

  const rate = Number(userRate?.rate ?? defaultRate?.rate ?? 0);
  const currency = String(userRate?.currency ?? defaultRate?.currency ?? "USD");

  if (!rate || rate < 0) {
    return NextResponse.json({ error: "No valid rate configured for this service." }, { status: 400 });
  }

  let units = 1;
  let unitLabel = "unit";

  if (service_type === "boarding") {
    units = computeBoardingUnits(start_at, end_at);
    unitLabel = "nights";
  } else if (service_type === "daycare") {
    units = computeDaycareUnits(start_at, end_at);
    unitLabel = "days";
  } else if (service_type === "drop_in") {
    units = 1;
    unitLabel = "drop-in";
  } else {
    units = 1;
    unitLabel = "walk";
  }

  const perDogTotal = roundMoney(units * rate);
  const total = roundMoney(perDogTotal * Math.max(0, dogs_count));

  return NextResponse.json({
    quote: {
      canCompute: true,
      currency,
      rate,
      units,
      unitLabel,
      perDogTotal,
      dogsCount: Math.max(0, dogs_count),
      total,
    },
  });
}