"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Settings2,
  Trash2,
  Edit,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
import MemberAdd from "./memberadd";
import MemberEdit from "./memberedit";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Member {
  _id: string;
  librarian_id?: string;
  fullName: string;
  email: string;
  phone: string;
  enrollmentId: string;
  joinDate: string;
  monthlyFee: number;
  status: string;
  address?: string;
  createdAt?: string;
}

export default function MembersTable() {
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Fetch Members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/members/get`);
      const json = await res.json();

      if (json.success) setData(json.data);
      else toast.error(json.message || "Failed to fetch members");
    } catch {
      toast.error("Error fetching members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Delete Member
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const res = await fetch(`/api/members/delete/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Member deleted");
        setData((prev) => prev.filter((m) => m._id !== id));
      } else toast.error(json.message);
    } catch {
      toast.error("Something went wrong");
    }
  };

  // === TABLE STATE ===
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination,setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const savedSize = Number(localStorage.getItem("member_page_size"));
    if (savedSize) {
      setPagination((prev) => {
        return {...prev,pageSize:savedSize}
      })
    }
  },[])

  const columns: ColumnDef<Member>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
    },

    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },

    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "enrollmentId", header: "Enrollment ID" },
    {
      accessorKey: "joinDate",
      header: "Join Date",
      cell: ({ row }) => new Date(row.original.joinDate).toLocaleDateString(),
    },
    {
      accessorKey: "monthlyFee",
      header: "Fee",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
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
                setSelectedMember(row.original);
                setEditDialog(true);
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-500"
              onClick={() => handleDelete(row.original._id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
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
    onPaginationChange:setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
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
          placeholder="Filter by name..."
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("fullName")?.setFilterValue(e.target.value)
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

              localStorage.setItem("member_page_size", String(size));
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
              <Button variant="outline" className="px-1.5 py-1 md:px-3  md:py-2 border-0 shadow-none">
                <Settings2 className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c.id}
                    checked={c.getIsVisible()}
                    onCheckedChange={(v) => c.toggleVisibility(!!v)}
                  >
                    {c.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setAddDialog(true)}
            className="px-1.5 py-1 md:px-3  md:py-2 border-0 shadow-none bg-linear-to-r to-blue-600 from-blue-500 hover:from-blue-600 rounded-md  hover:to-blue-700 font-medium text-white text-xs cursor-pointer"
          >
            <Plus /> Add Member
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-md bg-white border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="text-sm font-medium">
                    {flexRender(h.column.columnDef.header, h.getContext())}
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
                <TableRow key={row.id} className="text-xs">
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
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between py-4">
        <div className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{table.getPageCount()}
          
        </div>

        <div className="flex items-center gap-2">
          {table.getCanPreviousPage() && (

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            className="text-xs font-medium"
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
          >
            Next <ChevronRight className="h-2 w-2" />
          </Button>
              )}
        </div>
      </div>

      {/* DIALOGS */}
      <MemberAdd open={addDialog} onOpenChange={setAddDialog} fetchMembers={fetchMembers} />

      <MemberEdit
        open={editDialog}
        onOpenChange={setEditDialog}
        member={selectedMember}
        refresh={fetchMembers}
      />
    </div>
  );
}
