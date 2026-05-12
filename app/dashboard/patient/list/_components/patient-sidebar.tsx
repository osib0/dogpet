"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Calendar, Activity, Info } from "lucide-react";

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

interface PatientSidebarProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PatientSidebar({ patient, isOpen, onClose }: PatientSidebarProps) {
  if (!patient) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0 border-l border-gray-100 shadow-2xl">
        <div className="relative h-64 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {patient.picture ? (
            <img 
              src={patient.picture} 
              alt={patient.pet_name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <span className="text-4xl font-bold text-gray-400">
                  {patient.pet_name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <span>No Photo Available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-md">{patient.pet_name}</h2>
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

        <div className="p-6 space-y-8">
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
      </SheetContent>
    </Sheet>
  );
}
