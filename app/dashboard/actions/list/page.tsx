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
import Link from "next/link"

export type Action = {
    _id: string
    name: string
    description: string
    status: "ACTIVE" | "INACTIVE"
    module_id: { _id: string; page_name: string }
}

export default function ActionTable() {
    const [data, setData] = React.useState<Action[]>([])
    const [editingAction, setEditingAction] = React.useState<Action | null>(null)
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetchActions()
    }, [])

    const fetchActions = async () => {
        try {
            const res = await fetch("/api/actions")
            const result = await res.json()
            if (result.success) {
                setData(result.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure?")) {
            try {
                const res = await fetch(`/api/actions/${id}`, { method: "DELETE" })
                const result = await res.json()
                if (result.success) {
                    setData((prev) => prev.filter((item) => item._id !== id))
                    alert("Action deleted successfully")
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    const handleEdit = (action: Action) => {
        setEditingAction(action)
        setOpen(true)
    }

    const handleSave = async () => {
        if (!editingAction) return
        try {
            const res = await fetch(`/api/actions/${editingAction._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingAction),
            })
            const result = await res.json()
            if (result.success) {
                setData((prev) =>
                    prev.map((item) =>
                        item._id === editingAction._id ? editingAction : item
                    )
                )
                setOpen(false)
                alert("Action updated successfully")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const columns: ColumnDef<Action>[] = [
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
            accessorKey: "module_id",
            header: "Module",
            cell: ({ row }) => {
                const module = row.getValue("module_id") as any
                return <div className="text-sm">{module?.page_name || "-"}</div>
            },
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => <div className="text-sm">{row.getValue("description") || "-"}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <div className={`capitalize px-2 py-1 rounded text-sm ${
                    row.getValue("status") === "ACTIVE" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                }`}>
                    {row.getValue("status")}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const action = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(action)}>
                                <SquarePen className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(action._id)}>
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

    if (loading) return <div className="text-center py-8">Loading...</div>

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Actions</h1>
                <Link href="/dashboard/actions/add">
                    <Button className="bg-zinc-700">+ Add Action</Button>
                </Link>
            </div>

            {/* Filter */}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter actions..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm bg-white"
                />
            </div>

            {/* Table */}
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
                                    No actions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>

            {/* Edit Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Edit Action</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <Input
                            value={editingAction?.name || ""}
                            onChange={(e) =>
                                setEditingAction((prev) => prev ? { ...prev, name: e.target.value } : null)
                            }
                            placeholder="Action name"
                        />
                        <Input
                            value={editingAction?.description || ""}
                            onChange={(e) =>
                                setEditingAction((prev) => prev ? { ...prev, description: e.target.value } : null)
                            }
                            placeholder="Description"
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
