"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  // legacy flat fields
  pet_name?: string;
  pet_category?: string;
  pet_type?: string;
  breed?: string;
  color?: string;
  sex?: string;
  dob?: string;
  picture?: string;
  createdAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isLegacyRecord(owner: Owner): boolean {
  return (!owner.pets || owner.pets.length === 0) && !!owner.pet_name;
}

function getLegacyPetAsList(owner: Owner): (EmbeddedPet & { isLegacy?: boolean })[] {
  if (!owner.pet_name) return [];
  return [
    {
      _id: owner._id,
      pet_name: owner.pet_name || "",
      pet_category: owner.pet_category || "",
      pet_type: owner.pet_type || "",
      breed: (owner as any).breed || "",
      color: (owner as any).color || "",
      sex: (owner as any).sex || "",
      dob: (owner as any).dob || "",
      picture: (owner as any).picture || "",
      is_active: owner.is_active,
      isLegacy: true,
    },
  ];
}

function getEffectivePets(owner: Owner): (EmbeddedPet & { isLegacy?: boolean })[] {
  const allPets = [];
  if (owner.pet_name) {
    allPets.push(...getLegacyPetAsList(owner));
  }
  if (owner.pets && owner.pets.length > 0) {
    allPets.push(...owner.pets);
  }
  return allPets;
}

// ── Pet Avatar ────────────────────────────────────────────────────────────────

function PetAvatar({ pet }: { pet: EmbeddedPet }) {
  return (
    <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
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

// ── Column styles (animated show/hide) ───────────────────────────────────────

function getAnimatedColStyle(visible: boolean, width = "100px") {
  return {
    width: visible ? width : "0",
    overflow: "hidden" as const,
    whiteSpace: "nowrap" as const,
    padding: visible ? "0 10px" : "0",
    opacity: visible ? 1 : 0,
    transition: "width 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, padding 0.3s ease",
    borderRight: "none",
    flexShrink: 0,
  };
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PatientList() {
  const router = useRouter();

  const [owners, setOwners] = useState<Owner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // which owner rows are expanded
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // history dialog
  const [historyOwner, setHistoryOwner] = useState<Owner | null>(null);
  const [historyPet, setHistoryPet] = useState<EmbeddedPet | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const hasAnyExpanded = expandedRows.size > 0;

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
  const fetchOwners = useCallback(async (p = 1, l = 10, s = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/patients/get?page=${p}&limit=${l}&search=${encodeURIComponent(s)}`
      );
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      if (data?.error) throw new Error(data.error);
      setOwners(data.patients ?? []);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (err) {
      setError("Failed to load. Please refresh.");
      setOwners([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = () => fetchOwners(page, limit, debouncedSearch);

  // ── Toggle expand ─────────────────────────────────────────────────────────
  const toggleExpand = (ownerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(ownerId) ? next.delete(ownerId) : next.add(ownerId);
      return next;
    });
  };

  // ── Navigate ──────────────────────────────────────────────────────────────
  const goToProfile = (ownerId: string, petId?: string) => {
    const url = petId
      ? `/dashboard/patient/profile/${ownerId}?pet_id=${petId}`
      : `/dashboard/patient/profile/${ownerId}`;
    router.push(url);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteOwner = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (!confirm(`Delete owner "${name}" and ALL their pets + history?`)) return;
    const res = await fetch(`/api/patients/delete?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchOwners(page, limit, debouncedSearch);
    else alert("Failed to delete.");
  };

  const handleDeletePet = async (e: React.MouseEvent, ownerId: string, petId: string, petName: string) => {
    e.stopPropagation();
    if (!confirm(`Delete pet "${petName}" and their medical history?`)) return;
    const res = await fetch(`/api/patients/delete?id=${ownerId}&pet_id=${petId}`, { method: "DELETE" });
    if (res.ok) fetchOwners(page, limit, debouncedSearch);
    else alert("Failed to delete.");
  };

  const handleOpenHistory = (e: React.MouseEvent, owner: Owner, pet: EmbeddedPet) => {
    e.stopPropagation();
    setHistoryOwner(owner);
    setHistoryPet(pet);
    setIsHistoryOpen(true);
  };

  // ── Animated col styles ───────────────────────────────────────────────────
  const genderStyle = getAnimatedColStyle(hasAnyExpanded, "90px");
  const dobStyle = getAnimatedColStyle(hasAnyExpanded, "110px");

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <Card className="shadow-none border-none bg-transparent">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-0">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">Patients Registry</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Total Owners: <span className="font-bold text-primary">{total}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search owner, pet, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 w-64 text-sm bg-white border border-gray-200 shadow-none"
            />

            <div className="flex items-center gap-2 border px-2 rounded-md bg-white">
              <span className="text-xs font-medium text-gray-500">Rows</span>
              <Select value={limit.toString()} onValueChange={(v) => { setLimit(parseInt(v)); setPage(1); }}>
                <SelectTrigger className="border-none shadow-none focus:ring-0 p-0 text-sm font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50, 100].map((v) => (
                    <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Link href="/dashboard/patient/add">
              <Button className="shadow-none text-black text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] gap-1.5">
                <Plus className="h-4 w-4" /> New Patient
              </Button>
            </Link>

            <Button variant="outline" className="h-9 border-gray-200 hover:bg-gray-50" onClick={handleRefresh}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>

        {/* ── Table ─────────────────────────────────────────────────────────── */}
        <CardContent className="px-0">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{error}</div>
          )}

          <div
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            style={{ transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)" }}
          >
            {/* ── Custom table using divs for smooth column transitions ────── */}
            <div className="overflow-x-auto">

              {/* Header */}
              <div className="flex items-center bg-gray-50/70 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none"
                style={{ transition: "all 0.35s ease" }}>
                {/* Chevron spacer */}
                <div style={{ width: 36, flexShrink: 0 }} />
                {/* Owner */}
                <div style={{ width: 210, padding: "9px 10px", flexShrink: 0 }}>Owner / Pet</div>
                {/* Category */}
                <div style={{ width: 110, padding: "9px 10px", flexShrink: 0 }}>Category</div>
                {/* Status */}
                <div style={{ width: 120, padding: "9px 10px", flexShrink: 0 }}>Status</div>
                {/* Gender — animated */}
                <div style={{ ...genderStyle, display: "flex", alignItems: "center", height: 36 }}>Gender</div>
                {/* DOB — animated */}
                <div style={{ ...dobStyle, display: "flex", alignItems: "center", height: 36 }}>DOB</div>
                {/* Actions */}
                <div style={{ width: 116, padding: "9px 10px", flexShrink: 0, textAlign: "right" }}>Actions</div>
              </div>

              {/* Rows */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-500 font-medium">Loading patients...</span>
                </div>
              ) : owners.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <PawPrint className="h-12 w-12 text-gray-200" />
                  <span className="text-base font-medium text-gray-400">No patients found</span>
                </div>
              ) : (
                owners.map((owner) => {
                  const isExpanded = expandedRows.has(owner._id);
                  const pets = getEffectivePets(owner);
                  const petCount = pets.length;

                  return (
                    <div key={owner._id}>

                      {/* ── Owner Row ──────────────────────────────────────── */}
                      <div
                        className="flex items-center border-b border-gray-50 hover:bg-gray-50/60 cursor-pointer group"
                        style={{ transition: "background 0.15s ease" }}
                        onClick={() => goToProfile(owner._id)}
                      >
                        {/* Arrow toggle */}
                        <div
                          style={{ width: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0" }}
                          onClick={(e) => toggleExpand(owner._id, e)}
                        >
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                            style={{
                              transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                              transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                            }}
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Owner info */}
                        <div style={{ width: 210, padding: "12px 10px", flexShrink: 0 }}>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/10">
                              <User className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 text-sm leading-tight truncate">{owner.owner_name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                  <Phone className="h-2.5 w-2.5" />{owner.phone || "—"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Pets count */}
                        <div style={{ width: 110, padding: "12px 10px", flexShrink: 0 }}>
                          <div className="flex items-center gap-1">
                            <PawPrint className="h-3 w-3 text-gray-400" />
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold px-1.5 py-0">
                              {petCount} pet{petCount !== 1 ? "s" : ""}
                            </Badge>
                          </div>
                        </div>

                        {/* Status */}
                        <div style={{ width: 120, padding: "12px 10px", flexShrink: 0 }}>
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
                        </div>

                        {/* Gender spacer (animated) */}
                        <div style={genderStyle} />
                        {/* DOB spacer (animated) */}
                        <div style={dobStyle} />

                        {/* Actions */}
                        <div
                          style={{ width: 116, padding: "12px 10px", flexShrink: 0, display: "flex", justifyContent: "flex-end", gap: 2 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link href={`/dashboard/patient/add?owner_id=${owner._id}`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-green-600 hover:bg-green-50" title="Add Pet">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/patient/add?edit=${owner._id}`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50" title="Edit Owner">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost" size="sm"
                            className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete Owner"
                            onClick={(e) => handleDeleteOwner(e, owner._id, owner.owner_name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* ── Expanded Pet Rows (animated max-height) ─────────── */}
                      <div
                        style={{
                          maxHeight: isExpanded ? `${pets.length * 56 + 50}px` : "0px",
                          overflow: "hidden",
                          transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1)",
                        }}
                      >
                        <div className="bg-gray-50/40 border-b border-gray-100">
                          {pets.map((pet) => {
                            const isLegacyPet = (pet as any).isLegacy;
                            return (
                            <div
                              key={pet._id + (isLegacyPet ? "-legacy" : "")}
                              className="flex items-center border-b border-gray-100/80 last:border-b-0 hover:bg-green-50/40 cursor-pointer group/pet"
                              style={{ transition: "background 0.15s ease" }}
                              onClick={() => goToProfile(owner._id, pet._id)}
                            >
                              {/* Indent */}
                              <div style={{ width: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div className="w-1.5 h-1.5 rounded-full border border-gray-300" />
                              </div>

                              {/* Pet name */}
                              <div style={{ width: 210, padding: "8px 10px", flexShrink: 0 }}>
                                <div className="flex items-center gap-1.5">
                                  <PetAvatar pet={pet} />
                                  <div>
                                    <span className="font-semibold text-xs text-primary group-hover/pet:underline">{pet.pet_name || "—"}</span>
                                    {isLegacyPet && (
                                      <span className="ml-1.5 text-[9px] text-amber-600 bg-amber-50 px-1 py-0.5 rounded font-bold uppercase">legacy</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Category */}
                              <div style={{ width: 110, padding: "8px 10px", flexShrink: 0 }}>
                                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded">
                                  {pet.pet_category || "—"}
                                </span>
                              </div>

                              {/* Type/Breed */}
                              <div style={{ width: 120, padding: "8px 10px", flexShrink: 0 }}>
                                <span className="text-xs text-gray-700">{pet.pet_type || "—"}</span>
                                {pet.breed && <span className="block text-[10px] text-gray-400 italic">{pet.breed}</span>}
                              </div>

                              {/* Gender — animated */}
                              <div style={{ ...genderStyle, fontSize: 12, fontWeight: 600 }}
                                className={pet.sex === "MALE" ? "text-blue-600" : "text-pink-600"}>
                                {pet.sex || "—"}
                              </div>

                              {/* DOB — animated */}
                              <div style={{ ...dobStyle, fontSize: 12, color: "#6b7280" }}>
                                {pet.dob || "—"}
                              </div>

                              {/* Pet actions */}
                              <div
                                style={{ width: 116, padding: "8px 10px", flexShrink: 0, display: "flex", justifyContent: "flex-end", gap: 2 }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost" size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-primary hover:bg-primary/5"
                                  title="View History"
                                  onClick={(e) => handleOpenHistory(e, owner, pet)}
                                >
                                  <History className="h-3 w-3" />
                                </Button>
                                {!isLegacyPet && (
                                  <Link href={`/dashboard/patient/add?edit=${owner._id}&pet_id=${pet._id}`}>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50" title="Edit Pet">
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                  </Link>
                                )}
                                {!isLegacyPet && (
                                  <Button
                                    variant="ghost" size="sm"
                                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                    title="Delete Pet"
                                    onClick={(e) => handleDeletePet(e, owner._id, pet._id, pet.pet_name)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          )})}

                          {/* Add another pet */}
                          <div className="flex items-center" style={{ padding: "5px 36px" }}>
                            <Link href={`/dashboard/patient/add?owner_id=${owner._id}`}>
                              <Button variant="ghost" size="sm" className="h-6 text-[11px] text-green-700 hover:bg-green-50 gap-1 font-semibold">
                                <Plus className="h-3 w-3" /> Add Another Pet
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

            {/* ── Pagination ─────────────────────────────────────────────── */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500 font-medium">
                Showing <span className="text-gray-900">{owners.length}</span> of{" "}
                <span className="text-gray-900">{total}</span> owners
              </p>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline" size="sm"
                  className="h-8 px-3 text-xs font-medium border-gray-200 bg-white"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1 || isLoading}
                >Previous</Button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pn: number;
                    if (totalPages <= 5) pn = i + 1;
                    else if (page <= 3) pn = i + 1;
                    else if (page >= totalPages - 2) pn = totalPages - 4 + i;
                    else pn = page - 2 + i;
                    return (
                      <Button
                        key={pn}
                        variant={pn === page ? "default" : "outline"} size="sm"
                        className={`h-8 w-8 p-0 text-xs font-bold ${pn === page ? "bg-primary text-white border-primary" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                        onClick={() => setPage(pn)}
                        disabled={isLoading}
                      >{pn}</Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline" size="sm"
                  className="h-8 px-3 text-xs font-medium border-gray-200 bg-white"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || isLoading}
                >Next</Button>
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