"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, SquarePen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// ✅ Type
export type Payment = {
    id: string
    status: "pending" | "processing" | "success" | "failed"
    role: "user" | "admin"
    email: string
    name: string
}

// ✅ Initial data
const initialData: Payment[] = [
    { id: "1", status: "success", email: "ken99@example.com", role: "user", name: "Aakib" },
    { id: "2", status: "success", email: "abe45@example.com", role: "admin", name: "Osib" },
    { id: "3", status: "processing", email: "monserrat44@example.com", role: "user", name: "Farhan" },
    { id: "4", status: "failed", email: "silas22@example.com", role: "user", name: "Hassan" },
]

export default function UserTable() {
    const [data, setData] = React.useState<Payment[]>(initialData)
    const [editingUser, setEditingUser] = React.useState<Payment | null>(null)
    const [open, setOpen] = React.useState(false)

    const handleDelete = (id: string) => {
        setData((prev) => prev.filter((item) => item.id !== id))
    }

    const handleEdit = (user: Payment) => {
        setEditingUser(user)
        setOpen(true)
    }

    const handleSave = () => {
        if (!editingUser) return
        setData((prev) =>
            prev.map((item) =>
                item.id === editingUser.id ? editingUser : item
            )
        )
        setOpen(false)
    }

    const columns: ColumnDef<Payment>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const user = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                                <SquarePen className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(user.id)}>
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 5 })

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
    })

    return (
        <div className="max-w-6xl mx-auto">
            {/* ✅ Filter */}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm bg-white"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* ✅ Table */}
            <div className="overflow-hidden rounded-md bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ✅ Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-1 flex items-center w-full">
                    <div className="bg-white rounded-xl flex items-center">
                        <Button
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="bg-transparent border-0 rounded-xl text-black hover:bg-[#f9f9f9]"
                        >
                            <ChevronLeft />
                        </Button>
                        {Array.from({ length: table.getPageCount() }).map((_, index) => (
                            <Button
                                key={index}
                                size="sm"
                                onClick={() => table.setPageIndex(index)}
                                className={
                                    table.getState().pagination.pageIndex === index
                                        ? "bg-[#f9f9f9] text-[#737373]"
                                        : "bg-transparent hover:bg-[#f9f9f9] text-[#737373]"
                                }
                            >
                                {index + 1}
                            </Button>
                        ))}
                        <Button
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="bg-transparent border-0 rounded-xl text-black hover:bg-[#f9f9f9]"
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
                <div className="text-muted-foreground flex-1 text-sm whitespace-nowrap text-right">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
            </div>

            {/* ✅ Edit Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <Input
                            value={editingUser?.name || ""}
                            onChange={(e) =>
                                setEditingUser((prev) => prev ? { ...prev, name: e.target.value } : null)
                            }
                            placeholder="Name"
                        />
                        <Input
                            value={editingUser?.email || ""}
                            onChange={(e) =>
                                setEditingUser((prev) => prev ? { ...prev, email: e.target.value } : null)
                            }
                            placeholder="Email"
                        />
                        <Input
                            value={editingUser?.role || ""}
                            onChange={(e) =>
                                setEditingUser((prev) => prev ? { ...prev, role: e.target.value as any } : null)
                            }
                            placeholder="Role"
                        />
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
