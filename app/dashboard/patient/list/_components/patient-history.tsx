"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, History, RefreshCcw, Loader2, Search, CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
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
  phone: string;
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

export function PatientHistory({ patient, isOpen, onClose, defaultShowAddForm = false }: { patient: Patient | null; isOpen: boolean; onClose: () => void; defaultShowAddForm?: boolean }) {
  const [history, setHistory] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [medications, setMedications] = useState<MedicationMaster[]>([]);

  // Form state for new assignment
  const [showAddForm, setShowAddForm] = useState(defaultShowAddForm);
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
    if (isOpen && patient?.phone) {
      fetchHistory();
      fetchMedicationMaster();
      setShowAddForm(defaultShowAddForm);
    } else if (!isOpen) {
      setShowAddForm(false);
    }
  }, [isOpen, patient, defaultShowAddForm]);

  const fetchHistory = async () => {
    if (!patient?.phone) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/patients/history?phone=${patient.phone}`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
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

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
        <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 border-b border-gray-100">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <History className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Medical History: {patient.pet_name}
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
              <span>Owner: <strong className="text-gray-900">{patient.owner_name}</strong></span>
              <span>Phone: <strong className="text-gray-900">{patient.phone || "N/A"}</strong></span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {!patient.phone && (
            <div className="p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-sm">
              Warning: This patient does not have a phone number. History tracking requires a phone number.
            </div>
          )}

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              Visit Records
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none">
                {history.length}
              </Badge>
            </h3>
            {!showAddForm && patient.phone && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-[#72e3ad] hover:bg-[#4fe09a] text-black font-bold border border-[#16b674bf] shadow-sm transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" /> New Assignment
              </Button>
            )}
          </div>

          {showAddForm && (
            <div className="p-5 bg-white rounded-2xl border-2 border-primary/20 shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
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
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VACCINATION">Vaccination</SelectItem>
                      <SelectItem value="TEST">Test</SelectItem>
                      <SelectItem value="MEDICATION">Medication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Quick Select (From Master)</label>
                  <Select onValueChange={onSelectMedication}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-primary">
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

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Item Name *</label>
                  <Input
                    placeholder="e.g. Rabies Vaccine, Blood Test"
                    value={newRecord.item_name}
                    className="bg-gray-50 border-gray-200 focus:ring-primary"
                    onChange={e => setNewRecord({ ...newRecord, item_name: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Disease / Purpose</label>
                  <Input
                    placeholder="e.g. Fever, General Checkup"
                    value={newRecord.disease}
                    className="bg-gray-50 border-gray-200 focus:ring-primary"
                    onChange={e => setNewRecord({ ...newRecord, disease: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1 mb-1">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-gray-50 border-gray-200 focus:ring-primary",
                          !newRecord.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newRecord.date ? format(new Date(newRecord.date + "T00:00:00"), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
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

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1 mb-1">Visit Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-gray-50 border-gray-200 focus:ring-primary",
                          !newRecord.visit_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newRecord.visit_date ? format(new Date(newRecord.visit_date + "T00:00:00"), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
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

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1 mb-1">Next Visit / Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-gray-50 border-gray-200 focus:ring-primary",
                          !newRecord.next_visit_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newRecord.next_visit_date ? format(new Date(newRecord.next_visit_date + "T00:00:00"), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
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

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Description / Notes</label>
                  <Input
                    placeholder="Additional notes for this visit..."
                    value={newRecord.description}
                    className="bg-gray-50 border-gray-200 focus:ring-primary"
                    onChange={e => setNewRecord({ ...newRecord, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
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

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-b border-gray-100">
                  <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Select Date</TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Visit Date</TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Type</TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Item / Medication</TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Disease</TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Next Visit</TableHead>
                  <TableHead className="text-right font-bold text-gray-500 uppercase text-[10px] tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                        <p className="text-sm font-medium text-gray-400">Loading patient history...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center">
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
                      <TableCell className="text-sm font-semibold text-gray-700 py-4">
                        {record.date ? format(new Date(record.date), "dd MMM yyyy") : "-"}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-gray-600 py-4">
                        {record.visit_date ? format(new Date(record.visit_date), "dd MMM yyyy") : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] font-black tracking-tighter border-none px-2 py-0.5 ${record.type === "VACCINATION" ? "bg-blue-100 text-blue-700" :
                          record.type === "TEST" ? "bg-purple-100 text-purple-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                          {record.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-gray-900">{record.item_name}</TableCell>
                      <TableCell className="text-sm text-gray-500 font-medium">{record.disease || "-"}</TableCell>
                      <TableCell className="text-sm text-gray-600 font-medium">
                        {record.next_visit_date ? format(new Date(record.next_visit_date), "dd MMM yyyy") : "-"}
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
      </DialogContent>
    </Dialog>
  );
}
