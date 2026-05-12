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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatientHistory } from "./_components/patient-history";
import { PatientSidebar } from "./_components/patient-sidebar";
import { History } from "lucide-react";

interface Patient {
  _id: string;
  owner_name: string;
  pet_name: string;
  pet_category: string;
  pet_type: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchPatients(page, limit, debouncedSearch);
  }, [page, limit, debouncedSearch]);

  const handleRefresh = () => {
    fetchPatients(page, limit, debouncedSearch);
  };

  const fetchPatients = async (currentPage = 1, currentLimit = 10, search = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/patients/get?page=${currentPage}&limit=${currentLimit}&search=${encodeURIComponent(search)}`);
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();
      if (data?.error) {
        throw new Error(data.error);
      }

      setPatients(data.patients ?? []);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (fetchError) {
      console.error("Failed to fetch patients:", fetchError);
      setError("Failed to load patient list. Please refresh.");
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    try {
      const res = await fetch(`/api/patients/delete?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Patient deleted successfully!");
        fetchPatients(page, limit, debouncedSearch);
      } else {
        alert("Failed to delete patient.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting patient.");
    }
  };

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsSidebarOpen(true);
  };

  const handleOpenHistory = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsHistoryOpen(true);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <Card className="shadow-none border-none bg-transparent">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-0">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">Patients Registry</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Total Patients: <span className="font-bold text-primary">{total}</span></p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Input
                placeholder="Search owner, pet, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 max-w-80 w-64 text-sm shadow-sm border-gray-200 focus:ring-primary focus:border-primary bg-white border shadow-none"
              />
            </div>

            <div className="flex items-center gap-2 border px-2 rounded-md bg-white">
              <span className="text-xs font-medium text-gray-500">Rows per page</span>
              <Select value={limit.toString()} onValueChange={(val) => {
                setLimit(parseInt(val));
                setPage(1);
              }}>
                <SelectTrigger className="border-none shadow-none focus:ring-0 p-0 text-sm font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50, 60, 100, 200].map(val => (
                    <SelectItem key={val} value={val.toString()}>{val}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Link href="/dashboard/patient/add">
              <Button className="shadow-none text-black text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                New Patient
              </Button>
            </Link>

            <Button
              variant="outline"
              className="h-10 text-sm border-gray-200 hover:bg-gray-50"
              onClick={handleRefresh}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLoading ? "animate-spin" : ""}><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="font-semibold text-gray-600">Owner</TableHead>
                    <TableHead className="font-semibold text-gray-600">Pet Name</TableHead>
                    <TableHead className="font-semibold text-gray-600">Category</TableHead>
                    <TableHead className="font-semibold text-gray-600">Type/Breed</TableHead>
                    <TableHead className="font-semibold text-gray-600">Gender</TableHead>
                    <TableHead className="font-semibold text-gray-600">DOB</TableHead>
                    <TableHead className="font-semibold text-gray-600">Contact</TableHead>
                    <TableHead className="font-semibold text-gray-600">Status</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-gray-500 font-medium">Loading patients...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : patients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-64 text-center py-8 text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                          <span className="text-base font-medium text-gray-400">No patients found</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    patients.map((patient) => (
                      <TableRow
                        key={patient._id}
                        className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0"
                        onClick={() => handleRowClick(patient)}
                      >
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{patient.owner_name}</span>
                            <span className="text-xs text-gray-500">{patient.email || "No email"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                              {patient.picture ? (
                                <img src={patient.picture} alt={patient.pet_name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">
                                  {patient.pet_name?.charAt(0)?.toUpperCase()}
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-primary">{patient.pet_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded">
                            {patient.pet_category || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-700">{patient.pet_type || "-"}</span>
                            <span className="text-[10px] text-gray-400 italic">{patient.breed || ""}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs font-medium ${patient.sex === "MALE" ? "text-blue-600" : "text-pink-600"}`}>
                            {patient.sex || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{patient.dob || "-"}</TableCell>
                        <TableCell className="text-sm font-medium text-gray-700">{patient.phone || "-"}</TableCell>
                        <TableCell>
                          {patient.is_active ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              <span className="text-xs font-semibold text-green-700">Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                              <span className="text-xs font-semibold text-red-500">Inactive</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-primary hover:bg-primary/5"
                              title="View History"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenHistory(patient);
                              }}
                            >
                              <History className="h-4 w-4" />
                            </Button>
                            <Link href={`/dashboard/patient/add?edit=${patient._id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(patient._id);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination & Footer Info */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500 font-medium">
                Showing <span className="text-gray-900">{patients.length}</span> of <span className="text-gray-900">{total}</span> patients
              </p>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium border-gray-200 bg-white shadow-xs"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1 || isLoading}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 text-xs font-bold transition-all ${pageNum === page ? "bg-primary text-white border-primary shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                        onClick={() => setPage(pageNum)}
                        disabled={isLoading}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium border-gray-200 bg-white shadow-xs"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <PatientHistory 
        patient={selectedPatient} 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
      <PatientSidebar
        patient={selectedPatient}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}