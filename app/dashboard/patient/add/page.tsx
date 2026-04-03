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
  pet_id: z.string().min(1, "Pet ID is required"),
  owner_name: z.string().min(1, "Owner name is required"),
  phone: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional(),
  age: z.string().optional(),
  pet_name: z.string().min(1, "Pet name is required"),
  breed: z.string().optional(),
  vaccine: z.string().optional(),
  visit_date: z.string().optional(),
  next_visit_note: z.string().optional(),
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
          {/* Pet ID */}
          <FormField
            control={form.control}
            name="pet_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Pet ID</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="PETS/123/2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Owner Name */}
          <FormField
            control={form.control}
            name="owner_name"
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

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Phone</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="9876543210" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Sex */}
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Sex</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Select sex" />
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

          {/* Pet Name */}
          <FormField
            control={form.control}
            name="pet_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Pet Name</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="LUCY" {...field} />
                </FormControl>
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
                <FormLabel className="text-xs">Breed</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="PIT BULL" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Vaccine */}
          <FormField
            control={form.control}
            name="vaccine"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Vaccine</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" placeholder="DHPP" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Visit Date */}
          <FormField
            control={form.control}
            name="visit_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Visit Date</FormLabel>
                <FormControl>
                  <Input className="h-7 text-xs" type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Next Visit Note */}
          <FormField
            control={form.control}
            name="next_visit_note"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel className="text-xs">Next Visit Note</FormLabel>
                <FormControl>
                  <Textarea className="text-xs" placeholder="Notes for next visit..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="col-span-4">
            <Button type="submit" className="h-8 text-xs">
              Save Patient
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}