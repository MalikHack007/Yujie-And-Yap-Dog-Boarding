import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();

    // Get authenticated user
    const {
    data: { user },
    error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
    .from("dogs")
    .select("*")
    .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
    const supabase = await createClient();
  
    // auth
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
  
    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 400 });
    }
  
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    // parse multipart form
    const form = await req.formData();
  
    const name = String(form.get("name") ?? "").trim();
    const breed = String(form.get("breed") ?? "").trim();
    const sex = String(form.get("sex") ?? "").trim();
  
    const weightRaw = String(form.get("weight") ?? "").trim();
    const ageRaw = String(form.get("age") ?? "").trim();
  
    const feeding_schedule = String(form.get("feeding_schedule") ?? "");
    const exercise_schedule = String(form.get("exercise_schedule") ?? "");
    const behavior_notes = String(form.get("behavior_notes") ?? "");
    const medication_needs = String(form.get("medication_needs") ?? "");
  
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
  
    const weight = weightRaw ? Number(weightRaw) : null;
    const age = ageRaw ? Number(ageRaw) : null;
  
    if (weightRaw && Number.isNaN(weight)) {
      return NextResponse.json({ error: "Weight must be a number" }, { status: 400 });
    }
    if (ageRaw && Number.isNaN(age)) {
      return NextResponse.json({ error: "Age must be a number" }, { status: 400 });
    }
  
    // 1) create dog row
    const { data: dog, error: insertErr } = await supabase
      .from("dogs")
      .insert([
        {
          user_id: user.id,
          name,
          breed,
          sex,
          weight,
          age,
          feeding_schedule,
          exercise_schedule,
          behavior_notes,
          medication_needs,
        },
      ])
      .select()
      .single();
  
    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 400 });
    }
  
    // 2) optional photo upload + update photo_url
    const photo = form.get("photo");
    
    if (photo && photo instanceof File) {
      const fileExt = (photo.name.split(".").pop() || "jpg").toLowerCase();
      const filePath = `${user.id}/${dog.id}.${fileExt}`;
  
      const { error: uploadErr } = await supabase.storage
        .from("dog-photos")
        .upload(filePath, photo, {
          upsert: true,
          contentType: photo.type || undefined,
        });
  
      if (uploadErr) {
        // you can choose to rollback by deleting dog here; I’d rather return a clear error
        return NextResponse.json(
          { error: "Dog created but photo upload failed: " + uploadErr.message },
          { status: 400 }
        );
      }
  
      const { data: publicUrlData } = supabase.storage
        .from("dog-photos")
        .getPublicUrl(filePath);
  
      const photo_url = publicUrlData.publicUrl;
  
      const { data: updatedDog, error: updateErr } = await supabase
        .from("dogs")
        .update({ photo_url })
        .eq("id", dog.id)
        .eq("user_id", user.id)
        .select()
        .single();
  
      if (updateErr) {
        return NextResponse.json(
          { error: "Dog created but saving photo URL failed: " + updateErr.message },
          { status: 400 }
        );
      }
  
      return NextResponse.json({ dog: updatedDog }, { status: 201 });
    }
  
    return NextResponse.json({ dog }, { status: 201 });
  }