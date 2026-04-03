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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Patient {
  _id: string;
  pet_id: string;
  owner_name: string;
  phone: string;
  sex: string;
  age: string;
  pet_name: string;
  breed: string;
  vaccine: string;
  visit_date: string;
  next_visit_note: string;
}

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/patients/get");
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();
      if (data?.error) {
        throw new Error(data.error);
      }

      const sorted = (data.patients ?? []).sort((a: any, b: any) => {
        const dateA = a.visit_date ? new Date(a.visit_date).getTime() : new Date(a.createdAt).getTime();
        const dateB = b.visit_date ? new Date(b.visit_date).getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setPatients(sorted);
      setFilteredPatients(sorted);
      console.log("Fetched patients:", sorted);
    } catch (fetchError) {
      console.error("Failed to fetch patients:", fetchError);
      setError("Failed to load patient list. Please refresh.");
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Live search
  useEffect(() => {
    const normalizedTerm = searchTerm.toLowerCase();
    const filtered = patients.filter((p) => {
      const owner = p.owner_name?.toLowerCase() ?? "";
      const pet = p.pet_name?.toLowerCase() ?? "";
      const breed = p.breed?.toLowerCase() ?? "";

      return (
        owner.includes(normalizedTerm) ||
        pet.includes(normalizedTerm) ||
        breed.includes(normalizedTerm)
      );
    });
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleRowClick = (patient: Patient) => {
    alert(`Selected Patient: ${patient.owner_name} - ${patient.pet_name}\n\nClick "Edit" button in actions to edit this patient.`);
    // Future: router.push(`/patients/edit/${patient._id}`)
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">All Patients List</CardTitle>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by owner, pet or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 h-9 text-sm"
            />
            <Link href="/patient-entry">
              <Button className="h-9 text-xs">+ New Patient Entry</Button>
            </Link>
            <Button
              variant="outline"
              className="h-9 text-xs"
              onClick={fetchPatients}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-16 text-center text-sm text-gray-500">Loading patients...</div>
          ) : error ? (
            <div className="py-16 text-center text-sm text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Owner Name</TableHead>
                  <TableHead>Pet Name</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Sex</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Vaccine</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Next Visit Note</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow
                    key={patient._id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(patient)}
                  >
                    <TableCell className="font-medium">{patient.owner_name}</TableCell>
                    <TableCell>{patient.pet_name}</TableCell>
                    <TableCell>{patient.breed || "-"}</TableCell>
                    <TableCell>{patient.age || "-"}</TableCell>
                    <TableCell>{patient.sex || "-"}</TableCell>
                    <TableCell>{patient.phone || "-"}</TableCell>
                    <TableCell>{patient.vaccine || "-"}</TableCell>
                    <TableCell>
                      {patient.visit_date
                        ? new Date(patient.visit_date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">{patient.next_visit_note || "-"}</TableCell>
                    <TableCell>
                      <Link href={`/patient-entry?edit=${patient._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Click any row to select • Press F1 (in real app) for quick selection • Total: {filteredPatients.length} patients
      </p>
    </div>
  );
}