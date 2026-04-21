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
        const dateA = a.visit_date ? new Date(a.visit_date).getTime() : new Date(a.createdAt).getTime();
        const dateB = b.visit_date ? new Date(b.visit_date).getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setPatients(sorted);
      setFilteredPatients(sorted);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
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
    const filtered = patients.filter((p: any) => {
      const owner = p.owner_name?.toLowerCase() ?? "";
      const pet = p.pet_name?.toLowerCase() ?? "";
      const breed = p.breed?.toLowerCase() ?? "";
      const type = p.type?.toLowerCase() ?? "";
      const phone = p.phone?.toLowerCase() ?? "";
      const address = p.address?.toLowerCase() ?? "";
      const email = p.email?.toLowerCase() ?? "";
      const batchNo = p.batch_no?.toLowerCase() ?? "";

      return (
        owner.includes(normalizedTerm) ||
        pet.includes(normalizedTerm) ||
        breed.includes(normalizedTerm) ||
        type.includes(normalizedTerm) ||
        phone.includes(normalizedTerm) ||
        address.includes(normalizedTerm) ||
        email.includes(normalizedTerm) ||
        batchNo.includes(normalizedTerm)
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
              <Button className="h-9 text-xs">+ New Patient Entry</Button>
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
                    <TableCell className="max-w-45 truncate">{patient.next_visit_note || "-"}</TableCell>
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