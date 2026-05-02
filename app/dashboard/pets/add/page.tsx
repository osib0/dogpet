"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";

const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  types: z.array(z.string()).min(1, "At least one type is required"),
});

type FormData = z.infer<typeof petSchema>;

export default function AddPetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [newType, setNewType] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      types: [],
    },
  });

  useEffect(() => {
    if (editId) {
      fetch(`/api/pets/get`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const pet = data.data.find((p: any) => p._id === editId);
            if (pet) {
              form.reset({
                name: pet.name,
                types: pet.types,
              });
            }
          }
        });
    }
  }, [editId, form]);

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/pets/add", {
      method: "POST",
      body: JSON.stringify({ ...data, id: editId }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert(editId ? "Pet updated successfully!" : "Pet saved successfully!");
      router.push("/dashboard/pets/list");
    } else {
      alert("Failed to save pet.");
    }
  }

  const addType = () => {
    if (newType.trim()) {
      const currentTypes = form.getValues("types");
      if (!currentTypes.includes(newType.trim())) {
        form.setValue("types", [...currentTypes, newType.trim()]);
      }
      setNewType("");
    }
  };

  const removeType = (typeToRemove: string) => {
    const currentTypes = form.getValues("types");
    form.setValue("types", currentTypes.filter(t => t !== typeToRemove));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold bg-[#c7915b] text-white py-2 px-3 uppercase">
            {editId ? "Edit Pet" : "Add New Pet"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Category Name * (e.g. Dog, Cat)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pet name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Pet Types / Breeds *</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    placeholder="Enter type and click add"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addType();
                      }
                    }}
                  />
                  <Button type="button" onClick={addType} size="icon" variant={'secondary'} className="shadow-none cursor-pointer">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch("types").map((type, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm border"
                    >
                      {type}
                      <button
                        type="button"
                        onClick={() => removeType(type)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {form.formState.errors.types && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.types.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" className="shadow-none text-black text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer">
                  {editId ? "Update Pet" : "Save Pet"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
