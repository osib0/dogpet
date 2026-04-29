"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
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
  owner_name: z.string().min(1, "Owner name is required"),
  pet_name: z.string().min(1, "Pet name is required"),
  type: z.enum(["PUP", "ADULT"]).optional(),
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
  const form = useForm<FormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      type: "PUP",
      is_active: true,
      owner_name: "",
      pet_name: "",
      breed: "",
      color: "",
      phone: "",
      email: "",
      picture: "",
      dob: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    const res = await fetch("/api/patients/add", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Patient saved successfully!");
      form.reset();
    } else {
      alert("Failed to save patient.");
    }
  }

  return (
    <div className="p-4 max-w-5xl bg-[#f0f0f0] min-h-screen mx-auto">
      <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
        <h1 className="text-sm font-semibold mb-6 bg-[#c7915b] text-white py-2 px-3 uppercase">Patient Entry</h1>

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

              {/* Pet Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              />

              {/* Breed */}
              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed</FormLabel>
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
              <Button type="submit" className="w-full md:w-auto px-8">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}