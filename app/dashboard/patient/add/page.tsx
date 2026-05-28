"use client";

import { useForm } from "react-hook-form";
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
import { ArrowLeft, User, PawPrint, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

// ── Schema ────────────────────────────────────────────────────────────────────

const formSchema = z.object({
  // Owner fields
  owner_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  is_active: z.boolean().optional(),
  // Pet fields
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
type PageMode =
  | "new"          // new owner + first pet
  | "edit-owner"   // edit owner info only
  | "edit-pet"     // edit specific pet
  | "add-pet";     // add new pet to existing owner

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PatientAddEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get("edit");      // owner _id
  const petId = searchParams.get("pet_id");     // specific pet _id
  const ownerId = searchParams.get("owner_id"); // pre-link to existing owner (add-pet)

  // Determine mode
  const mode: PageMode =
    editId && petId ? "edit-pet" :
    editId && !petId ? "edit-owner" :
    ownerId ? "add-pet" :
    "new";

  const [pets, setPets] = useState<any[]>([]); // pet categories from /api/pets
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingOwner, setExistingOwner] = useState<{ owner_name: string; email: string; _id?: string } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_active: true,
      owner_name: "",
      pet_name: "",
      pet_category: "",
      pet_type: "",
      breed: "",
      color: "",
      phone: "",
      email: "",
      picture: "",
      dob: "",
    },
  });

  // ── Load pet categories ───────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/pets/get")
      .then((res) => res.json())
      .then((data) => { if (data.success) setPets(data.data); });
  }, []);

  // ── Load existing owner data when editing ─────────────────────────────────
  useEffect(() => {
    if (!editId || pets.length === 0) return;

    fetch(`/api/patients/get?id=${editId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) return;

        if (mode === "edit-owner") {
          // Only pre-fill owner fields
          form.reset({
            owner_name: data.owner_name || "",
            phone: data.phone || "",
            email: data.email || "",
            is_active: data.is_active ?? true,
          });
        } else if (mode === "edit-pet" && petId) {
          // Find specific pet in pets array
          const pet = data.pets?.find((p: any) => p._id === petId);
          if (pet) {
            form.reset({
              // keep owner fields too for display
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
            });
            if (pet.pet_category) {
              const selectedPetCategory = pets.find((p) => p.name === pet.pet_category);
              if (selectedPetCategory) setAvailableTypes(selectedPetCategory.types);
            }
          }
        }
      });
  }, [editId, petId, pets, mode]);

  // ── Load owner data when adding pet to existing owner ────────────────────
  useEffect(() => {
    if (!ownerId || pets.length === 0) return;
    fetch(`/api/patients/get?id=${ownerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.error) {
          setExistingOwner({
            _id: data._id,
            owner_name: data.owner_name || "",
            email: data.email || "",
          });
          form.setValue("owner_name", data.owner_name || "");
          form.setValue("phone", data.phone || "");
          form.setValue("email", data.email || "");
        }
      });
  }, [ownerId, pets]);

  // ── Phone lookup for new patients ─────────────────────────────────────────
  const watchedPhone = form.watch("phone");
  useEffect(() => {
    if (mode !== "new") return;
    if (!watchedPhone || watchedPhone.trim().length < 10) {
      setExistingOwner(null);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/patients/get?phone=${watchedPhone.trim()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.found && data.patient) {
          setExistingOwner({
            _id: data.patient._id,
            owner_name: data.patient.owner_name || "",
            email: data.patient.email || "",
          });
          form.setValue("owner_name", data.patient.owner_name || "");
          form.setValue("email", data.patient.email || "");
        } else {
          setExistingOwner(null);
        }
      })
      .catch((err) => { if (err.name !== "AbortError") console.error(err); });
    return () => controller.abort();
  }, [watchedPhone, mode]);

  // ── Category change ───────────────────────────────────────────────────────
  const onCategoryChange = (val: string) => {
    form.setValue("pet_category", val);
    form.setValue("pet_type", "");
    const selected = pets.find((p) => p.name === val);
    setAvailableTypes(selected ? selected.types : []);
  };

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleUploadPicture = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const authRes = await fetch("/api/upload-auth");
      if (!authRes.ok) throw new Error("Auth failed");
      const auth = await authRes.json();
      const ext = selectedFile.type.split("/")[1] || "jpg";
      const uploadRes = await upload({
        ...auth,
        file: selectedFile,
        fileName: `pet_${Date.now()}.${ext}`,
      });
      if (!uploadRes.url) throw new Error("Upload failed");
      form.setValue("picture", uploadRes.url);
      showToast("success", "Picture uploaded successfully!");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to upload picture");
    } finally {
      setIsUploading(false);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      let body: Record<string, any> = {};

      if (mode === "edit-owner") {
        body = {
          _id: editId,
          owner_name: data.owner_name,
          phone: data.phone,
          email: data.email,
          is_active: data.is_active,
        };
      } else if (mode === "edit-pet") {
        body = {
          _id: editId,
          pet_id: petId,
          pet_name: data.pet_name,
          pet_category: data.pet_category,
          pet_type: data.pet_type,
          breed: data.breed,
          color: data.color,
          sex: data.sex,
          dob: data.dob,
          picture: data.picture,
          is_active: data.is_active,
        };
      } else if (mode === "add-pet") {
        body = {
          _id: ownerId,
          pet_name: data.pet_name,
          pet_category: data.pet_category,
          pet_type: data.pet_type,
          breed: data.breed,
          color: data.color,
          sex: data.sex,
          dob: data.dob,
          picture: data.picture,
        };
      } else {
        // new — if existing owner found, add pet to them
        if (existingOwner?._id) {
          body = {
            _id: existingOwner._id,
            pet_name: data.pet_name,
            pet_category: data.pet_category,
            pet_type: data.pet_type,
            breed: data.breed,
            color: data.color,
            sex: data.sex,
            dob: data.dob,
            picture: data.picture,
          };
        } else {
          body = { ...data };
        }
      }

      const res = await fetch("/api/patients/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (res.ok) {
        const msg =
          mode === "edit-owner" ? "Owner updated successfully!" :
          mode === "edit-pet" ? "Pet updated successfully!" :
          mode === "add-pet" ? "Pet added successfully!" :
          "Patient saved successfully!";
        showToast("success", msg);
        setTimeout(() => router.push("/dashboard/patient/list"), 1200);
      } else {
        showToast("error", result.error || "Failed to save.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      showToast("error", "Failed to save. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Title & subtitle ──────────────────────────────────────────────────────
  const pageTitle =
    mode === "edit-owner" ? "Edit Owner Details" :
    mode === "edit-pet" ? "Edit Pet Details" :
    mode === "add-pet" ? "Add New Pet" :
    "New Patient";

  const pageSubtitle =
    mode === "edit-owner" ? "Update owner contact information" :
    mode === "edit-pet" ? "Update this pet's information" :
    mode === "add-pet" ? "Add another pet to existing owner" :
    "Register a new owner with their first pet";

  const showOwnerSection = mode === "new" || mode === "edit-owner";
  const showPetSection = mode === "new" || mode === "edit-pet" || mode === "add-pet";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 max-w-4xl mx-auto min-h-screen">

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-medium animate-in slide-in-from-top-2 duration-300",
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* Back button */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/patient/list">
          <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>
          <p className="text-xs text-gray-500">{pageSubtitle}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-0 text-sm">

            {/* ── Owner Section ────────────────────────────────────────────── */}
            {showOwnerSection && (
              <div className="p-6 border-b border-gray-100">
                <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-5 uppercase tracking-wider">
                  <div className="p-1.5 bg-blue-100 rounded-md">
                    <User className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  Owner Information
                </h2>

                {/* Existing owner banner */}
                {existingOwner && mode === "new" && (
                  <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <p className="font-bold text-sm text-green-800 flex items-center gap-1.5">
                        <span>✨</span> Existing Owner Found!
                      </p>
                      <p className="text-xs text-green-700 mt-0.5">
                        Phone is registered to <strong>{existingOwner.owner_name}</strong>.
                        We'll add this pet to their account.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-green-800 hover:bg-green-100 font-bold rounded-full"
                      onClick={() => {
                        form.setValue("phone", "");
                        setExistingOwner(null);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                )}

                {/* Add-pet mode — show owner name as read-only */}
                {(mode as string) === "add-pet" && existingOwner && (
                  <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
                      Adding pet for owner
                    </p>
                    <p className="font-semibold text-blue-900">{existingOwner.owner_name}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="owner_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter owner name"
                            {...field}
                            disabled={!!(existingOwner && mode === "new")}
                            className={cn(existingOwner && mode === "new" && "bg-gray-50 text-gray-500")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number"
                            {...field}
                            disabled={mode === "edit-owner" ? false : !!(existingOwner && mode === "new")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            {...field}
                            disabled={!!(existingOwner && mode === "new")}
                            className={cn(existingOwner && mode === "new" && "bg-gray-50 text-gray-500")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-3 space-y-0 mt-6">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">Active</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* ── Pet Section ──────────────────────────────────────────────── */}
            {showPetSection && (
              <div className="p-6">
                <h2 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-5 uppercase tracking-wider">
                  <div className="p-1.5 bg-green-100 rounded-md">
                    <PawPrint className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  Pet Details
                  {mode === "add-pet" && (
                    <span className="text-xs font-normal text-gray-500 ml-2 normal-case tracking-normal">
                      — New pet for existing owner
                    </span>
                  )}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Pet Name */}
                  <FormField
                    control={form.control}
                    name="pet_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter pet name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Pet Category */}
                  <FormField
                    control={form.control}
                    name="pet_category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Category</FormLabel>
                        <Select onValueChange={onCategoryChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pets.map((p) => (
                              <SelectItem key={p._id} value={p.name}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Pet Type */}
                  <FormField
                    control={form.control}
                    name="pet_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Type / Breed</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger disabled={!form.watch("pet_category")}>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTypes.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Breed */}
                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Breed Details (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter breed" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Color */}
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gender */}
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* DOB */}
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Pet Active (only for edit-pet) */}
                  {mode === "edit-pet" && (
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-3 space-y-0 mt-6">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal">Pet Active</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Picture Upload */}
                  <div className="space-y-2 md:col-span-2">
                    <FormLabel className="text-sm font-medium">Upload Pet Picture</FormLabel>
                    <div className="flex items-center gap-4">
                      {form.watch("picture") && (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                          <img
                            src={form.watch("picture")}
                            alt="Pet preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="flex-1"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setSelectedFile(file);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleUploadPicture}
                          disabled={!selectedFile || isUploading}
                          className="gap-1.5 flex-shrink-0"
                        >
                          <Upload className="h-4 w-4" />
                          {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                      </div>
                    </div>
                    {form.watch("picture") && (
                      <p className="text-xs text-green-600 font-medium">✓ Picture uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Submit ───────────────────────────────────────────────────── */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50/50 border-t border-gray-100">
              <Link href="/dashboard/patient/list">
                <Button type="button" variant="outline" className="border-gray-200">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="shadow-none text-black hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] min-w-[120px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  mode === "edit-owner" ? "Update Owner" :
                  mode === "edit-pet" ? "Update Pet" :
                  mode === "add-pet" ? "Add Pet" :
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