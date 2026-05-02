"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

interface Pet {
  _id: string;
  name: string;
  types: string[];
}

export default function PetListPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/pets/get");
      if (res.ok) {
        const data = await res.json();
        setPets(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch pets", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pet category?")) return;

    try {
      const res = await fetch(`/api/pets/delete?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Pet deleted successfully");
        fetchPets();
      } else {
        alert("Failed to delete pet");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Pets Module</CardTitle>
          <Link href="/dashboard/pets/add">
            <Button className="shadow-none text-black text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer">+ Add Pet Category</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Types / Breeds</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      No pets found
                    </TableCell>
                  </TableRow>
                ) : (
                  pets.map((pet) => (
                    <TableRow key={pet._id}>
                      <TableCell className="font-medium">{pet.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {pet.types.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 border rounded text-xs">
                              {t}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/pets/add?edit=${pet._id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleDelete(pet._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
