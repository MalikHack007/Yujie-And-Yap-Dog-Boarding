"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AddDogForm from "../components/AddDogForm";
import EditDogModal from "../components/EditDogModal";

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

export default function DashboardPage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDog, setEditDog] = useState<Dog | null>(null);

  async function fetchDogs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("dogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error){
      alert("Error fetching dogs: " + error.message);
      setDogs([]);
    }
    else{ setDogs(data || []); }

    setLoading(false);
  }

  useEffect(() => {
    fetchDogs();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) setDogs([]);
      else fetchDogs();
    });

    return () => listener.subscription.unsubscribe();

  }, []);

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Dogs</h1>

      <AddDogForm onDogAdded={fetchDogs} />

      {loading ? (
        <p>Loading...</p>
      ) : dogs.length === 0 ? (
        <p>You haven’t added any dogs yet.</p>
      ) : (
        <div className="grid gap-4 mt-6">
          {dogs.map((dog) => (
            <div key={dog.id} className="border p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-4">
                {/* 🐶 Profile Image */}
                {dog.photo_url ? (
                  <img
                    src={dog.photo_url}
                    alt={dog.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div>
                  <p className="font-bold">{dog.name}</p>
                  <p>Breed: {dog.breed}</p>
                  <p>Age: {dog.age}</p>
                  <p>Weight: {dog.weight} lbs</p>
                </div>
              </div>

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => setEditDog(dog)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {editDog ? (
        <EditDogModal
          dog={editDog}
          onClose={() => setEditDog(null)}
          onDogUpdated={fetchDogs}
        />
      ):""}
    </div>
  );
}
