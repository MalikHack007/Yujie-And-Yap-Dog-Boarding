"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AddDogForm from "../components/AddDogForm";
import EditDogModal from "../components/EditDogModal";
import BookingsList from "../components/booking/BookingsList";

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

export default function DashboardPage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDog, setEditDog] = useState<Dog | null>(null);

  //Function for deleting dogs from database and then fetch the new list of dogs.
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function deleteDog(dogId: string) {
    const confirmed = window.confirm("Delete this dog? This can’t be undone.");
    if (!confirmed) return;
  
    try {
      setDeletingId(dogId);
  
      const { error } = await supabase
        .from("dogs")
        .delete()
        .eq("id", dogId);
  
      if (error) {
        alert("Error deleting dog: " + error.message);
        return;
      }
  
      await fetchDogs();
  
    } finally {
      setDeletingId(null);
    }
  }


  async function fetchDogs() {
    setLoading(true);
  
    try {
      const res = await fetch("/api/dogs");
  
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
  
      const data = await res.json();
      setDogs(data);
    } catch (err: any) {
      alert("Error fetching dogs: " + err.message);
      setDogs([]);
    }
  
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
                    src={`${dog.photo_url}?v=${encodeURIComponent(dog.updated_at)}`}
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

              <div className="flex gap-2">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => setEditDog(dog)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  onClick={() => deleteDog(dog.id)}
                  disabled={deletingId === dog.id}
                >
                  {deletingId === dog.id ? "Deleting..." : "Delete"}
                </button>

              </div>

            </div>
          ))}
        </div>
      )}

      <BookingsList />

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
