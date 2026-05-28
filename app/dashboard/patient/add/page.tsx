"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { upload } from "@imagekit/next";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, User, PawPrint, Upload, CheckCircle2,
  AlertCircle, Plus, X, Trash2
} from "lucide-react";
import Link from "next/link";

// ── Schemas ───────────────────────────────────────────────────────────────────

const petFieldSchema = z.object({
  pet_name: z.string().optional(),
  pet_category: z.string().optional(),
  pet_type: z.string().optional(),
  breed: z.string().optional(),
  color: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional(),
  dob: z.string().optional(),
  picture: z.string().optional(),
});

const formSchema = z.object({
  owner_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  is_active: z.boolean().optional(),
  // dynamic pets array (used in new / add-pet modes)
  pets: z.array(petFieldSchema).optional(),
  // single pet fields (edit-pet mode only)
  pet_name: z.string().optional(),
  pet_category: z.string().optional(),
  pet_type: z.string().optional(),
  breed: z.string().optional(),
  color: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional(),
  dob: z.string().optional(),
  picture: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// ── Modes ─────────────────────────────────────────────────────────────────────
type PageMode = "new" | "edit-owner" | "edit-pet" | "add-pet";

// ── Helpers ───────────────────────────────────────────────────────────────────
const emptyPet = () => ({
  pet_name: "", pet_category: "", pet_type: "",
  breed: "", color: "", sex: undefined as any, dob: "", picture: "",
});

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PatientAddEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get("edit");
  const petId = searchParams.get("pet_id");
  const ownerId = searchParams.get("owner_id");

  const mode: PageMode =
    editId && petId ? "edit-pet" :
    editId && !petId ? "edit-owner" :
    ownerId ? "add-pet" : "new";

  const [petCategories, setPetCategories] = useState<any[]>([]);
  const [petTypesByIndex, setPetTypesByIndex] = useState<Record<number, string[]>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<number, File>>({});
  const [isUploading, setIsUploading] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingOwner, setExistingOwner] = useState<{ owner_name: string; email: string; _id?: string } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_active: true,
      owner_name: "", phone: "", email: "",
      pets: mode === "new" || mode === "add-pet" ? [emptyPet()] : [],
      pet_name: "", pet_category: "", pet_type: "",
      breed: "", color: "", dob: "", picture: "",
    },
  });

  // Dynamic pets field array (for new / add-pet)
  const { fields: petFields, append: appendPet, remove: removePet } = useFieldArray({
    control: form.control,
    name: "pets",
  });

  const showOwnerSection = mode === "new" || mode === "edit-owner";
  const showMultiPetSection = mode === "new" || mode === "add-pet";
  const showSinglePetSection = mode === "edit-pet";

  // ── Load pet categories ───────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/pets/get")
      .then((r) => r.json())
      .then((d) => { if (d.success) setPetCategories(d.data); });
  }, []);

  // ── Load existing data for edit modes ────────────────────────────────────
  useEffect(() => {
    if (!editId || petCategories.length === 0) return;

    fetch(`/api/patients/get?id=${editId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.error) return;

        if (mode === "edit-owner") {
          form.reset({
            owner_name: data.owner_name || "",
            phone: data.phone || "",
            email: data.email || "",
            is_active: data.is_active ?? true,
            pets: [],
          });
        } else if (mode === "edit-pet" && petId) {
          const pet = data.pets?.find((p: any) => p._id === petId);
          if (pet) {
            form.reset({
              owner_name: data.owner_name || "",
              phone: data.phone || "",
              email: data.email || "",
              is_active: pet.is_active ?? true,
              pet_name: pet.pet_name || "",
              pet_category: pet.pet_category || "",
              pet_type: pet.pet_type || "",
              breed: pet.breed || "",
              color: pet.color || "",
              sex: pet.sex as any,
              dob: pet.dob || "",
              picture: pet.picture || "",
              pets: [],
            });
            if (pet.pet_category) {
              const cat = petCategories.find((p) => p.name === pet.pet_category);
              if (cat) setPetTypesByIndex({ 0: cat.types });
            }
          }
        }
      });
  }, [editId, petId, petCategories, mode]);

  // ── Load owner for add-pet mode ───────────────────────────────────────────
  useEffect(() => {
    if (!ownerId || petCategories.length === 0) return;
    fetch(`/api/patients/get?id=${ownerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data?.error) {
          setExistingOwner({ _id: data._id, owner_name: data.owner_name || "", email: data.email || "" });
          form.setValue("owner_name", data.owner_name || "");
          form.setValue("phone", data.phone || "");
          form.setValue("email", data.email || "");
        }
      });
  }, [ownerId, petCategories]);

  // ── Phone lookup for new patient ──────────────────────────────────────────
  const watchedPhone = form.watch("phone");
  useEffect(() => {
    if (mode !== "new") return;
    if (!watchedPhone || watchedPhone.trim().length < 10) {
      setExistingOwner(null);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/patients/get?phone=${watchedPhone.trim()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d.found && d.patient) {
          setExistingOwner({ _id: d.patient._id, owner_name: d.patient.owner_name || "", email: d.patient.email || "" });
          form.setValue("owner_name", d.patient.owner_name || "");
          form.setValue("email", d.patient.email || "");
        } else {
          setExistingOwner(null);
        }
      })
      .catch((e) => { if (e.name !== "AbortError") console.error(e); });
    return () => controller.abort();
  }, [watchedPhone, mode]);

  // ── Category change per pet index ─────────────────────────────────────────
  const onCategoryChange = (idx: number, val: string) => {
    form.setValue(`pets.${idx}.pet_category`, val);
    form.setValue(`pets.${idx}.pet_type`, "");
    const cat = petCategories.find((p) => p.name === val);
    setPetTypesByIndex((prev) => ({ ...prev, [idx]: cat ? cat.types : [] }));
  };

  // ── Image upload per pet index ────────────────────────────────────────────
  const handleUploadPicture = async (idx: number) => {
    const file = selectedFiles[idx];
    if (!file) return;
    setIsUploading((prev) => ({ ...prev, [idx]: true }));
    try {
      const authRes = await fetch("/api/upload-auth");
      if (!authRes.ok) throw new Error("Auth failed");
      const auth = await authRes.json();
      const ext = file.type.split("/")[1] || "jpg";
      const uploadRes = await upload({ ...auth, file, fileName: `pet_${Date.now()}.${ext}` });
      if (!uploadRes.url) throw new Error("Upload failed");
      if (showSinglePetSection) {
        form.setValue("picture", uploadRes.url);
      } else {
        form.setValue(`pets.${idx}.picture`, uploadRes.url);
      }
      showToast("success", "Picture uploaded!");
    } catch {
      showToast("error", "Failed to upload picture");
    } finally {
      setIsUploading((prev) => ({ ...prev, [idx]: false }));
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      let body: Record<string, any> = {};

      if (mode === "edit-owner") {
        body = { _id: editId, owner_name: data.owner_name, phone: data.phone, email: data.email, is_active: data.is_active };
      } else if (mode === "edit-pet") {
        body = {
          _id: editId, pet_id: petId,
          pet_name: data.pet_name, pet_category: data.pet_category, pet_type: data.pet_type,
          breed: data.breed, color: data.color, sex: data.sex, dob: data.dob, picture: data.picture,
          is_active: data.is_active,
        };
      } else if (mode === "add-pet") {
        body = { _id: ownerId, pets: data.pets?.filter((p) => p.pet_name) };
      } else {
        // new — use existingOwner if phone matched
        if (existingOwner?._id) {
          body = { _id: existingOwner._id, pets: data.pets?.filter((p) => p.pet_name) };
        } else {
          body = {
            owner_name: data.owner_name, phone: data.phone, email: data.email,
            is_active: data.is_active,
            pets: data.pets?.filter((p) => p.pet_name),
          };
        }
      }

      const res = await fetch("/api/patients/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (res.ok) {
        const msg = mode === "edit-owner" ? "Owner updated!" :
          mode === "edit-pet" ? "Pet updated!" :
          mode === "add-pet" ? "Pet(s) added!" : "Patient saved!";
        showToast("success", msg);
        setTimeout(() => router.push("/dashboard/patient/list"), 1200);
      } else {
        showToast("error", result.error || "Failed to save.");
      }
    } catch {
      showToast("error", "Failed to save. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const pageTitle = mode === "edit-owner" ? "Edit Owner" :
    mode === "edit-pet" ? "Edit Pet" :
    mode === "add-pet" ? "Add Pet(s)" : "New Patient";

  // ── Reusable Pet Card ─────────────────────────────────────────────────────
  const renderPetCard = (idx: number, canRemove: boolean) => {
    const watchedCategory = form.watch(`pets.${idx}.pet_category`);
    const watchedPicture = form.watch(`pets.${idx}.picture`);
    const types = petTypesByIndex[idx] || [];

    return (
      <div key={idx} className="relative border border-gray-200 rounded-xl p-5 bg-gray-50/40">
        {/* Pet header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
            <PawPrint className="h-3.5 w-3.5 text-green-600" />
            Pet {idx + 1}
          </h3>
          {canRemove && (
            <Button
              type="button" variant="ghost" size="sm"
              className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
              onClick={() => removePet(idx)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Pet Name */}
          <FormField control={form.control} name={`pets.${idx}.pet_name`} render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Pet Name *</FormLabel>
              <FormControl><Input placeholder="Enter pet name" {...field} className="text-sm" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Category */}
          <FormItem>
            <FormLabel className="text-xs">Category</FormLabel>
            <Select
              value={form.watch(`pets.${idx}.pet_category`) || ""}
              onValueChange={(v) => onCategoryChange(idx, v)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {petCategories.map((p) => (
                  <SelectItem key={p._id} value={p.name}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>

          {/* Type */}
          <FormItem>
            <FormLabel className="text-xs">Type</FormLabel>
            <Select
              value={form.watch(`pets.${idx}.pet_type`) || ""}
              onValueChange={(v) => form.setValue(`pets.${idx}.pet_type`, v)}
              disabled={!watchedCategory}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormItem>

          {/* Breed */}
          <FormField control={form.control} name={`pets.${idx}.breed`} render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Breed</FormLabel>
              <FormControl><Input placeholder="Breed (optional)" {...field} className="text-sm" /></FormControl>
            </FormItem>
          )} />

          {/* Color */}
          <FormField control={form.control} name={`pets.${idx}.color`} render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Color</FormLabel>
              <FormControl><Input placeholder="Color" {...field} className="text-sm" /></FormControl>
            </FormItem>
          )} />

          {/* Gender */}
          <FormItem>
            <FormLabel className="text-xs">Gender</FormLabel>
            <Select
              value={form.watch(`pets.${idx}.sex`) || ""}
              onValueChange={(v) => form.setValue(`pets.${idx}.sex`, v as any)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          {/* DOB */}
          <FormField control={form.control} name={`pets.${idx}.dob`} render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Date of Birth</FormLabel>
              <FormControl><Input type="date" {...field} className="text-sm" /></FormControl>
            </FormItem>
          )} />

          {/* Picture */}
          <div className="sm:col-span-2 space-y-2">
            <FormLabel className="text-xs block">Pet Picture</FormLabel>
            <div className="flex items-center gap-3">
              {watchedPicture && (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                  <img src={watchedPicture} alt="Pet" className="w-full h-full object-cover" />
                </div>
              )}
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="flex-1 text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFiles((prev) => ({ ...prev, [idx]: file }));
                }}
              />
              <Button
                type="button" variant="outline" size="sm"
                className="flex-shrink-0 gap-1 text-xs"
                onClick={() => handleUploadPicture(idx)}
                disabled={!selectedFiles[idx] || isUploading[idx]}
              >
                <Upload className="h-3.5 w-3.5" />
                {isUploading[idx] ? "..." : "Upload"}
              </Button>
            </div>
            {watchedPicture && <p className="text-xs text-green-600 font-medium">✓ Uploaded</p>}
          </div>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 max-w-4xl mx-auto min-h-screen">

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-medium animate-in slide-in-from-top-2 duration-300",
          toast.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
        )}>
          {toast.type === "success"
            ? <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            : <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />}
          {toast.message}
        </div>
      )}

      {/* Back + Title */}
      <div className="flex items-center gap-3 mb-5">
        <Link href="/dashboard/patient/list">
          <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>
          <p className="text-xs text-gray-500">
            {mode === "new" ? "Register new owner with one or more pets" :
             mode === "edit-owner" ? "Update owner contact information" :
             mode === "edit-pet" ? "Update pet details" :
             "Add more pets to this owner"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>

            {/* ── Owner Section ──────────────────────────────────────────── */}
            {showOwnerSection && (
              <div className="p-5 border-b border-gray-100">
                <h2 className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-4 uppercase tracking-wider">
                  <div className="p-1.5 bg-blue-100 rounded-md">
                    <User className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  Owner Information
                </h2>

                {/* Existing owner found banner */}
                {existingOwner && mode === "new" && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-green-800">✨ Existing Owner Found!</p>
                      <p className="text-xs text-green-700 mt-0.5">
                        Adding pet(s) to <strong>{existingOwner.owner_name}</strong>'s account.
                      </p>
                    </div>
                    <Button type="button" variant="ghost" size="sm"
                      className="h-7 text-xs text-green-800 hover:bg-green-100 font-bold rounded-full"
                      onClick={() => { form.setValue("phone", ""); setExistingOwner(null); }}>
                      Clear
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="owner_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Owner Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter owner name" {...field}
                          disabled={!!(existingOwner && mode === "new")}
                          className={cn("text-sm", existingOwner && mode === "new" && "bg-gray-50 text-gray-500")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field}
                          disabled={!!(existingOwner && mode === "new")}
                          className="text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email address" {...field}
                          disabled={!!(existingOwner && mode === "new")}
                          className={cn("text-sm", existingOwner && mode === "new" && "bg-gray-50 text-gray-500")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="is_active" render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-3 space-y-0 mt-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">Active</FormLabel>
                    </FormItem>
                  )} />
                </div>
              </div>
            )}

            {/* ── Add-pet mode: show owner info read-only ────────────────── */}
            {mode === "add-pet" && existingOwner && (
              <div className="px-5 py-3 border-b border-gray-100 bg-blue-50/50">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Adding pets for</p>
                <p className="font-semibold text-blue-900 mt-0.5">{existingOwner.owner_name}</p>
              </div>
            )}

            {/* ── Multi-Pet Section (new / add-pet modes) ────────────────── */}
            {showMultiPetSection && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="p-1.5 bg-green-100 rounded-md">
                      <PawPrint className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    Pet Details
                    <span className="text-gray-400 font-normal normal-case tracking-normal">
                      ({petFields.length} pet{petFields.length !== 1 ? "s" : ""})
                    </span>
                  </h2>
                  <Button
                    type="button" variant="outline" size="sm"
                    className="gap-1.5 text-xs border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                    onClick={() => appendPet(emptyPet())}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Another Pet
                  </Button>
                </div>

                {petFields.map((field, idx) => (
                  <div key={field.id}>
                    {renderPetCard(idx, petFields.length > 1)}
                  </div>
                ))}
              </div>
            )}

            {/* ── Single Pet Section (edit-pet mode only) ────────────────── */}
            {showSinglePetSection && (
              <div className="p-5">
                <h2 className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-4 uppercase tracking-wider">
                  <div className="p-1.5 bg-green-100 rounded-md">
                    <PawPrint className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  Pet Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="pet_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Pet Name *</FormLabel>
                      <FormControl><Input placeholder="Pet name" {...field} className="text-sm" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormItem>
                    <FormLabel className="text-xs">Category</FormLabel>
                    <Select
                      value={form.watch("pet_category") || ""}
                      onValueChange={(v) => {
                        form.setValue("pet_category", v);
                        form.setValue("pet_type", "");
                        const cat = petCategories.find((p) => p.name === v);
                        setPetTypesByIndex({ 0: cat ? cat.types : [] });
                      }}
                    >
                      <SelectTrigger className="text-sm"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {petCategories.map((p) => <SelectItem key={p._id} value={p.name}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>

                  <FormItem>
                    <FormLabel className="text-xs">Type</FormLabel>
                    <Select
                      value={form.watch("pet_type") || ""}
                      onValueChange={(v) => form.setValue("pet_type", v)}
                      disabled={!form.watch("pet_category")}
                    >
                      <SelectTrigger className="text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {(petTypesByIndex[0] || []).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>

                  <FormField control={form.control} name="breed" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Breed</FormLabel>
                      <FormControl><Input placeholder="Breed" {...field} className="text-sm" /></FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="color" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Color</FormLabel>
                      <FormControl><Input placeholder="Color" {...field} className="text-sm" /></FormControl>
                    </FormItem>
                  )} />

                  <FormItem>
                    <FormLabel className="text-xs">Gender</FormLabel>
                    <Select
                      value={form.watch("sex") || ""}
                      onValueChange={(v) => form.setValue("sex", v as any)}
                    >
                      <SelectTrigger className="text-sm"><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>

                  <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Date of Birth</FormLabel>
                      <FormControl><Input type="date" {...field} className="text-sm" /></FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="is_active" render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-3 space-y-0 mt-4">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <FormLabel className="font-normal text-sm">Pet Active</FormLabel>
                    </FormItem>
                  )} />

                  <div className="sm:col-span-2 space-y-2">
                    <FormLabel className="text-xs block">Pet Picture</FormLabel>
                    <div className="flex items-center gap-3">
                      {form.watch("picture") && (
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                          <img src={form.watch("picture")} alt="Pet" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <Input type="file" accept="image/jpeg,image/png,image/webp" className="flex-1 text-sm"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setSelectedFiles((prev) => ({ ...prev, 0: file }));
                        }} />
                      <Button type="button" variant="outline" size="sm" className="flex-shrink-0 gap-1 text-xs"
                        onClick={() => handleUploadPicture(0)}
                        disabled={!selectedFiles[0] || isUploading[0]}>
                        <Upload className="h-3.5 w-3.5" />
                        {isUploading[0] ? "..." : "Upload"}
                      </Button>
                    </div>
                    {form.watch("picture") && <p className="text-xs text-green-600 font-medium">✓ Uploaded</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── Submit ─────────────────────────────────────────────────── */}
            <div className="flex justify-end gap-3 px-5 py-4 bg-gray-50/50 border-t border-gray-100">
              <Link href="/dashboard/patient/list">
                <Button type="button" variant="outline" className="border-gray-200 text-sm">Cancel</Button>
              </Link>
              <Button
                type="submit" disabled={isSubmitting}
                className="shadow-none text-black hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] min-w-[120px] text-sm"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  mode === "edit-owner" ? "Update Owner" :
                  mode === "edit-pet" ? "Update Pet" :
                  mode === "add-pet" ? `Add ${petFields.length} Pet${petFields.length !== 1 ? "s" : ""}` :
                  "Save Patient"
                )}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}