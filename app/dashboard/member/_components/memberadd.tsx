"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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

const studentSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  enrollmentId: z.string().min(1, "Enrollment ID is required"),
  joinDate: z.string().min(1, "Join date is required"),
  monthlyFee: z.number().min(0, "Fee must be numeric"),
  status: z.enum(["Active", "Inactive"]),
  address: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface MemberAddProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fetchMembers: () => void;
}

const MemberAdd = ({ open, onOpenChange,fetchMembers }: MemberAddProps) => {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      enrollmentId: "",
      joinDate: new Date().toISOString().split("T")[0],
      monthlyFee: 0,
      status: "Active",
      address: "",
    },
  });

  const onSubmit = async (values: StudentFormValues) => {
    try {
      toast.loading("Adding student...", { id: "addStudent" });

      const res = await fetch(`/api/members/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Student added successfully", { id: "addStudent" });
        form.reset();
        onOpenChange(false);
        fetchMembers()
      } else {
        toast.error(data?.message || "Failed to add student", {
          id: "addStudent",
        });
      }
    } catch (e) {
      toast.error("Something went wrong", { id: "addStudent" });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="overflow-y-scroll overflow-x-hidden bg-white p-6 sm:max-w-2xl ml-auto rounded-none shadow-xl">
        <DrawerHeader>
          <DrawerTitle className="text-sm font-semibold">
            Add New Student
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            Enter student details below.
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-2 text-sm"
          >
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      className="text-xs shadow-none"
                      placeholder="Enter full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 2-column section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Email *</FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs shadow-none"
                        placeholder="Enter Your Email"
                        {...field}
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
                    <FormLabel className="text-xs">Phone</FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs shadow-none"
                        placeholder="Enter Your Phone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enrollmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Enrollment ID *</FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs shadow-none"
                        placeholder="STU-XXXX"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Join Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="text-xs shadow-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Monthly Fee</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="text-xs shadow-none"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs shadow-none">Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs shadow-none">Address</FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-xs min-h-20"
                      placeholder="Student address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                className="text-xs"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit" className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white text-xs">
                Add Student
              </Button>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default MemberAdd;
