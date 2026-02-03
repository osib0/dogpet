"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Trash2,
  Settings2,
  Edit,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import toast from "react-hot-toast";
import Booksadd from "./booksadd";
import BooksEdit from "./booksedit";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  year: number;
  totalCopies: number;
  availableCopies: number;
  price: number;
  description: string;
}
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Value } from "@radix-ui/react-select";

export default function BooksTable() {
  const [data, setData] = React.useState<Book[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [bookadd, setBookadd] = React.useState(false);
  const [bookedit, setBookedit] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/books/get`);
      const json = await res.json();

      if (json.success) {
        setData(json.data);
      } else {
        toast.error(json.message || "Failed to fetch books");
      }
    } catch (err) {
      toast.error("Error fetching books");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const res = await fetch(`/api/books/delete/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Book deleted successfully");
        setData((prev) => prev.filter((b) => b._id !== id));
      } else {
        toast.error(json.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  // ===== TABLE STATE =====
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    const savedSize = Number(localStorage.getItem("books_page_size"));
    if (savedSize) {
      setPagination((prev) => ({
        ...prev,
        pageSize: savedSize,
      }));
    }
  }, []);

  // ===== COLUMNS =====
  const columns: ColumnDef<Book>[] = [
    // Row Number column
    {
      id: "index",
      header: "#",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
      enableHiding: false,
    },

    { accessorKey: "title", header: "Title" },
    { accessorKey: "author", header: "Author" },
    { accessorKey: "isbn", header: "ISBN" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "publisher", header: "Publisher" },
    { accessorKey: "year", header: "Year" },
    { accessorKey: "totalCopies", header: "Total" },
    { accessorKey: "availableCopies", header: "Available" },
    { accessorKey: "price", header: "Price (₹)" },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedBook(row.original);
                setBookedit(true);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-500"
              onClick={() => handleDelete(row.original._id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between py-4 gap-2">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white border-0 shadow-none"
        />

        <div className="flex items-center gap-2">
          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) => {
              const size = Number(value);

              setPagination((prev) => ({
                ...prev,
                pageSize: size,
                pageIndex: 0, // size change pe first page
              }));

              localStorage.setItem("books_page_size", String(size));
            }}
          >
            <SelectTrigger className="w-25 md:35 lg:w-45 bg-white border-0 shadow-none">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Row</SelectLabel>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-0 px-1.5 py-1 md:px-3  md:py-2  shadow-none">
                <Settings2 className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    className="capitalize"
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setBookadd(true)}
            className="px-1.5 py-1 md:px-3  md:py-2 border-0 shadow-none bg-linear-to-r to-blue-600 from-blue-500 hover:from-blue-600 rounded-md  hover:to-blue-700 font-medium text-white text-xs cursor-pointer"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Book
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-md bg-white border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap font-medium text-sm">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-xs"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between py-4">
        <div className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of
          {table.getPageCount()}
          {/* {table.getPageCount()} */}
        </div>

        <div className="flex items-center gap-2">
          {table.getCanPreviousPage() && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              className="text-xs font-medium"
              // disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-2 w-2" /> Previous
            </Button>
          )}
          {table.getCanNextPage() && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              className="text-xs font-medium"
              // disabled={!table.getCanNextPage()}
            >
              Next <ChevronRight className="h-2 w-2" />
            </Button>
          )}
        </div>
      </div>

      {/* MODALS */}
      <Booksadd
        open={bookadd}
        onOpenChange={setBookadd}
        fetchBooks={fetchBooks}
      />

      <BooksEdit
        open={bookedit}
        onOpenChange={setBookedit}
        bookData={selectedBook}
        fetchBooks={fetchBooks}
      />
    </div>
  );
}
