import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE (req: NextRequest, {params} : {params:{id:string}}){
    const { id } = await params;

    console.log("Deleting dog with id:", id);

    const supabase = await createClient();

    // 🗑 Delete dog
    const { data, error } = await supabase
        .from("dogs")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)


    if (error) {
        return NextResponse.json(
        { error: error.message },
        { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
}