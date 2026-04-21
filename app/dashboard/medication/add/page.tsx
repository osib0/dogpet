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

const medicationSchema = z.object({
  disease: z.string().min(1, "Disease is required"),
  disease_type: z.string().min(1, "Disease type is required"),
  medicine_name: z.string().min(1, "Medicine name is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof medicationSchema>;

export default function AddMedicationPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      disease: "",
      disease_type: "",
      medicine_name: "",
      description: "",
    },
  });

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/medications", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      alert("Medication saved successfully!");
      form.reset();
    } else {
      alert("Failed to save medication");
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Add Medication</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 text-sm"
        >
          <FormField
            control={form.control}
            name="disease"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disease</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Parvovirus" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="disease_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disease Type</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Viral" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="medicine_name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Medicine Name</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Megavac-CC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description / Remarks</FormLabel>
                <FormControl>
                  <Textarea placeholder="Dosage, notes..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <Button type="submit">Save Medication</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
