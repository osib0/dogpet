"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

const patientSchema = z.object({
  owner_name: z.string().min(1, "Owner name is required"),
  pet_name: z.string().min(1, "Pet name is required"),
  type: z.string().optional(),
  breed: z.string().optional(),
  color: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"]).optional(),
  age: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dob: z.string().optional(),
  visit_date: z.string().optional(),
  current_complaint: z.string().optional(),
  batch_no: z.string().optional(),
  send_sms_vaccination: z.boolean().optional(),
  send_sms_vaccination_type: z.boolean().optional(),
  medications: z.array(z.object({
    disease: z.string().optional(),
    disease_type: z.string().optional(),
    medicine: z.string().optional(),
  })).optional(),
  diagnosis: z.string().optional(),
  duration: z.string().optional(),
  due_date: z.string().optional(),
  email: z.string().optional(),
  remarks: z.string().optional(),
});

type FormData = z.infer<typeof patientSchema>;

export default function Page() {
  const [medicationsData, setMedicationsData] = useState<any[]>([]);
  const [diseases, setDiseases] = useState<string[]>([]);
  const [diseaseTypes, setDiseaseTypes] = useState<string[]>([]);
  
  const form = useForm<FormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      send_sms_vaccination: false,
      send_sms_vaccination_type: false,
      medications: [{ disease: "", disease_type: "", medicine: "" }],
    },
  });

  useEffect(() => {
    async function fetchMeds() {
      const res = await fetch("/api/medications");
      if (res.ok) {
        const data = await res.json();
        setMedicationsData(data.data || []);
        
        // Extract unique diseases
        const uniqueDiseases = Array.from(new Set(data.data.map((m: any) => m.disease)));
        setDiseases(uniqueDiseases as string[]);
      }
    }
    fetchMeds();
  }, []);

  const handleDiseaseChange = (val: string, index: number) => {
    const meds = form.getValues("medications") || [];
    meds[index] = { ...meds[index], disease: val, disease_type: "" };
    form.setValue("medications", meds);

    // Filter disease types for selected disease
    const filteredTypes = medicationsData
      .filter(m => m.disease === val)
      .map(m => m.disease_type);
    setDiseaseTypes(Array.from(new Set(filteredTypes)));
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
    <div className="p-4 max-w-5xl bg-[#f0f0f0] min-h-screen">
      <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
        <h1 className="text-sm font-semibold mb-3 bg-[#c7915b] text-white py-1 px-2 uppercase">Patient Entry</h1>
        
        <p className="text-xs text-red-500 mb-4">PRESS F1 FOR SELECTION OF PATIENT</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 text-xs"
          >
            {/* Top Section with Image Placeholder and Fields */}
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-gray-600 text-white flex items-center justify-center text-center font-bold">
                Photo Not Available
              </div>

              <div className="flex-1 flex flex-col gap-3">
                {/* Owner Name */}
                <FormField
                  control={form.control}
                  name="owner_name"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="w-24">Owner Name</FormLabel>
                      <FormControl>
                        <Input className="h-7 max-w-sm bg-yellow-300 uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pet Name, Type, Breed, Color */}
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="pet_name"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel>Pet Name</FormLabel>
                        <FormControl>
                          <Input className="h-7 w-28 uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Input className="h-7 w-20 uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel>Breed</FormLabel>
                        <FormControl>
                          <Input className="h-7 w-28 uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input className="h-7 w-20 uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-3 mt-2">
              <FormLabel className="mt-2">Gender</FormLabel>
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-7 bg-[#ffffcc] text-xs">
                            <SelectValue placeholder="FEMALE" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">MALE</SelectItem>
                          <SelectItem value="FEMALE">FEMALE</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input className="h-7 w-28 uppercase" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>Mobile No.</FormLabel>
                      <FormControl>
                        <Input className="h-7 w-32" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormLabel className="mt-2">Address</FormLabel>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="h-7 max-w-xl" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormLabel className="mt-2">Date Of Birth</FormLabel>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="date" className="h-7 w-40" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visit_date"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>Date Of Visit</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-7 w-40" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormLabel className="mt-2">Current Complaint</FormLabel>
              <FormField
                control={form.control}
                name="current_complaint"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="h-7 max-w-xl" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormLabel className="mt-2">Batch No.</FormLabel>
              <FormField
                control={form.control}
                name="batch_no"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="h-7 w-48" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div></div>
              <div className="flex gap-6 mt-1">
                <FormField
                  control={form.control}
                  name="send_sms_vaccination"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal text-xs">Send Sms for vaccination</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="send_sms_vaccination_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal text-xs">Send Sms for vaccination type</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <FormLabel className="mt-2">Medications</FormLabel>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <FormField
                    control={form.control}
                    name="medications.0.disease"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={(v) => handleDiseaseChange(v, 0)} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-7 w-36 text-xs text-red-500 font-semibold border-none bg-transparent shadow-none p-0">
                              <SelectValue placeholder="Select Disease" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {diseases.map(d => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medications.0.disease_type"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-7 w-40 text-xs text-red-500 font-semibold border-none bg-transparent shadow-none p-0">
                              <SelectValue placeholder="Select DiseaseType" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {diseaseTypes.map(dt => (
                              <SelectItem key={dt} value={dt}>{dt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medications.0.medicine"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="h-7 w-64" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <button type="button" className="text-red-400 underline text-left w-fit mt-1">Reset Selected Vaccination</button>
              </div>

              <FormLabel className="mt-2">Diagnosis</FormLabel>
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="h-7 max-w-xl" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormLabel className="mt-2">Duration</FormLabel>
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="h-7 w-16" defaultValue="0" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>Due date</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-7 w-36" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel>Email Id</FormLabel>
                      <FormControl>
                        <Input className="h-7 w-48" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormLabel className="mt-2">Remarks</FormLabel>
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="h-7 max-w-xl" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div></div>
              <div className="flex gap-4 mt-4 max-w-xl justify-end">
                <Button type="button" variant="outline" className="h-8 text-xs">
                  Check Another Patient
                </Button>
                <Button type="submit" className="h-8 text-xs">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}