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
  ownerName: string;
  petName: string;
  age: string;
  dateOfVisit: string;
  complaint: string;
  disease: string;
  diseaseType: string;
  medication: string;
  diagnosis: string;
  gender?: string;
  breed?: string;
  mobile?: string;
}

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients/get");
      const data = await res.json();
      const sorted = data.patients.sort((a: any, b: any) =>
        new Date(b.dateOfVisit).getTime() - new Date(a.dateOfVisit).getTime()
      );
      setPatients(sorted);
      setFilteredPatients(sorted);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      alert("Failed to load patient list");
    }
  };

  // Live search
  useEffect(() => {
    const filtered = patients.filter((p) =>
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.complaint?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleRowClick = (patient: Patient) => {
    alert(`Selected Patient: ${patient.ownerName} - ${patient.petName}\n\nClick "Edit" button in actions to edit this patient.`);
    // Future: router.push(`/patients/edit/${patient._id}`)
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">All Patients List</CardTitle>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by owner, pet or complaint..."
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner Name</TableHead>
                <TableHead>Pet Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Date of Visit</TableHead>
                <TableHead>Complaints</TableHead>
                <TableHead>Disease</TableHead>
                <TableHead>Disease Type</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Diagnosis</TableHead>
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
                    <TableCell className="font-medium">{patient.ownerName}</TableCell>
                    <TableCell>{patient.petName}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>
                      {new Date(patient.dateOfVisit).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">{patient.complaint || "-"}</TableCell>
                    <TableCell>{patient.disease || "-"}</TableCell>
                    <TableCell>{patient.diseaseType || "-"}</TableCell>
                    <TableCell>{patient.medication || "-"}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{patient.diagnosis || "-"}</TableCell>
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
        </CardContent>
      </Card>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Click any row to select • Press F1 (in real app) for quick selection • Total: {filteredPatients.length} patients
      </p>
    </div>
  );
}