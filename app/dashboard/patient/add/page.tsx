"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  upload,
} from "@imagekit/next";
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

const patientSchema = z.object({
  owner_name: z.string().optional(),
  pet_name: z.string().optional(),
  pet_category: z.string().optional(),
  pet_type: z.string().optional(),
  // type: z.enum(["PUP", "ADULT"]).optional(),
  breed: z.string().optional(),
  color: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional(),
  dob: z.string().optional(),
  phone: z.string().optional(),
  is_active: z.boolean().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  picture: z.string().optional(),
});

type FormData = z.infer<typeof patientSchema>;

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [pets, setPets] = useState<any[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      // type: "PUP",
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

  useEffect(() => {
    fetch("/api/pets/get")
      .then(res => res.json())
      .then(data => {
        if (data.success) setPets(data.data);
      });
  }, []);

  useEffect(() => {
    if (editId && pets.length > 0) {
      fetch(`/api/patients/get?id=${editId}`)
        .then(res => res.json())
        .then(data => {
          // The API now returns a single patient object if id is provided
          const patient = data;
          if (patient && !patient.error) {
            form.reset({
              ...patient,
              email: patient.email || "",
            });
            if (patient.pet_category) {
              const selectedPet = pets.find(p => p.name === patient.pet_category);
              if (selectedPet) setAvailableTypes(selectedPet.types);
            }
          }
        });
    }
  }, [editId, pets, form]);

  const onCategoryChange = (val: string) => {
    form.setValue("pet_category", val);
    form.setValue("pet_type", "");
    const selectedPet = pets.find(p => p.name === val);
    if (selectedPet) {
      setAvailableTypes(selectedPet.types);
    } else {
      setAvailableTypes([]);
    }
  };

  const authenticator = async () => {
    const res = await fetch("/api/upload-auth");
    if (!res.ok) throw new Error("Auth failed");
    return res.json();
  };

  const handleUploadPicture = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    setIsUploading(true);
    try {
      const auth = await authenticator();
      const ext = selectedFile.type.split("/")[1] || "jpg";

      const uploadRes = await upload({
        ...auth,
        file: selectedFile,
        fileName: `patient_${Date.now()}.${ext}`,
      });

      if (!uploadRes.url) {
        throw new Error("Image upload failed");
      }

      form.setValue("picture", uploadRes.url);
      alert("Picture uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload picture");
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch("/api/patients/add", {
        method: "POST",
        body: JSON.stringify({ ...data, _id: editId }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (res.ok) {
        alert(editId ? "Patient updated successfully!" : "Patient saved successfully!");
        if (!editId) form.reset();
        router.push("/dashboard/patient/list");
      } else {
        alert(result.error || "Failed to save patient.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to save patient. Please check your connection.");
    }
  }

  return (
    <div className="p-4 max-w-5xl min-h-screen mx-auto">
      <div className="bg-white p-6 rounded-sm border">
        <h1 className="text-sm font-semibold mb-6 bg-[#c7915b] text-white py-2 px-3 uppercase">
          {editId ? "Edit Patient" : "Patient Entry"}
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 text-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner Name */}
              <FormField
                control={form.control}
                name="owner_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter owner name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* Pet Category (Added) */}
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
                          <SelectItem key={p._id} value={p.name}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pet Type (Added) */}
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
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pet Type (PUP/ADULT) */}
              {/* <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Group</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PUP">Pup</SelectItem>
                        <SelectItem value="ADULT">Adult</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Breed (Keeping it but naming it specific breed if needed) */}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              {/* Date of Birth */}
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

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Id</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Picture Upload */}
              <div className="space-y-2">
                <FormLabel className="text-sm font-medium">Upload Picture</FormLabel>
                <div className="flex items-center gap-4">
                  {form.watch("picture") && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                      <img 
                        src={form.watch("picture")} 
                        alt="Patient preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
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
                      >
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                    {form.watch("picture") && (
                      <p className="text-xs text-green-600 font-medium">Picture uploaded successfully!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Is Active */}
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0 mt-8">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Active (Y/N)</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button type="submit" className="shadow-none text-black text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}