"use client";

import { useState, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

interface AddDogFormProps {
  onDogAdded?: () => void; // Callback after dog is added
}

export default function AddDogForm({ onDogAdded }: AddDogFormProps) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [feedingSchedule, setFeedingSchedule] = useState("");
  const [exerciseSchedule, setExerciseSchedule] = useState("");
  const [behaviorNotes, setBehaviorNotes] = useState("");
  const [medicationNeeds, setMedicationNeeds] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleAddDog() {
    try {
      // Build multipart form data (supports optional file upload)
      const formData = new FormData();
      formData.append("name", name);
      formData.append("breed", breed);
      formData.append("sex", sex);
      formData.append("weight", weight); // keep as string; server will coerce
      formData.append("age", age);
      formData.append("feeding_schedule", feedingSchedule);
      formData.append("exercise_schedule", exerciseSchedule);
      formData.append("behavior_notes", behaviorNotes);
      formData.append("medication_needs", medicationNeeds);
      if (imageFile) formData.append("photo", imageFile);
  
      const res = await fetch("/api/dogs", {
        method: "POST",
        body: formData,
      });
  
      const payload = await res.json();
  
      if (!res.ok) {
        alert("Error adding dog: " + (payload.error ?? "Unknown error"));
        return;
      }
  
      alert("Dog added successfully!");
  
      if (onDogAdded) onDogAdded();
  
      // Clear form
      setName("");
      setBreed("");
      setSex("");
      setWeight("");
      setAge("");
      setFeedingSchedule("");
      setExerciseSchedule("");
      setBehaviorNotes("");
      setMedicationNeeds("");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e: any) {
      alert("Error adding dog: " + (e?.message ?? String(e)));
    }
  }

  return (
    <div className="flex flex-col gap-3 border p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add a New Dog</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Breed"
        value={breed}
        onChange={(e) => setBreed(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Sex"
        value={sex}
        onChange={(e) => setSex(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Weight (lbs)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Age (years)"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (!e.target.files) return;
          setImageFile(e.target.files[0]);
        }}
      />

      <input
        type="text"
        placeholder="Feeding Schedule"
        value={feedingSchedule}
        onChange={(e) => setFeedingSchedule(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Exercise Schedule"
        value={exerciseSchedule}
        onChange={(e) => setExerciseSchedule(e.target.value)}
        className="border p-2 rounded"
      />

      <textarea
        placeholder="Behavior Notes"
        value={behaviorNotes}
        onChange={(e) => setBehaviorNotes(e.target.value)}
        className="border p-2 rounded"
      />

      <textarea
        placeholder="Medication Needs"
        value={medicationNeeds}
        onChange={(e) => setMedicationNeeds(e.target.value)}
        className="border p-2 rounded"
      />

      <button
        onClick={handleAddDog}
        className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition mt-2"
      >
        Add Dog
      </button>
    </div>
  );
}
