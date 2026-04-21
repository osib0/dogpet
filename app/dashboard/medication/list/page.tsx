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

interface Medication {
  _id: string;
  disease: string;
  disease_type: string;
  medicine_name: string;
  description?: string;
  createdAt: string;
}

export default function MedicationList() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/medications");
      if (res.ok) {
        const data = await res.json();
        setMedications(data.data || []);
        setFilteredMedications(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch medications", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = medications.filter(
      (m) =>
        m.disease?.toLowerCase().includes(term) ||
        m.medicine_name?.toLowerCase().includes(term) ||
        m.disease_type?.toLowerCase().includes(term)
    );
    setFilteredMedications(filtered);
  }, [searchTerm, medications]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Medications List</CardTitle>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by disease or medicine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 h-9 text-sm"
            />
            <Link href="/dashboard/medication/add">
              <Button className="h-9 text-xs">+ Add Medication</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-sm">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disease</TableHead>
                  <TableHead>Disease Type</TableHead>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No medications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMedications.map((med) => (
                    <TableRow key={med._id}>
                      <TableCell className="font-medium">{med.disease}</TableCell>
                      <TableCell>{med.disease_type}</TableCell>
                      <TableCell>{med.medicine_name}</TableCell>
                      <TableCell>{med.description || "-"}</TableCell>
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
