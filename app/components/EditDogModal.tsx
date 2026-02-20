"use client";

import { useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Dog {
  id: string;
  name: string;
  breed: string;
  sex: string;
  weight: number;
  age: number;
  photo_url: string;
  feeding_schedule: string;
  exercise_schedule: string;
  behavior_notes: string;
  medication_needs: string;
  updated_at: string;
}

interface EditDogModalProps {
  dog: Dog;
  onClose: () => void;
  onDogUpdated?: () => void;
}

export default function EditDogModal({ dog, onClose, onDogUpdated }: EditDogModalProps) {
  const [name, setName] = useState(dog.name);
  const [breed, setBreed] = useState(dog.breed);
  const [sex, setSex] = useState(dog.sex);
  const [weight, setWeight] = useState(String(dog.weight));
  const [age, setAge] = useState(String(dog.age));
  const [photoUrl, setPhotoUrl] = useState(dog.photo_url);
  const [feedingSchedule, setFeedingSchedule] = useState(dog.feeding_schedule);
  const [exerciseSchedule, setExerciseSchedule] = useState(dog.exercise_schedule);
  const [behaviorNotes, setBehaviorNotes] = useState(dog.behavior_notes);
  const [medicationNeeds, setMedicationNeeds] = useState(dog.medication_needs);


  // New image state (for replace)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preview URL for the newly selected file
  const previewUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  function clearSelectedImage() {
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadReplacementPhotoIfNeeded(): Promise<string | null> {
    if (!imageFile) return null;

    // Get signed-in user (needed for folder path userId/dogId.ext)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("You must be logged in to upload a photo.");

    const fileExt =
      imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `${user.id}/${dog.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("dog-photos")
      .upload(filePath, imageFile, { upsert: true });

    if (uploadError) throw uploadError;

    // Bucket is public → public URL works
    const { data: pub } = supabase.storage
      .from("dog-photos")
      .getPublicUrl(filePath);

    if (!pub?.publicUrl) {
      throw new Error("Could not generate public URL for uploaded image.");
    }

    return pub.publicUrl;
  }

  async function handleUpdate() {
    setSaving(true);
    const now = new Date().toISOString();

    try{
      // 1) Upload new image (if selected) and get new URL
      const newPhotoUrl = await uploadReplacementPhotoIfNeeded();

      const { error } = await supabase
        .from("dogs")
        .update({
          name, breed, sex,
          weight: Number(weight),
          age: Number(age),
          photo_url: newPhotoUrl ?? photoUrl,
          feeding_schedule: feedingSchedule,
          exercise_schedule: exerciseSchedule,
          behavior_notes: behaviorNotes,
          medication_needs: medicationNeeds,
          updated_at: now,
        })
        .eq("id", dog.id);

      if (error){alert(error.message)}
      // 3) Update local state so UI is consistent if modal remains open briefly
      if (newPhotoUrl) {
        setPhotoUrl(newPhotoUrl);
        clearSelectedImage();
      }
      if (onDogUpdated) onDogUpdated();
      onClose();
    } catch (err: any){
      console.error(err);
      alert(err?.message ?? "Failed to update dog.");
    } finally{
      setSaving(false);
    }

  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full flex flex-col gap-2">
        <h2 className="text-xl font-bold">Edit {dog.name}</h2>
        {/* Photo section */}
        <div className="flex items-center gap-4 py-2">
          <img
            src={previewUrl || `${photoUrl}?v=${dog.updated_at}` || ""}
            alt={`${name} photo`}
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Replace profile picture</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImageFile(file);
              }}
            />
            {imageFile && (
              <button
                type="button"
                onClick={clearSelectedImage}
                className="text-sm text-red-600 hover:underline w-fit"
              >
                Remove selected image
              </button>
            )}
          </div>
        </div>

        <input value={name} onChange={(e) => setName(e.target.value)} className="border p-2" placeholder="Name"/>
        <input value={breed} onChange={(e) => setBreed(e.target.value)} className="border p-2" placeholder="Breed"/>
        <input value={sex} onChange={(e) => setSex(e.target.value)} className="border p-2" placeholder="Sex"/>
        <input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" className="border p-2" placeholder="Weight"/>
        <input value={age} onChange={(e) => setAge(e.target.value)} type="number" className="border p-2" placeholder="Age"/>
        <input value={feedingSchedule} onChange={(e) => setFeedingSchedule(e.target.value)} className="border p-2" placeholder="Feeding Schedule"/>
        <input value={exerciseSchedule} onChange={(e) => setExerciseSchedule(e.target.value)} className="border p-2" placeholder="Exercise Schedule"/>
        <textarea value={behaviorNotes} onChange={(e) => setBehaviorNotes(e.target.value)} className="border p-2" placeholder="Behavior Notes"/>
        <textarea value={medicationNeeds} onChange={(e) => setMedicationNeeds(e.target.value)} className="border p-2" placeholder="Medication Needs"/>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="bg-blue-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="bg-gray-400 disabled:opacity-60 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
