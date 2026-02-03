"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useEffect } from "react";

const schema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  enrollmentId: z.string().min(1),
  joinDate: z.string(),
  monthlyFee: z.number(),
  status: z.enum(["Active", "Inactive"]),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function MemberEdit({
  open,
  onOpenChange,
  member,
  refresh,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  member: any;
  refresh: () => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (member) {
      form.reset({
        ...member,
        joinDate: member.joinDate?.split("T")[0] ?? "",
      });
    }
  }, [member]);

  const onSubmit = async (values: FormValues) => {
    try {
      toast.loading("Updating...", { id: "edit" });

      const res = await fetch(`/api/members/update/${member._id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Updated", { id: "edit" });
        refresh();
        onOpenChange(false);
      } else toast.error(data.message, { id: "edit" });
    } catch {
      toast.error("Something went wrong", { id: "edit" });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="p-6 sm:max-w-2xl ml-auto">
        <DrawerHeader>
          <DrawerTitle>Edit Member</DrawerTitle>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 text-sm">

            <FormField name="fullName" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="enrollmentId" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment ID</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="joinDate" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Join Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="monthlyFee" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Fee</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="status" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField name="address" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <Textarea {...field} />
              </FormItem>
            )} />

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-500 text-white">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
