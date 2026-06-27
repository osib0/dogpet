"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User, Phone, Mail, Calendar, Activity, Info,
  Plus, History, RefreshCcw, Loader2, ArrowLeft, CalendarIcon,
  PawPrint, ChevronRight, Trash2,
} from "lucide-react";
import { format, addDays } from "date-fns";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  createdAt: string;
  // legacy flat fields
  pet_name?: string;
  pet_category?: string;
  pet_type?: string;
  breed?: string;
  color?: string;
  sex?: string;
  dob?: string;
  picture?: string;
}

interface MedicalRecord {
  _id: string;
  type: "VACCINATION" | "TEST" | "MEDICATION";
  item_name: string;
  disease?: string;
  disease_type?: string;
  description?: string;
  date: string;
  visit_date?: string;
  next_visit_date?: string;
  createdAt: string;
}

interface MedicationMaster {
  _id: string;
  disease: string;
  disease_type: string;
  medicine_name: string;
  description?: string;
}

// ── Date formatter ────────────────────────────────────────────────────────────

const formatRecordDate = (
  record: MedicalRecord,
  field: "date" | "visit_date" | "next_visit_date"
) => {
  const value = record[field];
  const isValidDbValue = (val: string | number | Date | undefined) => {
    if (!val) return false;
    if (typeof val === "string" && (val.includes(":") || val === "00:00.0")) return false;
    const d = new Date(val as string | number | Date);
    return !isNaN(d.getTime());
  };

  if (isValidDbValue(value)) {
    const dateObj = new Date(value as string | number | Date);
    if (typeof value === "string" && value.includes("T")) {
      const parts = value.split("T")[0].split("-");
      if (parts.length === 3) {
        return format(
          new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])),
          "dd MMM yyyy"
        );
      }
    }
    return format(dateObj, "dd MMM yyyy");
  }

  if (record.description) {
    const match = record.description.match(/(\d{1,2})\s*[\/\-]\s*(\d{1,2})\s*[\/\-]\s*(\d{4})/);
    if (match) {
      const parsedDate = new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
      if (!isNaN(parsedDate.getTime())) {
        const isNextVisit = record.description.toLowerCase().match(/come|next|due/);
        if (field === "next_visit_date" && isNextVisit) return format(parsedDate, "dd MMM yyyy");
        if ((field === "visit_date" || field === "date") && !isNextVisit)
          return format(parsedDate, "dd MMM yyyy");
        return "-";
      }
    }
  }
  return "-";
};

const TYPE_COLORS: Record<string, string> = {
  VACCINATION: "bg-blue-100 text-blue-700",
  TEST: "bg-purple-100 text-purple-700",
  MEDICATION: "bg-green-100 text-green-700",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function isLegacyOwner(owner: Owner): boolean {
  return (!owner.pets || owner.pets.length === 0) && !!owner.pet_name;
}

function getLegacyAsPet(owner: Owner): (EmbeddedPet & { isLegacy?: boolean }) {
  return {
    _id: owner._id,
    pet_name: owner.pet_name || "",
    pet_category: owner.pet_category || "",
    pet_type: owner.pet_type || "",
    breed: owner.breed || "",
    color: owner.color || "",
    sex: owner.sex || "",
    dob: owner.dob || "",
    picture: owner.picture || "",
    is_active: owner.is_active,
    isLegacy: true,
  };
}

function getEffectivePets(owner: Owner): (EmbeddedPet & { isLegacy?: boolean })[] {
  const allPets = [];
  if (owner.pet_name) {
    allPets.push(getLegacyAsPet(owner));
  }
  if (owner.pets && owner.pets.length > 0) {
    allPets.push(...owner.pets);
  }
  return allPets;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PatientProfile() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const searchParams = useSearchParams();
  const petIdParam = searchParams.get("pet_id");

  const [owner, setOwner] = useState<Owner | null>(null);
  const [activePetId, setActivePetId] = useState<string | null>(petIdParam);
  const [history, setHistory] = useState<MedicalRecord[]>([]);
  const [medications, setMedications] = useState<MedicationMaster[]>([]);

  const [isLoadingOwner, setIsLoadingOwner] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const emptyRecord = () => ({
    type: "VACCINATION" as "VACCINATION" | "TEST" | "MEDICATION",
    item_name: "",
    disease: "",
    disease_type: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    visit_date: format(new Date(), "yyyy-MM-dd"),
    next_visit_date: format(addDays(new Date(), 30), "yyyy-MM-dd"),
  });
  const [newRecord, setNewRecord] = useState(emptyRecord());

  // ── Fetch owner ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (id) fetchOwner();
  }, [id]);

  const fetchOwner = async () => {
    try {
      const res = await fetch(`/api/patients/get?id=${id}`);
      const data = await res.json();
      if (res.ok && !data.error) {
        setOwner(data);
        // set active pet: use URL param, else first pet
        const pets = getEffectivePets(data);
        if (!activePetId && pets.length > 0) {
          setActivePetId(pets[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch owner:", err);
    } finally {
      setIsLoadingOwner(false);
    }
  };

  // ── Fetch history when active pet changes ─────────────────────────────────
  useEffect(() => {
    if (owner && activePetId) {
      fetchHistory();
      fetchMedicationMaster();
    }
  }, [owner, activePetId]);

  const fetchHistory = async () => {
    if (!owner || !activePetId) return;
    setIsLoadingHistory(true);
    try {
      const params = new URLSearchParams({
        patient_id: owner._id,
        pet_id: activePetId,
        phone: owner.phone,
      });
      const res = await fetch(`/api/patients/history?${params}`);
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchMedicationMaster = async () => {
    try {
      const res = await fetch("/api/medications");
      const data = await res.json();
      if (data.success) setMedications(data.data);
    } catch (err) {
      console.error("Failed to fetch medications:", err);
    }
  };

  // ── Save record ───────────────────────────────────────────────────────────
  const handleSaveRecord = async () => {
    if (!owner || !newRecord.item_name || !activePetId) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/patients/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: owner._id,
          pet_id: activePetId,
          phone: owner.phone,
          ...newRecord,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchHistory();
        setShowAddForm(false);
        setNewRecord(emptyRecord());
      }
    } catch (err) {
      console.error("Failed to save record:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm("Delete this medical record?")) return;
    try {
      const res = await fetch(`/api/patients/history?record_id=${recordId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchHistory();
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  const handleReassign = (record: MedicalRecord) => {
    setNewRecord({
      type: record.type,
      item_name: record.item_name,
      disease: record.disease || "",
      disease_type: record.disease_type || "",
      description: record.description || "",
      date: format(new Date(), "yyyy-MM-dd"),
      visit_date: format(new Date(), "yyyy-MM-dd"),
      next_visit_date: format(addDays(new Date(), 30), "yyyy-MM-dd"),
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSelectMedication = (medId: string) => {
    const med = medications.find((m) => m._id === medId);
    if (med) {
      setNewRecord({
        ...newRecord,
        item_name: med.medicine_name,
        disease: med.disease,
        disease_type: med.disease_type,
        description: med.description || "",
      });
    }
  };

  // ── Loading / not found ───────────────────────────────────────────────────
  if (isLoadingOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Patient not found.</p>
        <Button onClick={() => router.push("/dashboard/patient/list")} className="mt-4">
          Return to List
        </Button>
      </div>
    );
  }

  const allPets = getEffectivePets(owner);
  const activePet = allPets.find((p) => p._id === activePetId) || allPets[0] || null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top nav */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/patient/list")}
          className="hover:bg-gray-100 p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Owner Profile</h1>
          <p className="text-sm text-gray-500">{owner.owner_name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column: Owner + Pets ───────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Owner card */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-transparent p-5 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{owner.owner_name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {owner.is_active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">{owner.phone || "—"}</span>
              </div>
              {owner.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="font-medium truncate">{owner.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  Joined{" "}
                  {owner.createdAt && !isNaN(new Date(owner.createdAt).getTime())
                    ? format(new Date(owner.createdAt), "dd MMM yyyy")
                    : "—"}
                </span>
              </div>

              <div className="pt-2">
                <Link href={`/dashboard/patient/add?edit=${owner._id}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs border-gray-200">
                    Edit Owner Info
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Pets list */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-primary" />
                Pets ({allPets.length})
              </h3>
              <Link href={`/dashboard/patient/add?owner_id=${owner._id}`}>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/5 gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Pet
                </Button>
              </Link>
            </div>

            {allPets.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">No pets registered</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {allPets.map((pet) => {
                  const isActive = pet._id === activePetId;
                  return (
                    <button
                      key={pet._id}
                      onClick={() => {
                        setActivePetId(pet._id);
                        setHistory([]);
                        setShowAddForm(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-4 text-left transition-colors",
                        isActive
                          ? "bg-primary/5 border-l-4 border-primary"
                          : "hover:bg-gray-50 border-l-4 border-transparent"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        {pet.picture ? (
                          <img src={pet.picture} alt={pet.pet_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-gray-400 text-sm">
                            {pet.pet_name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("font-semibold text-sm truncate", isActive ? "text-primary" : "text-gray-800")}>
                          {pet.pet_name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {[pet.pet_category, pet.pet_type].filter(Boolean).join(" · ") || "—"}
                        </p>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: Active pet details + history ──────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {activePet ? (
            <>
              {/* Active pet detail card */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="relative h-44 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {activePet.picture ? (
                    <img src={activePet.picture} alt={activePet.pet_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold text-gray-400">
                          {activePet.pet_name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs">No Photo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white drop-shadow-md">{activePet.pet_name}</h2>
                      <div className="flex gap-2 mt-1">
                        {activePet.pet_category && (
                          <Badge className="bg-white/20 text-white border-none backdrop-blur-sm text-xs">
                            {activePet.pet_category}
                          </Badge>
                        )}
                        {activePet.pet_type && (
                          <Badge className="bg-white/20 text-white border-none backdrop-blur-sm text-xs">
                            {activePet.pet_type}
                          </Badge>
                        )}
                        {activePet.sex && (
                          <Badge className={cn("border-none text-xs", activePet.sex === "MALE" ? "bg-blue-500/70 text-white" : "bg-pink-500/70 text-white")}>
                            {activePet.sex}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!activePet.isLegacy && (
                      <Link href={`/dashboard/patient/add?edit=${owner._id}&pet_id=${activePet._id}`}>
                        <Button size="sm" className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 text-xs">
                          Edit Pet
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">Breed</p>
                      <p className="text-sm font-semibold text-gray-800">{activePet.breed || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">Color</p>
                      <p className="text-sm font-semibold text-gray-800">{activePet.color || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> DOB
                      </p>
                      <p className="text-sm font-semibold text-gray-800">{activePet.dob || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Status
                      </p>
                      {activePet.is_active ? (
                        <span className="text-xs font-bold text-green-700">Active</span>
                      ) : (
                        <span className="text-xs font-bold text-red-500">Inactive</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Medical History — {activePet.pet_name}
                    <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600 border-none">
                      {history.length}
                    </Badge>
                  </h3>
                  {!showAddForm && owner.phone && (
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="bg-[#72e3ad] hover:bg-[#4fe09a] text-black font-bold border border-[#16b674bf] hover:scale-105 transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" /> New Assignment
                    </Button>
                  )}
                </div>

                {!owner.phone && (
                  <div className="mb-6 p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-sm">
                    Warning: Owner does not have a phone number. History tracking requires a phone number.
                  </div>
                )}

                {/* Add form */}
                {showAddForm && (
                  <div className="mb-8 p-5 bg-gray-50/80 rounded-2xl border border-primary/20 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <h4 className="font-bold text-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add New Assignment for {activePet.pet_name}
                      </h4>
                      <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)} className="h-8 text-gray-400 hover:text-red-500">
                        Cancel
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Record Type */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Record Type</label>
                        <Select value={newRecord.type} onValueChange={(val: any) => setNewRecord({ ...newRecord, type: val })}>
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VACCINATION">Vaccination</SelectItem>
                            <SelectItem value="TEST">Test</SelectItem>
                            <SelectItem value="MEDICATION">Medication</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Select Date */}
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1 mb-1">Select Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-white border-gray-200", !newRecord.date && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newRecord.date ? format(new Date(newRecord.date + "T00:00:00"), "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={newRecord.date ? new Date(newRecord.date + "T00:00:00") : undefined}
                              onSelect={(date) => setNewRecord({ ...newRecord, date: date ? format(date, "yyyy-MM-dd") : "" })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Quick Select */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Quick Select (From Master)</label>
                        <Select onValueChange={(val) => { const med = medications.find(m => m._id === val); if (med) setNewRecord({ ...newRecord, item_name: med.medicine_name, disease: med.disease, disease_type: med.disease_type, description: med.description || "" }); }}>
                          <SelectTrigger className="bg-white border-gray-200">
                            <SelectValue placeholder="Search master data..." />
                          </SelectTrigger>
                          <SelectContent>
                            {medications.map(m => (
                              <SelectItem key={m._id} value={m._id}>{m.medicine_name} ({m.disease})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Item Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Item Name *</label>
                        <Input placeholder="e.g. Rabies Vaccine" value={newRecord.item_name} className="bg-white border-gray-200" onChange={e => setNewRecord({ ...newRecord, item_name: e.target.value })} />
                      </div>

                      {/* Disease */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Disease / Purpose</label>
                        <Input placeholder="e.g. Fever" value={newRecord.disease} className="bg-white border-gray-200" onChange={e => setNewRecord({ ...newRecord, disease: e.target.value })} />
                      </div>

                      {/* Visit Date */}
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1 mb-1">Visit Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-white border-gray-200", !newRecord.visit_date && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newRecord.visit_date ? format(new Date(newRecord.visit_date + "T00:00:00"), "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={newRecord.visit_date ? new Date(newRecord.visit_date + "T00:00:00") : undefined}
                              onSelect={(date) => {
                                const nd = date ? format(date, "yyyy-MM-dd") : "";
                                setNewRecord({ ...newRecord, visit_date: nd, next_visit_date: nd ? format(addDays(new Date(nd + "T00:00:00"), 30), "yyyy-MM-dd") : "" });
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Next Visit */}
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1 mb-1">Next Visit / Due Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-white border-gray-200", !newRecord.next_visit_date && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newRecord.next_visit_date ? format(new Date(newRecord.next_visit_date + "T00:00:00"), "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={newRecord.next_visit_date ? new Date(newRecord.next_visit_date + "T00:00:00") : undefined}
                              onSelect={(date) => setNewRecord({ ...newRecord, next_visit_date: date ? format(date, "yyyy-MM-dd") : "" })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Description / Notes</label>
                        <Input placeholder="Additional notes..." value={newRecord.description} className="bg-white border-gray-200" onChange={e => setNewRecord({ ...newRecord, description: e.target.value })} />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
                      <Button onClick={handleSaveRecord} disabled={isSaving || !newRecord.item_name} className="bg-primary text-white shadow-md font-bold px-6">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        Confirm Assignment
                      </Button>
                    </div>
                  </div>
                )}

                {/* History table */}
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50/50">
                      <TableRow className="border-b border-gray-100">
                        <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-wider whitespace-nowrap">Select Date</TableHead>
                        <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-wider whitespace-nowrap">Visit Date</TableHead>
                        <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-wider whitespace-nowrap">Type</TableHead>
                        <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Item / Medication</TableHead>
                        <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-wider whitespace-nowrap">Next Visit</TableHead>
                        <TableHead className="text-right font-bold text-gray-500 uppercase text-[10px] tracking-wider">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingHistory ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-48 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                              <p className="text-sm font-medium text-gray-400">Loading history...</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : history.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-48 text-center">
                            <div className="flex flex-col items-center gap-2 opacity-40">
                              <History className="w-10 h-10 mb-2" />
                              <p className="text-base font-bold text-gray-400">No records for {activePet.pet_name}</p>
                              <p className="text-xs text-gray-400">Add a new assignment to get started</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        history.map((record) => (
                          <TableRow key={record._id} className="hover:bg-primary/[0.02] transition-colors border-b border-gray-50 last:border-0">
                            <TableCell className="text-sm font-semibold text-gray-700 py-4 whitespace-nowrap">{formatRecordDate(record, "date")}</TableCell>
                            <TableCell className="text-sm font-medium text-gray-600 py-4 whitespace-nowrap">{formatRecordDate(record, "visit_date")}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-[10px] font-black tracking-tighter border-none px-2 py-0.5 whitespace-nowrap ${TYPE_COLORS[record.type] || ""}`}>
                                {record.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-bold text-gray-900">
                              {record.item_name}
                              {record.disease && <span className="block text-xs text-gray-500 font-normal mt-0.5">{record.disease}</span>}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600 font-medium whitespace-nowrap">{formatRecordDate(record, "next_visit_date")}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-primary hover:bg-primary/10 font-black rounded-full" onClick={() => handleReassign(record)}>
                                  <RefreshCcw className="w-3.5 h-3.5 mr-1.5" /> RE-ASSIGN
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={() => handleDeleteRecord(record._id)} title="Delete record">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <PawPrint className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No pets registered for this owner.</p>
              <Link href={`/dashboard/patient/add?owner_id=${owner._id}`}>
                <Button className="mt-4 bg-[#72e3ad] hover:bg-[#4fe09a] text-black font-bold border border-[#16b674bf]">
                  <Plus className="w-4 h-4 mr-2" /> Add First Pet
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
