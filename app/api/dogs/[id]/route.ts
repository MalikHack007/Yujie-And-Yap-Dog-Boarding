import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE (req: NextRequest, {params} : {params: Promise<{id:String}>}){
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

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{id:String}> }
  ) {
    const { id } = await params;
  
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Missing dog id" }, { status: 400 });
    }
  
    const supabase = await createClient();
  
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
  
    if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const form = await req.formData();
  
    const name = String(form.get("name") ?? "").trim();
    const breed = String(form.get("breed") ?? "").trim();
    const sex = String(form.get("sex") ?? "").trim();
    const feeding_schedule = String(form.get("feeding_schedule") ?? "");
    const exercise_schedule = String(form.get("exercise_schedule") ?? "");
    const behavior_notes = String(form.get("behavior_notes") ?? "");
    const medication_needs = String(form.get("medication_needs") ?? "");
    const existingPhotoUrl = String(form.get("photo_url") ?? "");
  
    const weightRaw = String(form.get("weight") ?? "").trim();
    const ageRaw = String(form.get("age") ?? "").trim();
  
    const weight = weightRaw ? Number(weightRaw) : null;
    const age = ageRaw ? Number(ageRaw) : null;
  
    if (weightRaw && Number.isNaN(weight)) {
      return NextResponse.json({ error: "Weight must be a number" }, { status: 400 });
    }
    if (ageRaw && Number.isNaN(age)) {
      return NextResponse.json({ error: "Age must be a number" }, { status: 400 });
    }
  
    // Optional photo upload
    let photo_url: string | null = existingPhotoUrl || null;
    const photo = form.get("photo");
  
    if (photo && photo instanceof File) {
      const fileExt = (photo.name.split(".").pop() || "jpg").toLowerCase();
      const filePath = `${user.id}/${id}.${fileExt}`;
  
      const { error: uploadErr } = await supabase.storage
        .from("dog-photos")
        .upload(filePath, photo, {
          upsert: true,
          contentType: photo.type || undefined,
        });
  
      if (uploadErr) {
        return NextResponse.json(
          { error: "Photo upload failed: " + uploadErr.message },
          { status: 400 }
        );
      }
  
      const { data: pub } = supabase.storage.from("dog-photos").getPublicUrl(filePath);
      photo_url = pub?.publicUrl ?? photo_url;
    }
  
    const now = new Date().toISOString();
  
    const { data: updated, error: updateErr } = await supabase
      .from("dogs")
      .update({
        name,
        breed,
        sex,
        weight,
        age,
        photo_url,
        feeding_schedule,
        exercise_schedule,
        behavior_notes,
        medication_needs,
        updated_at: now,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .is("deleted_at", null) // don't allow edits to soft-deleted dogs
      .select()
      .single();
  
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }
  
    return NextResponse.json({ dog: updated }, { status: 200 });
}