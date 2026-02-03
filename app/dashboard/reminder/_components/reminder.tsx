// "use client";

// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   SortingState,
//   useReactTable,
//   VisibilityState,
//   ColumnFiltersState,
// } from "@tanstack/react-table";

// import {
//   ArrowUpDown,
//   ChevronLeft,
//   ChevronRight,
//   Settings2,
//   CheckSquare,
//   UserCheck,
//   UserX,
//   RotateCcw,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import toast from "react-hot-toast";
// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Separator } from "@/components/ui/separator";

// interface Member {
//   _id: string;
//   librarian_id?: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   enrollmentId: string;
//   joinDate: string;
//   monthlyFee: number;
//   status: string;
//   address?: string;
//   createdAt?: string;
// }

// export default function MemberReminders() {
//   const [data, setData] = useState<Member[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [reminderType, setReminderType] = useState<"fee" | "custom" | "">("");
//   const [sendMethod, setSendMethod] = useState<"email" | "sms" | "both">("email");
//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");

//   const fetchMembers = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/members/get`);
//       const json = await res.json();
//       if (json.success) setData(json.data);
//       else toast.error(json.message || "Failed to fetch members");
//     } catch {
//       toast.error("Error fetching members");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   useEffect(() => {
//     if (reminderType === "fee") {
//       setSubject("Monthly Library Fee Reminder");
//       setMessage(
//         "Dear Member,\n\nThis is a reminder that your monthly library fee is due. Please make the payment at your earliest convenience to continue enjoying our services.\n\nThank you!"
//       );
//     } else if (reminderType === "custom") {
//       setSubject("");
//       setMessage("");
//     }
//   }, [reminderType]);

//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   useEffect(() => {
//     const savedSize = Number(localStorage.getItem("reminder_page_size"));
//     if (savedSize) {
//       setPagination((prev) => ({ ...prev, pageSize: savedSize }));
//     }
//   }, []);

//   // Handle Send Reminder
//   const handleSend = async () => {
//     if (!reminderType || !subject || !message || Object.keys(rowSelection).length === 0) {
//       return toast.error("Please fill all fields and select at least one member");
//     }

//     if (!confirm(`Are you sure you want to send reminders to ${Object.keys(rowSelection).length} members?`)) {
//       return;
//     }

//     const selectedIds = Object.keys(rowSelection).map((index) => data[Number(index)]._id);

//     try {
//       const res = await fetch(`/api/reminders/send`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ids: selectedIds,
//           type: reminderType,
//           method: sendMethod,
//           subject,
//           message,
//         }),
//       });

//       const json = await res.json();

//       if (json.success) {
//         toast.success("Reminders sent successfully");
//         setRowSelection({}); 
//       } else {
//         toast.error(json.message || "Failed to send reminders");
//       }
//     } catch {
//       toast.error("Something went wrong");
//     }
//   };

//   const columns: ColumnDef<Member>[] = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={table.getIsAllPageRowsSelected()}
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       accessorKey: "fullName",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           className="p-0 hover:bg-transparent"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Full Name
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },
//     { accessorKey: "email", header: "Email" },
//     { accessorKey: "phone", header: "Phone" },
//     { accessorKey: "enrollmentId", header: "Enrollment ID" },
//     {
//       accessorKey: "joinDate",
//       header: "Join Date",
//       cell: ({ row }) => new Date(row.original.joinDate).toLocaleDateString(),
//     },
//     {
//       accessorKey: "monthlyFee",
//       header: "Monthly Fee",
//     },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => (
//         <span
//           className={`px-2 py-1 rounded-full text-xs font-medium ${
//             row.original.status === "active"
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
//         </span>
//       ),
//     },
//   ];

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//       pagination,
//     },
//     enableRowSelection: true,
//     onPaginationChange: setPagination,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   });

//   // Additional Features: Quick Select Buttons
//   const handleQuickSelect = (type: "all" | "active" | "inactive") => {
//     const newSelection: Record<string, boolean> = {};
//     table.getRowModel().rows.forEach((row) => {
//       if (
//         type === "all" ||
//         (type === "active" && row.original.status === "active") ||
//         (type === "inactive" && row.original.status === "inactive")
//       ) {
//         newSelection[row.id] = true;
//       }
//     });
//     setRowSelection(newSelection);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4">
//       <Card className="shadow-none rounded-none overflow-hidden">
//         <CardHeader className="bg-gray-50/50 border-b border-gray-200 px-6">
//           <CardTitle className="text-xl font-semibold text-gray-900">Send Reminders to Members</CardTitle>
//           <p className="text-sm text-gray-500 mt-1">
//             Configure your reminder, select members, and send via email, SMS, or both.
//           </p>
//         </CardHeader>

//         <CardContent className="p-6 space-y-8">
//           {/* Reminder Form */}
//           <div className="space-y-4">
//             <h3 className="text-base font-semibold text-gray-800">Reminder Configuration</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-1">
//                 <Label htmlFor="reminder-type" className="text-sm font-medium text-gray-700">Reminder Type</Label>
//                 <Select value={reminderType} onValueChange={(v: "fee" | "custom") => setReminderType(v)}>
//                   <SelectTrigger id="reminder-type" className="h-9">
//                     <SelectValue placeholder="Select type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectLabel>Type</SelectLabel>
//                       <SelectItem value="fee">Monthly Fee Reminder</SelectItem>
//                       <SelectItem value="custom">Custom Message</SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-1">
//                 <Label htmlFor="send-method" className="text-sm font-medium text-gray-700">Send Method</Label>
//                 <Select value={sendMethod} onValueChange={(v: "email" | "sms" | "both") => setSendMethod(v)}>
//                   <SelectTrigger id="send-method" className="h-9">
//                     <SelectValue placeholder="Select method" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectLabel>Method</SelectLabel>
//                       <SelectItem value="email">Email</SelectItem>
//                       <SelectItem value="sms">SMS</SelectItem>
//                       <SelectItem value="both">Both</SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-1 md:col-span-2">
//                 <Label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</Label>
//                 <Input
//                   id="subject"
//                   placeholder="e.g. Monthly Library Fee Reminder"
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value)}
//                   className="h-9"
//                 />
//               </div>

//               <div className="space-y-1 md:col-span-2">
//                 <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
//                 <Textarea
//                   id="message"
//                   rows={5}
//                   placeholder="Write reminder message here..."
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   className="min-h-25"
//                 />
//               </div>
//             </div>
//           </div>

//           <Separator className="bg-gray-200" />

//           {/* Members Selection */}
//           <div className="space-y-4">
//             <h3 className="text-base font-semibold text-gray-800">Select Members</h3>

//             {/* Quick Select Buttons */}
//             <div className="flex flex-wrap gap-2">
//               <Button variant="outline" size="sm" className="h-8 px-3 text-sm" onClick={() => handleQuickSelect("all")}>
//                 <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
//                 All
//               </Button>
//               <Button variant="outline" size="sm" className="h-8 px-3 text-sm" onClick={() => handleQuickSelect("active")}>
//                 <UserCheck className="h-3.5 w-3.5 mr-1.5" />
//                 Active
//               </Button>
//               <Button variant="outline" size="sm" className="h-8 px-3 text-sm" onClick={() => handleQuickSelect("inactive")}>
//                 <UserX className="h-3.5 w-3.5 mr-1.5" />
//                 Inactive
//               </Button>
//               <Button variant="outline" size="sm" className="h-8 px-3 text-sm" onClick={() => setRowSelection({})}>
//                 <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
//                 Clear
//               </Button>
//             </div>

//             {/* Table Top Bar */}
//             <div className="flex flex-wrap items-center justify-between gap-4 py-3">
//               <div className="flex flex-wrap items-center gap-2 flex-1">
//                 <Input
//                   placeholder="Filter name..."
//                   value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
//                   onChange={(e) => table.getColumn("fullName")?.setFilterValue(e.target.value)}
//                   className="h-8 w-40 sm:w-50"
//                 />
//                 <Input
//                   placeholder="Filter email..."
//                   value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
//                   onChange={(e) => table.getColumn("email")?.setFilterValue(e.target.value)}
//                   className="h-8 w-40 sm:w-50"
//                 />
//                 <Input
//                   placeholder="Filter phone..."
//                   value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
//                   onChange={(e) => table.getColumn("phone")?.setFilterValue(e.target.value)}
//                   className="h-8 w-40 sm:w-50"
//                 />
//                 <Select
//                   value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
//                   onValueChange={(value) =>
//                     table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
//                   }
//                 >
//                   <SelectTrigger className="h-8 w-35">
//                     <SelectValue placeholder="Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectLabel>Status</SelectLabel>
//                       <SelectItem value="all">All</SelectItem>
//                       <SelectItem value="active">Active</SelectItem>
//                       <SelectItem value="inactive">Inactive</SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Select
//                   value={String(pagination.pageSize)}
//                   onValueChange={(value) => {
//                     const size = Number(value);
//                     setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }));
//                     localStorage.setItem("reminder_page_size", String(size));
//                   }}
//                 >
//                   <SelectTrigger className="h-8 w-20">
//                     <SelectValue placeholder="Rows" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectLabel>Rows</SelectLabel>
//                       <SelectItem value="10">10</SelectItem>
//                       <SelectItem value="20">20</SelectItem>
//                       <SelectItem value="30">30</SelectItem>
//                       <SelectItem value="40">40</SelectItem>
//                       <SelectItem value="50">50</SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="outline" size="sm" className="h-8 px-2">
//                       <Settings2 className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-48">
//                     {table
//                       .getAllColumns()
//                       .filter((c) => c.getCanHide())
//                       .map((c) => (
//                         <DropdownMenuCheckboxItem
//                           key={c.id}
//                           checked={c.getIsVisible()}
//                           onCheckedChange={(v) => c.toggleVisibility(!!v)}
//                           className="capitalize"
//                         >
//                           {c.id}
//                         </DropdownMenuCheckboxItem>
//                       ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>

//             {/* TABLE */}
//             <div className="border border-gray-200 rounded-lg overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   {table.getHeaderGroups().map((hg) => (
//                     <TableRow key={hg.id} className="bg-gray-50/50">
//                       {hg.headers.map((h) => (
//                         <TableHead key={h.id} className="text-gray-700 font-medium text-sm px-4 py-2">
//                           {flexRender(h.column.columnDef.header, h.getContext())}
//                         </TableHead>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableHeader>

//                 <TableBody>
//                   {loading ? (
//                     <TableRow>
//                       <TableCell colSpan={columns.length} className="text-center py-10 text-gray-500">
//                         Loading members...
//                       </TableCell>
//                     </TableRow>
//                   ) : table.getRowModel().rows.length ? (
//                     table.getRowModel().rows.map((row) => (
//                       <TableRow key={row.id} className="hover:bg-gray-50 transition-colors border-b last:border-0">
//                         {row.getVisibleCells().map((cell) => (
//                           <TableCell key={cell.id} className="text-xs text-gray-900 px-4 py-3">
//                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={columns.length} className="text-center py-10 text-gray-500">
//                         No members found.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* PAGINATION */}
//             <div className="flex items-center justify-between py-4 text-xs text-gray-600">
//               <div>
//                 Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} | Selected:{" "}
//                 {Object.keys(rowSelection).length} members
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   className="h-8 px-3 text-xs disabled:opacity-50"
//                   onClick={() => table.previousPage()}
//                   disabled={!table.getCanPreviousPage()}
//                 >
//                   <ChevronLeft className="h-2 w-2 mr-1" /> Prev
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="h-8 text-xs px-3 disabled:opacity-50"
//                   onClick={() => table.nextPage()}
//                   disabled={!table.getCanNextPage()}
//                 >
//                   Next <ChevronRight className="h-2 w-2 ml-1" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Send Button */}
//           <div className="flex justify-end pt-4 border-t border-gray-200">
//             <Button 
//               onClick={handleSend} 
//               className="bg-blue-600 text-xs hover:bg-blue-700 text-white font-medium h-9 px-4 rounded-md"
//               disabled={Object.keys(rowSelection).length === 0}
//             >
//               Send Reminder ({Object.keys(rowSelection).length})
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

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
  Settings2,
  CheckSquare,
  UserCheck,
  UserX,
  RotateCcw,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface Member {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  enrollmentId: string;
  joinDate: string;
  monthlyFee: number;
  status: "active" | "inactive";
}

export default function MemberReminders() {
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const [reminderType, setReminderType] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Fetch members
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/members/get");
        const json = await res.json();
        if (json.success) setData(json.data);
        else toast.error(json.message || "Failed to fetch members");
      } catch {
        toast.error("Error fetching members");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Prefill for fee reminder
  useEffect(() => {
    if (reminderType === "fee") {
      setSubject("Monthly Library Fee");
      setMessage(
        "Dear Member,\n\nThis is a reminder that your monthly library fee is due. Please make the payment at your earliest convenience.\n\nThank you."
      );
    } else if (reminderType === "custom") {
      setSubject("");
      setMessage("");
    }
  }, [reminderType]);

  // Persist page size
  useEffect(() => {
    const saved = localStorage.getItem("reminder_page_size");
    if (saved) {
      setPagination((p) => ({ ...p, pageSize: Number(saved) }));
    }
  }, []);

  // Send Email Reminder
  const handleSend = async () => {
    if (!subject || !message || !Object.keys(rowSelection).length) {
      return toast.error("Select members and fill subject & message");
    }

    if (!confirm(`Send email to ${Object.keys(rowSelection).length} members?`)) return;

    const ids = Object.keys(rowSelection).map(
      (index) => data[Number(index)]._id
    );

    try {
      const res = await fetch("/api/reminders/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, subject, message }),
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Email reminders sent");
        setRowSelection({});
      } else {
        toast.error(json.message || "Failed to send emails");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const columns: ColumnDef<Member>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      ),
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Full Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "enrollmentId", header: "Enrollment ID" },
    {
      accessorKey: "joinDate",
      header: "Join Date",
      cell: ({ row }) =>
        new Date(row.original.joinDate).toLocaleDateString(),
    },
    { accessorKey: "monthlyFee", header: "Monthly Fee" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.status}
        </span>
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
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const quickSelect = (type: "all" | "active" | "inactive") => {
    const selection: Record<string, boolean> = {};
    table.getRowModel().rows.forEach((row) => {
      if (
        type === "all" ||
        row.original.status === type
      ) {
        selection[row.id] = true;
      }
    });
    setRowSelection(selection);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Card className="rounded-none shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail size={20}/> Email Reminders</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Form */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2">Reminder Type</Label>
              <Select value={reminderType} onValueChange={setReminderType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fee">Monthly Fee</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label className="mb-2">Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <Label className="mb-2">Message</Label>
              <Textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2 flex-wrap max-w-100">
            <Button className="flex-1 shadow-none cursor-pointer" variant="outline" onClick={() => quickSelect("all")}>
              <CheckSquare className="h-4 w-4 mr-1" /> <span className="w-full">All</span>
            </Button>
            <Button className="flex-1 shadow-none cursor-pointer" variant="outline" onClick={() => quickSelect("active")}>
              <UserCheck className="h-4 w-4 mr-1" /> <span className="w-full">Active</span>
            </Button>
            <Button className="flex-1 shadow-none cursor-pointer" variant="outline" onClick={() => quickSelect("inactive")}>
              <UserX className="h-4 w-4 mr-1" /> <span className="w-full">Inactive</span>
            </Button>
            <Button className="flex-1 shadow-none cursor-pointer" variant="outline" onClick={() => setRowSelection({})}>
              <RotateCcw className="h-4 w-4 mr-1" /> <span className="w-full">Clear</span>
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length}>Loading...</TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button className="bg-blue-500 hover:bg-blue-700 cursor-pointer" onClick={handleSend} disabled={!Object.keys(rowSelection).length}>
              Send Email ({Object.keys(rowSelection).length})
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
