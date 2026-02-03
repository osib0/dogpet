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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const currentYear = new Date().getFullYear();

const bookFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title too long"),

    author: z
      .string()
      .trim()
      .min(2, "Author name is required")
      .max(80),

    isbn: z
      .string()
      .trim()
      .regex(/^(97(8|9))?\d{9}(\d|X)$/, "Invalid ISBN number")
      .optional()
      .or(z.literal("")),

    category: z
      .string()
      .trim()
      .min(2, "Category is required")
      .max(50),

    publisher: z
      .string()
      .trim()
      .min(2, "Publisher is required")
      .max(60),

    year: z
      .number()
      .int("Year must be an integer")
      .min(1500, "Year is too old")
      .max(currentYear, "Future year not allowed"),

    totalCopies: z
      .number()
      .int("Must be a whole number")
      .min(1, "At least 1 copy required")
      .max(10000, "Too many copies"),

    availableCopies: z
      .number()
      .int("Must be a whole number")
      .min(0, "Cannot be negative"),

    price: z
      .number()
      .min(0, "Price cannot be negative")
      .max(1000000, "Price too high"),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description too long"),
  })
  .superRefine((data, ctx) => {
    if (data.availableCopies > data.totalCopies) {
      ctx.addIssue({
        path: ["availableCopies"],
        message: "Available copies cannot exceed total copies",
        code: z.ZodIssueCode.custom,
      });
    }
  });


type BookFormValues = z.infer<typeof bookFormSchema>;

interface BooksaddProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fetchBooks: () => void;
}



const Booksadd: React.FC<BooksaddProps> = ({
  open,
  onOpenChange,
  fetchBooks,
}) => {
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      category: "",
      publisher: "",
      year: new Date().getFullYear(),
      totalCopies: 1,
      availableCopies: 1,
      price: 0,
      description: "",
    },
  });

  const onSubmit = async (values: BookFormValues) => {
    try {
      toast.loading("Adding book...", { id: "addBook" });

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null)
          formData.append(key, value as any);
      });

      const res = await fetch(`/api/books/add`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Book added successfully", { id: "addBook" });
        form.reset();
        onOpenChange(false);
        fetchBooks();
      } else {
        toast.error(data?.message || "Failed to add book", {
          id: "addBook",
        });
      }
    } catch (err) {
      toast.error("Something went wrong", { id: "addBook" });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="overflow-y-scroll overflow-x-hidden bg-white sm:max-w-4xl ml-auto p-6 shadow-2xl rounded-none">
        <DrawerHeader>
          <DrawerTitle className="text-sm font-semibold">
            Add New Book
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            Enter book details below.
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-2 text-sm"
          >
            {/* Two-column fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Title *</FormLabel>
                    <FormControl>
                      <Input className="text-xs shadow-none"
                        placeholder="Enter Your Title"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Author *</FormLabel>
                    <FormControl>
                      <Input className="text-xs shadow-none"
                        placeholder="Enter Your Author"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">ISBN</FormLabel>
                    <FormControl>
                      <Input className="shadow-none text-xs"
                        placeholder="ISBN ID"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Publisher</FormLabel>
                    <FormControl>
                      <Input className="text-xs shadow-none"
                        placeholder="Publisher Year"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Category</FormLabel>
                    <FormControl>
                      <Input className="text-xs shadow-none"
                        placeholder="Book Category"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        min={0}
                        step={1}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="text-xs shadow-none"
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalCopies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Total Copies</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        min={0}
                        step={1}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="text-xs shadow-none"
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableCopies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Available</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        min={0}
                        step={1}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="text-xs shadow-none"
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        min={0}
                        step={1}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="text-xs shadow-none"
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shadow-none min-h-20 text-xs"
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                className="text-xs"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white text-xs cursor-pointer">
                Add Book
              </Button>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default Booksadd;
