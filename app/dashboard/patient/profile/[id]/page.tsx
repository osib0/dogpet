"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, Calendar, Activity, Info, Plus, History, RefreshCcw, Loader2, ArrowLeft, CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Patient {
  _id: string;
  owner_name: string;
  pet_name: string;
  pet_category: string;
  pet_type: string;
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

const formatRecordDate = (record: MedicalRecord, field: 'date' | 'visit_date' | 'next_visit_date') => {
  const value = record[field];

  // Helper to check if a value is a valid date from the database
  const isValidDbValue = (val: string | number | Date | undefined) => {
    if (!val) return false;
    if (typeof val === 'string' && (val.includes(':') || val === '00:00.0')) {
      return false;
    }
    const d = new Date(val as string | number | Date);
    return !isNaN(d.getTime());
  };

  // 1. If the database has a valid, non-placeholder date for this specific field, use it!
  if (isValidDbValue(value)) {
    const dateObj = new Date(value as string | number | Date);

    // Timezone-safe formatting for ISO strings
    if (typeof value === 'string' && value.includes('T')) {
      const parts = value.split('T')[0].split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return format(new Date(year, month, day), "dd MMM yyyy");
      }
    }
    return format(dateObj, "dd MMM yyyy");
  }

  // 2. If the database value is missing or invalid, try to parse from description based on context
  if (record.description) {
    const match = record.description.match(/(\d{1,2})\s*[\/\-]\s*(\d{1,2})\s*[\/\-]\s*(\d{4})/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      const parsedDate = new Date(year, month, day);
      if (!isNaN(parsedDate.getTime())) {
        const descLower = record.description.toLowerCase();

        // Classify based on keywords
        const isNextVisit = descLower.includes('come') || descLower.includes('next') || descLower.includes('due');

        if (field === 'next_visit_date') {
          if (isNextVisit) {
            return format(parsedDate, "dd MMM yyyy");
          }
        } else if (field === 'visit_date' || field === 'date') {
          // If the date in the description is explicitly a next visit date, do not show it in visit_date/date
          if (isNextVisit) {
            return "-";
          }
          // Otherwise, it's either explicitly a visit date ("came") or the default visit date
          return format(parsedDate, "dd MMM yyyy");
        }
      }
    }
  }

  return "-";
};


export default function PatientProfile() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [history, setHistory] = useState<MedicalRecord[]>([]);
  const [medications, setMedications] = useState<MedicationMaster[]>([]);

  const [isLoadingPatient, setIsLoadingPatient] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newRecord, setNewRecord] = useState<{
    type: "VACCINATION" | "TEST" | "MEDICATION";
    item_name: string;
    disease: string;
    disease_type: string;
    description: string;
    date: string;
    visit_date: string;
    next_visit_date: string;
  }>({
    type: "VACCINATION",
    item_name: "",
    disease: "",
    disease_type: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    visit_date: format(new Date(), "yyyy-MM-dd"),
    next_visit_date: format(addDays(new Date(), 30), "yyyy-MM-dd"),
  });

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id]);

  useEffect(() => {
    if (patient?.phone) {
      fetchHistory();
      fetchMedicationMaster();
    }
  }, [patient]);

  const fetchPatient = async () => {
    try {
      const res = await fetch(`/api/patients/get?id=${id}`);
      const data = await res.json();
      if (res.ok && !data.error) {
        setPatient(data);
      } else {
        console.error("Failed to fetch patient:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch patient:", error);
    } finally {
      setIsLoadingPatient(false);
    }
  };

  const fetchHistory = async () => {
    if (!patient?.phone) return;
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/patients/history?phone=${patient.phone}`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchMedicationMaster = async () => {
    try {
      const res = await fetch("/api/medications");
      const data = await res.json();
      if (data.success) {
        setMedications(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch medications master:", error);
    }
  };

  const handleSaveRecord = async () => {
    if (!patient || !newRecord.item_name) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/patients/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patient._id,
          phone: patient.phone,
          ...newRecord,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchHistory();
        setShowAddForm(false);
        setNewRecord({
          type: "VACCINATION",
          item_name: "",
          disease: "",
          disease_type: "",
          description: "",
          date: format(new Date(), "yyyy-MM-dd"),
          visit_date: format(new Date(), "yyyy-MM-dd"),
          next_visit_date: format(addDays(new Date(), 30), "yyyy-MM-dd"),
        });
      }
    } catch (error) {
      console.error("Failed to save record:", error);
    } finally {
      setIsSaving(false);
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
    // Scroll to form slightly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSelectMedication = (medId: string) => {
    const med = medications.find(m => m._id === medId);
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

  if (isLoadingPatient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Patient not found or could not be loaded.</p>
        <Button onClick={() => router.push("/dashboard/patient/list")} className="mt-4">
          Return to List
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/dashboard/patient/list")} className="hover:bg-gray-100 p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Patient Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Patient Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {patient.picture ? (
                <img
                  src={patient.picture}
                  alt={patient.pet_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-gray-400">
                      {patient.pet_name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs">No Photo Available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl font-bold text-white drop-shadow-md">{patient.pet_name}</h2>
                <div className="flex gap-2 mt-1">
                  {patient.pet_category && (
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                      {patient.pet_category}
                    </Badge>
                  )}
                  {patient.pet_type && (
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                      {patient.pet_type}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 border-b pb-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> Owner Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Owner Name</p>
                    <p className="text-sm font-semibold text-gray-900">{patient.owner_name || "-"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                      <p className="text-sm font-semibold text-gray-900">{patient.phone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
                      <p className="text-sm font-semibold text-gray-900 truncate" title={patient.email}>{patient.email || "-"}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 border-b pb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Pet Details
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Breed/Notes</p>
                    <p className="text-sm font-semibold text-gray-900">{patient.breed || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Color</p>
                    <p className="text-sm font-semibold text-gray-900">{patient.color || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Gender</p>
                    <p className={`text-sm font-bold ${patient.sex === "MALE" ? "text-blue-600" : "text-pink-600"}`}>
                      {patient.sex || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> DOB</p>
                    <p className="text-sm font-semibold text-gray-900">{patient.dob || "-"}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-400 border-b pb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Status
                </h3>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Account Status</span>
                  {patient.is_active ? (
                    <div className="flex items-center gap-1.5 bg-green-100 px-3 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                      <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-red-100 px-3 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                      <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Inactive</span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Right column: Patient History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-sm md:text-xl font-bold text-gray-800 flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Medical History
                <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600 border-none">
                  {history.length}
                </Badge>
              </h3>
              {!showAddForm && patient.phone && (
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#72e3ad] hover:bg-[#4fe09a] text-sm cursor-pointer text-black font-bold border border-[#16b674bf] transition-all hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" /> New Assignment
                </Button>
              )}
            </div>

            {!patient.phone && (
              <div className="mb-6 p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-sm">
                Warning: This patient does not have a phone number. History tracking requires a phone number.
              </div>
            )}

            {showAddForm && (
              <div className="mb-8 p-5 bg-gray-50/80 rounded-2xl border border-primary/20 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Assignment
                  </h4>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)} className="h-8 text-gray-400 hover:text-red-500">
                    Cancel
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Record Type</label>
                    <Select
                      value={newRecord.type}
                      onValueChange={(val: any) => setNewRecord({ ...newRecord, type: val })}
                    >
                      <SelectTrigger className="bg-white border-gray-200 focus:ring-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VACCINATION">Vaccination</SelectItem>
                        <SelectItem value="TEST">Test</SelectItem>
                        <SelectItem value="MEDICATION">Medication</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1 mb-1">Select Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white border-gray-200 focus:ring-primary",
                            !newRecord.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newRecord.date ? format(new Date(newRecord.date + "T00:00:00"), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={newRecord.date ? new Date(newRecord.date + "T00:00:00") : undefined}
                          onSelect={(date) => {
                            setNewRecord({ ...newRecord, date: date ? format(date, "yyyy-MM-dd") : "" });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Quick Select (From Master)</label>
                    <Select onValueChange={onSelectMedication}>
                      <SelectTrigger className="bg-white border-gray-200 focus:ring-primary">
                        <SelectValue placeholder="Search master data..." />
                      </SelectTrigger>
                      <SelectContent>
                        {medications.map(m => (
                          <SelectItem key={m._id} value={m._id}>
                            {m.medicine_name} ({m.disease})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1 mb-1">Visit Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white border-gray-200 focus:ring-primary",
                            !newRecord.visit_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newRecord.visit_date ? format(new Date(newRecord.visit_date + "T00:00:00"), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={newRecord.visit_date ? new Date(newRecord.visit_date + "T00:00:00") : undefined}
                          onSelect={(date) => {
                            const newDate = date ? format(date, "yyyy-MM-dd") : "";
                            setNewRecord({
                              ...newRecord,
                              visit_date: newDate,
                              next_visit_date: newDate ? format(addDays(new Date(newDate + "T00:00:00"), 30), "yyyy-MM-dd") : ""
                            });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Item Name *</label>
                    <Input
                      placeholder="e.g. Rabies Vaccine, Blood Test"
                      value={newRecord.item_name}
                      className="bg-white border-gray-200 focus:ring-primary"
                      onChange={e => setNewRecord({ ...newRecord, item_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1 mb-1">Next Visit / Due Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white border-gray-200 focus:ring-primary",
                            !newRecord.next_visit_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newRecord.next_visit_date ? format(new Date(newRecord.next_visit_date + "T00:00:00"), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={newRecord.next_visit_date ? new Date(newRecord.next_visit_date + "T00:00:00") : undefined}
                          onSelect={(date) => {
                            setNewRecord({ ...newRecord, next_visit_date: date ? format(date, "yyyy-MM-dd") : "" });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Disease / Purpose</label>
                    <Input
                      placeholder="e.g. Fever, General Checkup"
                      value={newRecord.disease}
                      className="bg-white border-gray-200 focus:ring-primary"
                      onChange={e => setNewRecord({ ...newRecord, disease: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Description / Notes</label>
                    <Input
                      placeholder="Additional notes for this visit..."
                      value={newRecord.description}
                      className="bg-white border-gray-200 focus:ring-primary"
                      onChange={e => setNewRecord({ ...newRecord, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
                  <Button
                    onClick={handleSaveRecord}
                    disabled={isSaving || !newRecord.item_name}
                    className="bg-primary text-white shadow-md hover:shadow-lg transition-all font-bold px-6"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Confirm Assignment
                  </Button>
                </div>
              </div>
            )}

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
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                          <p className="text-sm font-medium text-gray-400">Loading patient history...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                          <History className="w-10 h-10 mb-2" />
                          <p className="text-base font-bold text-gray-400">No medical records found</p>
                          <p className="text-xs text-gray-400">Add a new assignment to get started</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((record) => (
                      <TableRow key={record._id} className="hover:bg-primary/[0.02] transition-colors border-b border-gray-50 last:border-0">
                        <TableCell className="text-sm font-semibold text-gray-700 py-4 whitespace-nowrap">
                          {formatRecordDate(record, 'date')}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-gray-600 py-4 whitespace-nowrap">
                          {formatRecordDate(record, 'visit_date')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] font-black tracking-tighter border-none px-2 py-0.5 whitespace-nowrap ${record.type === "VACCINATION" ? "bg-blue-100 text-blue-700" :
                            record.type === "TEST" ? "bg-purple-100 text-purple-700" :
                              "bg-green-100 text-green-700"
                            }`}>
                            {record.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-gray-900">
                          {record.item_name}
                          {record.disease && <span className="block text-xs text-gray-500 font-normal mt-0.5">{record.disease}</span>}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 font-medium whitespace-nowrap">
                          {formatRecordDate(record, 'next_visit_date')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs text-primary hover:text-primary hover:bg-primary/10 font-black rounded-full transition-all"
                            onClick={() => handleReassign(record)}
                          >
                            <RefreshCcw className="w-3.5 h-3.5 mr-1.5" /> RE-ASSIGN
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
