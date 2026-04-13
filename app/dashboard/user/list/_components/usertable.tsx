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
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, SquarePen, Trash2, Plus } from "lucide-react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// ✅ Type
export type User = {
    _id: string
    username: string
    email: string
    status: "ACTIVE" | "INACTIVE"
    role?: string
}

interface Role {
    _id: string
    name: string
}

export default function UserTable() {
    const [data, setData] = React.useState<User[]>([])
    const [editingUser, setEditingUser] = React.useState<User | null>(null)
    const [assigningRoleUser, setAssigningRoleUser] = React.useState<User | null>(null)
    const [open, setOpen] = React.useState(false)
    const [roleModalOpen, setRoleModalOpen] = React.useState(false)
    const [roles, setRoles] = React.useState<Role[]>([])
    const [selectedRole, setSelectedRole] = React.useState<string>("")
    const [roleLoading, setRoleLoading] = React.useState(false)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetchUsers()
        fetchRoles()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users-management")
            const result = await res.json()
            if (result.success) {
                setData(result.data || [])
            } else {
                setData([])
            }
        } catch (error) {
            console.error(error)
            setData([])
        } finally {
            setLoading(false)
        }
    }

    const fetchRoles = async () => {
        try {
            const res = await fetch("/api/roles")
            const result = await res.json()
            if (result.success) {
                setRoles(result.data || [])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure?")) {
            try {
                const res = await fetch(`/api/users-management/${id}`, { method: "DELETE" })
                const result = await res.json()
                if (result.success) {
                    setData((prev) => prev.filter((item) => item._id !== id))
                    alert("User deleted successfully")
                } else {
                    alert(result.message || "Failed to delete user")
                }
            } catch (error) {
                console.error(error)
                alert("Error deleting user")
            }
        }
    }

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setOpen(true)
    }

    const handleAssignRole = (user: User) => {
        setAssigningRoleUser(user)
        setSelectedRole("")
        setRoleModalOpen(true)
    }

    const handleSave = async () => {
        if (!editingUser) return
        try {
            const res = await fetch(`/api/users-management/${editingUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: editingUser.username,
                    email: editingUser.email,
                    status: editingUser.status,
                }),
            })
            const result = await res.json()
            if (result.success) {
                setData((prev) =>
                    prev.map((item) =>
                        item._id === editingUser._id ? result.data : item
                    )
                )
                setOpen(false)
                alert("User updated successfully")
            } else {
                alert(result.message || "Failed to update user")
            }
        } catch (error) {
            console.error(error)
            alert("Error updating user")
        }
    }

    const handleSaveRole = async () => {
        if (!assigningRoleUser || !selectedRole) {
            alert("Please select a role")
            return
        }

        setRoleLoading(true)
        try {
            const res = await fetch("/api/user-roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: assigningRoleUser._id,
                    role_id: selectedRole,
                }),
            })

            const result = await res.json()

            if (result.success) {
                alert("Role assigned successfully!")
                setRoleModalOpen(false)
                setAssigningRoleUser(null)
                setSelectedRole("")
                fetchUsers()
            } else {
                alert(result.message || "Failed to assign role")
            }
        } catch (error) {
            console.error(error)
            alert("Error assigning role")
        } finally {
            setRoleLoading(false)
        }
    }

    const columns: ColumnDef<User>[] = [
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
            accessorKey: "username",
            header: "Username",
            cell: ({ row }) => <div className="capitalize">{row.getValue("username")}</div>,
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
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => (
                <div className="capitalize px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                    {row.getValue("role") || "No Role"}
                </div>
            ),
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
                            <DropdownMenuItem onClick={() => handleAssignRole(user)}>
                                <Plus className="mr-2 h-4 w-4" /> Assign Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(user._id)}>
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
            {loading && <div className="text-center py-8">Loading users...</div>}
            {!loading && (
            <>
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
                            value={editingUser?.username || ""}
                            onChange={(e) =>
                                setEditingUser((prev) => prev ? { ...prev, username: e.target.value } : null)
                            }
                            placeholder="Username"
                        />
                        <Input
                            value={editingUser?.email || ""}
                            onChange={(e) =>
                                setEditingUser((prev) => prev ? { ...prev, email: e.target.value } : null)
                            }
                            placeholder="Email"
                        />
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ✅ Assign Role Modal */}
            <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Assign Role to {assigningRoleUser?.username}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role._id} value={role._id}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoleModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveRole} disabled={roleLoading} className="bg-zinc-700">
                            {roleLoading ? "Assigning..." : "Assign Role"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </>
            )}
        </div>
    )
}
