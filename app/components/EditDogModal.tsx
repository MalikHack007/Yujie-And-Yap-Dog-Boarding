"use client";

import { useState } from "react";
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

  async function handleUpdate() {
    const { error } = await supabase
      .from("dogs")
      .update({
        name, breed, sex,
        weight: Number(weight),
        age: Number(age),
        photo_url: photoUrl,
        feeding_schedule: feedingSchedule,
        exercise_schedule: exerciseSchedule,
        behavior_notes: behaviorNotes,
        medication_needs: medicationNeeds,
      })
      .eq("id", dog.id);

    if (error) alert(error.message);
    else {
      alert("Dog updated!");
      if (onDogUpdated) onDogUpdated();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full flex flex-col gap-2">
        <h2 className="text-xl font-bold">Edit {dog.name}</h2>

        <input value={name} onChange={(e) => setName(e.target.value)} className="border p-2" placeholder="Name"/>
        <input value={breed} onChange={(e) => setBreed(e.target.value)} className="border p-2" placeholder="Breed"/>
        <input value={sex} onChange={(e) => setSex(e.target.value)} className="border p-2" placeholder="Sex"/>
        <input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" className="border p-2" placeholder="Weight"/>
        <input value={age} onChange={(e) => setAge(e.target.value)} type="number" className="border p-2" placeholder="Age"/>
        <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="border p-2" placeholder="Photo URL"/>
        <input value={feedingSchedule} onChange={(e) => setFeedingSchedule(e.target.value)} className="border p-2" placeholder="Feeding Schedule"/>
        <input value={exerciseSchedule} onChange={(e) => setExerciseSchedule(e.target.value)} className="border p-2" placeholder="Exercise Schedule"/>
        <textarea value={behaviorNotes} onChange={(e) => setBehaviorNotes(e.target.value)} className="border p-2" placeholder="Behavior Notes"/>
        <textarea value={medicationNeeds} onChange={(e) => setMedicationNeeds(e.target.value)} className="border p-2" placeholder="Medication Needs"/>

        <div className="flex gap-2 mt-4">
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save</button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">Cancel</button>
        </div>
      </div>
    </div>
  );
}
