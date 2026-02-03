"use client";

import React, { useEffect } from "react";
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

const bookFormSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().min(1),
  category: z.string().min(1),
  publisher: z.string().min(1),
  year: z.number().min(1000).max(new Date().getFullYear()),
  totalCopies: z.number().min(1),
  availableCopies: z.number().min(1).max(1),
  price: z.number().min(0),
  description: z.string().min(10),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

interface BooksEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookData: any | null;
  fetchBooks: () => void;
}

const BooksEdit: React.FC<BooksEditProps> = ({
  open,
  onOpenChange,
  bookData,
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

  // preload data
  useEffect(() => {
    if (bookData) {
      form.reset({
        title: bookData.title ?? "",
        author: bookData.author ?? "",
        isbn: bookData.isbn ?? "",
        category: bookData.category ?? "",
        publisher: bookData.publisher ?? "",
        year: bookData.year ?? new Date().getFullYear(),
        totalCopies: bookData.totalCopies ?? 1,
        availableCopies: bookData.availableCopies ?? 1,
        price: bookData.price ?? 0,
        description: bookData.description ?? "",
      });
    }
  }, [bookData, form]);

  const onSubmit = async (values: BookFormValues) => {
    try {
      toast.loading("Updating book...", { id: "updateBook" });

      const res = await fetch(`/api/books/update/${bookData?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Book updated successfully", { id: "updateBook" });
        fetchBooks();
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to update", { id: "updateBook" });
      }
    } catch {
      toast.error("Something went wrong", { id: "updateBook" });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="bg-white sm:max-w-4xl ml-auto p-6 shadow-2xl rounded-none">
        <DrawerHeader>
          <DrawerTitle className="text-sm font-semibold">
            Edit Book
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            Update book details below.
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-2 text-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Title *</FormLabel>
                    <FormControl>
                      <Input className="text-xs" {...field} />
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
                      <Input className="text-xs" {...field} />
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
                      <Input className="text-xs" {...field} />
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
                      <Input className="text-xs" {...field} />
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
                      <Input className="text-xs" {...field} />
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
                        className="text-xs"
                        {...field}
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
                        className="text-xs"
                        {...field}
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
                        className="text-xs"
                        {...field}
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
                    <FormLabel className="text-xs">Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="text-xs"
                        {...field}
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-xs min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                className="text-xs"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-blue-500 text-white text-xs"
              >
                Update Book
              </Button>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default BooksEdit;
