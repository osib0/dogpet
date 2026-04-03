"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const patientSchema = z.object({
  ownerName: z.string().min(1, "Owner name is required"),
  petName: z.string().min(1, "Pet name is required"),

  type: z.string().optional(),
  breed: z.string().optional(),
  color: z.string().optional(),

  gender: z.enum(["male", "female"]).optional(),

  age: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),

  dateOfBirth: z.string().optional(),
  dateOfVisit: z.string().optional(),

  complaint: z.string().optional(),
  batchNo: z.string().optional(),

  sendSms: z.enum(["vaccination", "vaccinationType"]).optional(),

  vaccination: z.string().optional(),
  vaccinationType: z.string().optional(),

  disease: z.string().optional(),
  diseaseType: z.string().optional(),
  medication: z.string().optional(),

  diagnosis: z.string().optional(),

  duration: z.string().optional(),
  dueDate: z.string().optional(),

  email: z.string().email().optional(),
  remarks: z.string().optional(),
});

type FormData = z.infer<typeof patientSchema>;

export default function Page() {
  const form = useForm<FormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      sendSms: "vaccination", // default as shown in screenshot
    },
  });

  async function onSubmit(data: FormData) {
    await fetch("/api/patients/add", {
      method: "POST",
      body: JSON.stringify(data),
    });

    alert("Patient saved");
  }

  return (
    <div className="p-4 max-w-4xl">
      <h1 className="text-sm font-semibold mb-3">Patient Entry</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-4 gap-3 text-xs"
        >
          {/* Owner Name */}
          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Owner Name</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="SHUBHAM" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pet Name */}
          <FormField
            control={form.control}
            name="petName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Pet Name</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="LUCY" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Type</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="PUP" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Breed */}
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Breed</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="PIT BULL" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Color */}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Color</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Gender - Dropdown */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Age */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Age</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="2.5 MONTH" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Mobile */}
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Mobile No.</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="08875124601" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Address - Textarea (full width) */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel className="text-xs">Address</FormLabel>
                <FormControl>
                  <Textarea className="h-8 text-xs resize-none" placeholder="Enter address" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-xs">Date Of Birth</FormLabel>
                <FormControl>
                  <Input type="date" className="h-7 text-xs" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Date of Visit */}
          <FormField
            control={form.control}
            name="dateOfVisit"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-xs">Date Of Visit</FormLabel>
                <FormControl>
                  <Input type="date" className="h-7 text-xs" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Current Complaint - Textarea (full width) */}
          <FormField
            control={form.control}
            name="complaint"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel className="text-xs">Current Complaint</FormLabel>
                <FormControl>
                  <Textarea className="h-8 text-xs resize-none" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Batch No. */}
          <FormField
            control={form.control}
            name="batchNo"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-xs">Batch No.</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Send SMS Radio Buttons (full width) */}
          <FormField
            control={form.control}
            name="sendSms"
            render={({ field }) => (
              <FormItem className="col-span-2 flex flex-col">
                <FormLabel className="text-xs">Send SMS</FormLabel>
                <div className="flex items-center gap-6 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="vaccination"
                      checked={field.value === "vaccination"}
                      onChange={() => field.onChange("vaccination")}
                      className="accent-blue-600"
                    />
                    Send Sms for vaccination
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="vaccinationType"
                      checked={field.value === "vaccinationType"}
                      onChange={() => field.onChange("vaccinationType")}
                      className="accent-blue-600"
                    />
                    Send Sms for vaccination type
                  </label>
                </div>
              </FormItem>
            )}
          />

          {/* Select Vaccination - Input (can be replaced with Select later) */}
          <FormField
            control={form.control}
            name="vaccination"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-xs">Select Vaccination</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="Select Vaccination" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Select Vaccination Type - Input (can be replaced with Select later) */}
          <FormField
            control={form.control}
            name="vaccinationType"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-xs">Select Vaccination Type</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="Select Vaccination Type" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Medications Section */}
          <div className="col-span-4 mt-2 mb-1 text-xs font-medium text-gray-600">Medications</div>

          {/* Select Disease */}
          <FormField
            control={form.control}
            name="disease"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-xs">Select Disease</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="Select Disease" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Select Disease Type */}
          <FormField
            control={form.control}
            name="diseaseType"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-xs">Select Disease Type</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="Select Disease Type" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Medication */}
          <FormField
            control={form.control}
            name="medication"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel className="text-xs">Medication</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Diagnosis - Textarea (full width) */}
          <FormField
            control={form.control}
            name="diagnosis"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel className="text-xs">Diagnosis</FormLabel>
                <FormControl>
                  <Textarea className="h-8 text-xs resize-none" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-xs">Duration</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="0" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-xs">Due date</FormLabel>
                <FormControl>
                  <Input type="date" className="h-7 text-xs" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Email Id */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel className="text-xs">Email Id</FormLabel>
                <FormControl>
                  <Input type="email" className="h-7 text-xs" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Remarks - Textarea (full width) */}
          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel className="text-xs">Remarks</FormLabel>
                <FormControl>
                  <Textarea className="h-16 text-xs resize-none" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="h-8 text-xs col-span-1 mt-4"
            variant="outline"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}