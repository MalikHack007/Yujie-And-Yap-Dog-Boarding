"use client";

import { useState } from "react";
import { useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleAddDog() {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      alert("You must be logged in to add a dog.");
      return;
    }

    const userId = userData.user.id;

    // Insert dog into Supabase
    const { data, error } = await supabase
      .from("dogs")
      .insert([
        {
          user_id: userId,
          name,
          breed,
          sex,
          weight: Number(weight),
          age: Number(age),
          feeding_schedule: feedingSchedule,
          exercise_schedule: exerciseSchedule,
          behavior_notes: behaviorNotes,
          medication_needs: medicationNeeds,
        },
      ])
      .select()
      .single();

    if (error) {
      alert("Error adding dog: " + error.message);
    } else {
      alert("Dog added successfully!");
      const newDog = data;
      if (imageFile){
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `${userId}/${newDog.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("dog-photos")
          .upload(filePath, imageFile);
        
        if (uploadError) {
          alert("Error uploading image: " + uploadError.message);
        }

        const {data:publicUrlData} = supabase.storage
          .from("dog-photos")
          .getPublicUrl(filePath);
        
        const { error: updateError } = await supabase
          .from("dogs")
          .update({ photo_url: publicUrlData.publicUrl })
          .eq("id", newDog.id);
        
        if (updateError) {
          alert("Error saving image URL: " + updateError.message);
        }

      }

      if (onDogAdded) onDogAdded(); // refresh dashboard list

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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
