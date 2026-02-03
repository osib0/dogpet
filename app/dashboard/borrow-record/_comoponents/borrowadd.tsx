"use client";

import React, { useEffect, useState } from "react";
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

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const borrowFormSchema = z.object({
  member_id: z.string().min(1, "Member is required"),
  book_id: z.string().min(1, "Book is required"),
  borrow_date: z.string().min(1, "Borrow date is required"),
  return_date: z.string().min(1, "Return date is required"),
  status: z.enum(["borrowed", "returned", "late"]),
});

type BorrowFormValues = z.infer<typeof borrowFormSchema>;

interface BorrowRecordAddProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fetchRecords: () => void;
}

const BorrowRecordAdd = ({ open, onOpenChange,fetchRecords }: BorrowRecordAddProps) => {
  const [members, setMembers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);

  const form = useForm<BorrowFormValues>({
    resolver: zodResolver(borrowFormSchema),
    defaultValues: {
      member_id: "",
      book_id: "",
      borrow_date: format(new Date(), "yyyy-MM-dd"),
      return_date: "",
      status: "borrowed",
    },
  });

  const fetchData = async () => {
    try {
      const [membersRes, booksRes] = await Promise.all([
        fetch("/api/members/get"),
        fetch("/api/books/get"),
      ]);

      const membersData = await membersRes.json();
      const booksData = await booksRes.json();

      if (membersData.success) setMembers(membersData.data);
      if (booksData.success) setBooks(booksData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) fetchData();
  }, [open]);

  const onSubmit = async (values: BorrowFormValues) => {
    try {
      toast.loading("Adding borrow record...", { id: "addBorrow" });

      const res = await fetch("/api/borrow-record/add", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Borrow record added successfully", { id: "addBorrow" });
        form.reset();
        onOpenChange(false);
        fetchRecords()
      } else {
        toast.error(data?.message || "Failed to add record", {
          id: "addBorrow",
        });
      }
    } catch {
      toast.error("Something went wrong", { id: "addBorrow" });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="overflow-y-scroll overflow-x-hidden bg-white p-6 sm:max-w-lg ml-auto shadow-lg">
        <DrawerHeader className="p-0 mb-3 font-medium">
          <DrawerTitle>
            Borrow Book
          </DrawerTitle>
          <DrawerDescription>Fill in the issue details.</DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-2 text-sm"
          >
            {/* Member */}
            <FormField
              control={form.control}
              name="member_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members.map((m) => (
                        <SelectItem key={m._id} value={m._id}>
                          {m.fullName} ({m.enrollmentId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Book */}
            <FormField
              control={form.control}
              name="book_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select book" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {books.map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Issue Date */}
            <FormField
              control={form.control}
              name="borrow_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Issue Date</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}

                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) =>
                          field.onChange(format(date!, "yyyy-MM-dd"))
                        }
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="return_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}

                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(format(date!, "yyyy-MM-dd"))
                        }
                        disabled={(date) =>
                          date < new Date(format(new Date(), "yyyy-MM-dd"))
                        }
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="borrowed">Borrowed</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit" className="bg-blue-500 text-white">
                Issue Book
              </Button>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default BorrowRecordAdd;
