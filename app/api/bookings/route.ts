import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { startDate, endDate, dropOffTime, pickUpTime } = body;

    // 👇 This prints in your TERMINAL, not the browser console
    console.log("New Booking Request:");
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Drop-off Time:", dropOffTime);
    console.log("Pick-up Time:", pickUpTime);

    return NextResponse.json({
      message: "Booking received successfully",
    });

  } catch (error) {
    console.error("Error processing booking:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
