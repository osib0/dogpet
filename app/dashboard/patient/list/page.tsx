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
  owner_name: string;
  pet_name: string;
  type: string;
  breed: string;
  color: string;
  sex: string;
  dob: string;
  phone: string;
  is_active: boolean;
  email: string;
  picture: string;
  createdAt: string;
}

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPatients(page);
  }, [page]);

  const handleRefresh = () => {
    setPage(1);
    fetchPatients(1);
  };

  const fetchPatients = async (currentPage = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/patients/get?page=${currentPage}&limit=10`);
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();
      if (data?.error) {
        throw new Error(data.error);
      }

      const sorted = (data.patients ?? []).sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setPatients(sorted);
      setFilteredPatients(sorted);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
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
    const filtered = patients.filter((p: any) => {
      const owner = p.owner_name?.toLowerCase() ?? "";
      const pet = p.pet_name?.toLowerCase() ?? "";
      const breed = p.breed?.toLowerCase() ?? "";
      const type = p.type?.toLowerCase() ?? "";
      const phone = p.phone?.toLowerCase() ?? "";
      const email = p.email?.toLowerCase() ?? "";

      return (
        owner.includes(normalizedTerm) ||
        pet.includes(normalizedTerm) ||
        breed.includes(normalizedTerm) ||
        type.includes(normalizedTerm) ||
        phone.includes(normalizedTerm) ||
        email.includes(normalizedTerm)
      );
    });
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    try {
      const res = await fetch(`/api/patients/delete?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Patient deleted successfully!");
        fetchPatients(page);
      } else {
        alert("Failed to delete patient.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting patient.");
    }
  };

  const handleRowClick = (patient: Patient) => {
    alert(`Selected Patient: ${patient.owner_name} - ${patient.pet_name}\n\nClick "Edit" button in actions to edit this patient.`);
    // Future: router.push(`/patients/edit/${patient._id}`)
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">All Patients List</CardTitle>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by owner, pet or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 h-9 text-sm"
            />
            <Link href="/dashboard/patient/add">
              <Button className="shadow-none text-black text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer">+ New Patient Entry</Button>
            </Link>
            <Button
              variant="outline"
              className="h-9 text-xs"
              onClick={handleRefresh}
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Owner Name</TableHead>
                    <TableHead>Pet Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Sex</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-gray-500">
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
                        <TableCell>{patient.type || "-"}</TableCell>
                        <TableCell>{patient.breed || "-"}</TableCell>
                        <TableCell>{patient.color || "-"}</TableCell>
                        <TableCell>{patient.sex || "-"}</TableCell>
                        <TableCell>{patient.dob || "-"}</TableCell>
                        <TableCell>{patient.phone || "-"}</TableCell>
                        <TableCell>
                          {patient.is_active ? (
                            <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">Y</span>
                          ) : (
                            <span className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded-full">N</span>
                          )}
                        </TableCell>
                        <TableCell>{patient.email || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/dashboard/patient/add?edit=${patient._id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs text-blue-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(patient._id);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>


      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
          if (pageNum > totalPages) return null;
          return (
            <Button
              key={pageNum}
              variant={pageNum === page ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(pageNum)}
              disabled={isLoading}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}