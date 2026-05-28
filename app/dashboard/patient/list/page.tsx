"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatientHistory } from "./_components/patient-history";
import {
  History,
  ChevronDown,
  ChevronRight,
  Plus,
  PawPrint,
  Phone,
  Mail,
  User,
  Pencil,
  Trash2,
  RefreshCw,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface EmbeddedPet {
  _id: string;
  pet_name: string;
  pet_category: string;
  pet_type: string;
  breed: string;
  color: string;
  sex: string;
  dob: string;
  picture: string;
  is_active: boolean;
}

interface Owner {
  _id: string;
  owner_name: string;
  phone: string;
  email: string;
  is_active: boolean;
  pets: EmbeddedPet[];
  // legacy flat fields (old records)
  pet_name?: string;
  pet_category?: string;
  pet_type?: string;
  createdAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isLegacyRecord(owner: Owner): boolean {
  return (!owner.pets || owner.pets.length === 0) && !!owner.pet_name;
}

function getLegacyPetAsList(owner: Owner): EmbeddedPet[] {
  if (!isLegacyRecord(owner)) return [];
  return [
    {
      _id: owner._id, // use owner id as fake pet id for legacy
      pet_name: owner.pet_name || "",
      pet_category: owner.pet_category || "",
      pet_type: owner.pet_type || "",
      breed: (owner as any).breed || "",
      color: (owner as any).color || "",
      sex: (owner as any).sex || "",
      dob: (owner as any).dob || "",
      picture: (owner as any).picture || "",
      is_active: owner.is_active,
    },
  ];
}

function getEffectivePets(owner: Owner): EmbeddedPet[] {
  if (owner.pets && owner.pets.length > 0) return owner.pets;
  return getLegacyPetAsList(owner);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PetAvatar({ pet }: { pet: EmbeddedPet }) {
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
      {pet.picture ? (
        <img src={pet.picture} alt={pet.pet_name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">
          {pet.pet_name?.charAt(0)?.toUpperCase() || "?"}
        </div>
      )}
    </div>
  );
}

// ── Expanded Pet Rows ─────────────────────────────────────────────────────────

function ExpandedPetRows({
  owner,
  onOpenHistory,
  onDeletePet,
}: {
  owner: Owner;
  onOpenHistory: (owner: Owner, pet: EmbeddedPet) => void;
  onDeletePet: (ownerId: string, petId: string, petName: string) => void;
}) {
  const pets = getEffectivePets(owner);
  const legacy = isLegacyRecord(owner);

  if (pets.length === 0) {
    return (
      <TableRow className="bg-gray-50/60">
        <TableCell colSpan={6} className="text-center py-4 text-xs text-gray-400 italic">
          No pets registered yet.{" "}
          <Link href={`/dashboard/patient/add?owner_id=${owner._id}`} className="text-primary underline font-semibold">
            Add a pet
          </Link>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {pets.map((pet, idx) => (
        <TableRow
          key={pet._id}
          className="bg-green-50/30 hover:bg-green-50/60 transition-colors border-b border-gray-100"
        >
          {/* indent */}
          <TableCell className="pl-10 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-gray-300 flex-shrink-0" />
              <div className="flex items-center gap-2">
                <PetAvatar pet={pet} />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-primary">{pet.pet_name || "—"}</span>
                  {legacy && (
                    <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide w-fit">
                      legacy
                    </span>
                  )}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded">
              {pet.pet_category || "—"}
            </span>
          </TableCell>
          <TableCell>
            <div className="flex flex-col">
              <span className="text-xs text-gray-700">{pet.pet_type || "—"}</span>
              {pet.breed && <span className="text-[10px] text-gray-400 italic">{pet.breed}</span>}
            </div>
          </TableCell>
          <TableCell>
            <span className={`text-xs font-semibold ${pet.sex === "MALE" ? "text-blue-600" : "text-pink-600"}`}>
              {pet.sex || "—"}
            </span>
          </TableCell>
          <TableCell className="text-xs text-gray-500">{pet.dob || "—"}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-1">
              {/* History */}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-gray-400 hover:text-primary hover:bg-primary/5"
                title="View History"
                onClick={() => onOpenHistory(owner, pet)}
              >
                <History className="h-3.5 w-3.5" />
              </Button>
              {/* Edit pet */}
              {!legacy && (
                <Link href={`/dashboard/patient/add?edit=${owner._id}&pet_id=${pet._id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    title="Edit Pet"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
              {legacy && (
                <Link href={`/dashboard/patient/add?edit=${owner._id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    title="Edit (Legacy)"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
              {/* Delete pet — only for new-format pets */}
              {!legacy && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete Pet"
                  onClick={() => onDeletePet(owner._id, pet._id, pet.pet_name)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>
      ))}
      {/* Add pet row — only for new format owners */}
      {!legacy && (
        <TableRow className="bg-gray-50/30 border-b border-gray-100">
          <TableCell colSpan={6} className="py-2 pl-10">
            <Link href={`/dashboard/patient/add?owner_id=${owner._id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-green-700 hover:text-green-800 hover:bg-green-50 gap-1.5 font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Another Pet
              </Button>
            </Link>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PatientList() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // expanded rows — set of owner _ids
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // history dialog
  const [historyOwner, setHistoryOwner] = useState<Owner | null>(null);
  const [historyPet, setHistoryPet] = useState<EmbeddedPet | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // ── Debounce ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(h);
  }, [searchTerm]);

  useEffect(() => {
    fetchOwners(page, limit, debouncedSearch);
  }, [page, limit, debouncedSearch]);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchOwners = useCallback(async (currentPage = 1, currentLimit = 10, search = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/patients/get?page=${currentPage}&limit=${currentLimit}&search=${encodeURIComponent(search)}`
      );
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      if (data?.error) throw new Error(data.error);
      setOwners(data.patients ?? []);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      setError("Failed to load patient list. Please refresh.");
      setOwners([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = () => fetchOwners(page, limit, debouncedSearch);

  // ── Toggle expand ─────────────────────────────────────────────────────────
  const toggleExpand = (ownerId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(ownerId)) next.delete(ownerId);
      else next.add(ownerId);
      return next;
    });
  };

  // ── Delete owner ──────────────────────────────────────────────────────────
  const handleDeleteOwner = async (id: string, name: string) => {
    if (!confirm(`Delete owner "${name}" and ALL their pets + history? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/patients/delete?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchOwners(page, limit, debouncedSearch);
      else alert("Failed to delete owner.");
    } catch {
      alert("Error deleting owner.");
    }
  };

  // ── Delete specific pet ───────────────────────────────────────────────────
  const handleDeletePet = async (ownerId: string, petId: string, petName: string) => {
    if (!confirm(`Delete pet "${petName}"? Their medical history will also be deleted.`)) return;
    try {
      const res = await fetch(`/api/patients/delete?id=${ownerId}&pet_id=${petId}`, {
        method: "DELETE",
      });
      if (res.ok) fetchOwners(page, limit, debouncedSearch);
      else alert("Failed to delete pet.");
    } catch {
      alert("Error deleting pet.");
    }
  };

  // ── History ───────────────────────────────────────────────────────────────
  const handleOpenHistory = (owner: Owner, pet: EmbeddedPet) => {
    setHistoryOwner(owner);
    setHistoryPet(pet);
    setIsHistoryOpen(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <Card className="shadow-none border-none bg-transparent">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-0">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">Patients Registry</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Total Owners:{" "}
              <span className="font-bold text-primary">{total}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search owner, pet, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 max-w-80 w-64 text-sm shadow-sm border-gray-200 bg-white border shadow-none"
            />

            <div className="flex items-center gap-2 border px-2 rounded-md bg-white">
              <span className="text-xs font-medium text-gray-500">Rows</span>
              <Select
                value={limit.toString()}
                onValueChange={(val) => {
                  setLimit(parseInt(val));
                  setPage(1);
                }}
              >
                <SelectTrigger className="border-none shadow-none focus:ring-0 p-0 text-sm font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50, 100].map((val) => (
                    <SelectItem key={val} value={val.toString()}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Link href="/dashboard/patient/add">
              <Button className="shadow-none text-black text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer gap-1.5">
                <Plus className="h-4 w-4" />
                New Patient
              </Button>
            </Link>

            <Button
              variant="outline"
              className="h-9 text-sm border-gray-200 hover:bg-gray-50"
              onClick={handleRefresh}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>

        {/* ── Table ───────────────────────────────────────────────────────── */}
        <CardContent className="px-0">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="font-semibold text-gray-600 w-[240px]">
                      Owner / Pet
                    </TableHead>
                    <TableHead className="font-semibold text-gray-600">Category</TableHead>
                    <TableHead className="font-semibold text-gray-600">Type / Breed</TableHead>
                    <TableHead className="font-semibold text-gray-600">Gender</TableHead>
                    <TableHead className="font-semibold text-gray-600">DOB</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-gray-500 font-medium">
                            Loading patients...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : owners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center py-8 text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <PawPrint className="h-12 w-12 text-gray-200" />
                          <span className="text-base font-medium text-gray-400">
                            No patients found
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    owners.map((owner) => {
                      const isExpanded = expandedRows.has(owner._id);
                      const pets = getEffectivePets(owner);
                      const petCount = pets.length;

                      return (
                        <>
                          {/* ── Owner Row ──────────────────────────────── */}
                          <TableRow
                            key={owner._id}
                            className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 cursor-pointer"
                            onClick={() => toggleExpand(owner._id)}
                          >
                            {/* Owner info cell */}
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`transition-transform duration-200 text-gray-400 ${
                                    isExpanded ? "rotate-90" : ""
                                  }`}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </div>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/10">
                                  <User className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-gray-900">{owner.owner_name}</span>
                                  <div className="flex items-center gap-3 mt-0.5">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                      <Phone className="h-2.5 w-2.5" />
                                      {owner.phone || "—"}
                                    </span>
                                    {owner.email && (
                                      <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Mail className="h-2.5 w-2.5" />
                                        {owner.email}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            {/* Pets badge */}
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <PawPrint className="h-3.5 w-3.5 text-gray-400" />
                                <Badge
                                  variant="secondary"
                                  className="bg-primary/10 text-primary border-none text-xs font-bold"
                                >
                                  {petCount} pet{petCount !== 1 ? "s" : ""}
                                </Badge>
                              </div>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              {owner.is_active ? (
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                  <span className="text-xs font-semibold text-green-700">Active</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                  <span className="text-xs font-semibold text-red-500">Inactive</span>
                                </div>
                              )}
                            </TableCell>

                            <TableCell />
                            <TableCell />

                            {/* Owner actions */}
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                <Link href={`/dashboard/patient/add?edit=${owner._id}`}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                    title="Edit Owner"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                  title="Delete Owner"
                                  onClick={() => handleDeleteOwner(owner._id, owner.owner_name)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>

                          {/* ── Expanded pet rows ───────────────────────── */}
                          {isExpanded && (
                            <ExpandedPetRows
                              owner={owner}
                              onOpenHistory={handleOpenHistory}
                              onDeletePet={handleDeletePet}
                            />
                          )}
                        </>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500 font-medium">
                Showing <span className="text-gray-900">{owners.length}</span> of{" "}
                <span className="text-gray-900">{total}</span> owners
              </p>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium border-gray-200 bg-white"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1 || isLoading}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 text-xs font-bold ${
                          pageNum === page
                            ? "bg-primary text-white border-primary"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
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
                  className="h-8 px-3 text-xs font-medium border-gray-200 bg-white"
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

      {/* History Dialog */}
      {historyOwner && historyPet && (
        <PatientHistory
          owner={historyOwner}
          pet={historyPet}
          isOpen={isHistoryOpen}
          onClose={() => {
            setIsHistoryOpen(false);
            setHistoryPet(null);
            setHistoryOwner(null);
          }}
        />
      )}
    </div>
  );
}