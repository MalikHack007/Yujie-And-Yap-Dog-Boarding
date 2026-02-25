"use client";

import { useMemo, useRef, useState } from "react";

type Dog = {
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

type EditDogModalProps = {
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

  async function handleUpdate() {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("breed", breed);
      formData.append("sex", sex);
      formData.append("weight", weight);
      formData.append("age", age);
      formData.append("feeding_schedule", feedingSchedule);
      formData.append("exercise_schedule", exerciseSchedule);
      formData.append("behavior_notes", behaviorNotes);
      formData.append("medication_needs", medicationNeeds);
      // include existing photoUrl so server can keep it if no new file
      formData.append("photo_url", photoUrl ?? "");
      if (imageFile) formData.append("photo", imageFile);

      const res = await fetch(`/api/dogs/${dog.id}`, {
        method: "PATCH",
        body: formData,
      });

      const payload = await res.json();

      if (!res.ok) {
        alert(payload?.error ?? "Failed to update dog.");
        return;
      }

      // If server returned updated dog, sync local UI (optional)
      const updatedDog: Dog | undefined = payload?.dog;
      if (updatedDog?.photo_url) setPhotoUrl(updatedDog.photo_url);

      clearSelectedImage();

      if (onDogUpdated) onDogUpdated();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Failed to update dog.");
    } finally {
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
