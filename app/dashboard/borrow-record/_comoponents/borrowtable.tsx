"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BorrowRecordAdd from "./borrowadd";
import toast from "react-hot-toast";
import { Calendar } from "lucide-react";

interface BorrowRecord {
  _id: string;
  member_id: { _id: string; fullName: string };
  book_id: { _id: string; title: string };
  borrow_date: string;
  return_date?: string;
  status: "borrowed" | "returned" | "overdue";
}

export default function BorrowCirculation() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "borrowed" | "returned" | "overdue">("all");
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/borrow-record/get");
      const json = await res.json();
      console.log(json,'asdsadas')
      if (json.success) setRecords(json.data);
    } catch {
      toast.error("Failed to load records");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleReturnBook = async (id: string) => {
    try {
      toast.loading("Returning book...", { id: "return" });

      const res = await fetch("/api/borrow-record/return", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowId: id }),
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Book returned", { id: "return" });
        fetchRecords();
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const filtered = records
    .filter((r) =>
      filter === "all" ? true : r.status === filter
    )
    .filter(
      (r) =>
        r.book_id?.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.member_id?.fullName?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto mt-5 px-4">
      {/* HEADER */}
      <div className="flex flex-wrap space-y-4 justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-medium">Book Circulation</h2>
          <p className="text-sm text-gray-500">
            {records.filter(r => r.status === "borrowed").length} currently issued •
            {records.filter(r => r.status === "overdue").length} overdue
          </p>
        </div>

        <div className="flex gap-3">
          <Input
            placeholder="Search by book or student..."
            className="w-30 md:w-45 lg:w-64 text-xs truncate"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button className="border-0 shadow-none bg-linear-to-r to-blue-600 from-blue-500 hover:from-blue-600 rounded-md  hover:to-blue-700 font-medium text-white text-xs cursor-pointer"
           onClick={() => setOpenAdd(true)}>
            + Issue New Book
          </Button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex bg-muted w-fit mb-6 p-1">
        {[
          { key: "all", label: `All (${records.length})` },
          { key: "borrowed", label: `Issued (${records.filter(r=>r.status==="borrowed").length})` },
          { key: "overdue", label: `Overdue (${records.filter(r=>r.status==="overdue").length})` },
          { key: "returned", label: `Returned (${records.filter(r=>r.status==="returned").length})` },
        ].map((tab: any) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-2 py-1 rounded-md text-xs font-normal text-gray-500 cursor-pointer ${
              filter === tab.key ? "bg-blue-500 text-white" : "bg-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((r) => (
          <div key={r._id} className="bg-white p-5 rounded-md">

            {/* Top row */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="font-medium">{r.book_id?.title}</div>
                <div className="text-xs text-gray-500">{r.member_id?.fullName}</div>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  r.status === "returned"
                    ? "bg-green-100 text-green-700"
                    : r.status === "overdue"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {r.status}
              </span>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 text-sm mt-2 gap-3">
              <div>
                <div className="text-gray-500">Issue Date</div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />{" "}
                  {new Date(r.borrow_date).toLocaleDateString()}
                </div>
              </div>

              <div>
                <div className="text-gray-500">Due Date</div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />{" "}
                  {r.return_date
                    ? new Date(r.return_date).toLocaleDateString()
                    : "--"}
                </div>
              </div>
            </div>

            {r.status === "returned" && (
              <div className="mt-3 text-sm">
                <span className="text-gray-500">Returned on</span>{" "}
                <span className="text-green-600 font-medium">
                  {new Date(r.return_date!).toLocaleDateString()}
                </span>
              </div>
            )}

            {r.status === "borrowed" && (
              <Button
                className="w-full mt-4 bg-blue-600 text-white"
                onClick={() => handleReturnBook(r._id)}
              >
                ⟳ Return Book
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* ADD DRAWER */}
      <BorrowRecordAdd open={openAdd} onOpenChange={setOpenAdd} fetchRecords={fetchRecords} />
    </div>
  );
}
