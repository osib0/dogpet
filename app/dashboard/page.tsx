"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Book,
  Users,
  ClipboardList,
  TrendingUp,
  Activity,
  UserPlus,
  Plus,
  BookOpen,
  RotateCw,
  AlertTriangle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BookType {
  _id: string;
  title: string;
  availableCopies: number;
}

interface MemberType {
  _id: string;
  fullName: string;
}

interface BorrowType {
  _id: string;
  book_id: { title: string };
  member_id: { fullName: string };
  borrow_date: string;
  status: "borrowed" | "returned" | "overdue";
  createdAt: string;
}

export default function Page() {
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<BookType[]>([]);
  const [members, setMembers] = useState<MemberType[]>([]);
  const [records, setRecords] = useState<BorrowType[]>([]);

  const fetchDashboard = async () => {
    try {
      const [b, m, r] = await Promise.all([
        fetch("/api/books/get").then((r) => r.json()),
        fetch("/api/members/get").then((r) => r.json()),
        fetch("/api/borrow-record/get").then((r) => r.json()),
      ]);

      if (b.success) setBooks(b.data);
      if (m.success) setMembers(m.data);
      if (r.success) setRecords(r.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isPending) return <div>Loading session…</div>;
  if (!session) return <div>Not logged in</div>;

  const totalBooks = books.length;
  const availableBooks = books.reduce(
    (sum, b) => sum + (b.availableCopies || 0),
    0
  );

  const activeStudents = members.length;
  const issuedBooks = records.filter((r) => r.status === "borrowed").length;
  const overdueBooks = records.filter((r) => r.status === "overdue").length;

  const issuesByMonth = Array.from({ length: 12 }).map((_, i) => {
    const count = records.filter(
      (r) => new Date(r.borrow_date).getMonth() === i
    ).length;

    return {
      month: format(new Date(2025, i, 1), "MMM"),
      value: count,
    };
  });

  const recent = [...records]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="p-6 space-y-6 mt-5">
      {/* HEADER */}
      <div className="w-full flex flex-wrap space-y-5 justify-between items-start">
        {/* LEFT — WELCOME */}
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back, <span className="capitalize">{session.user.name?.split(" ")[0]}</span> 👋
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Here’s what’s happening in your library today.
          </p>
        </div>

        {/* RIGHT — ACTION BUTTONS */}
        <div className="flex gap-3">
          <Link href={"/dashboard/member"}>
            <Button className="cursor-pointer" variant={'outline'}>
              <UserPlus />
              Add Member
            </Button>
          </Link>
          <Link href={"/dashboard/books"}>
            <Button className="cursor-pointer bg-blue-500 hover:bg-blue-600">
              <Plus />
              Add Book
            </Button>
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Book className="text-indigo-600" />}
          label="Total Books"
          value={totalBooks}
          sub={`${availableBooks} available`}
        />

        <StatCard
          icon={<Users className="text-purple-600" />}
          label="Active Students"
          value={activeStudents}
          sub={`${activeStudents} total enrolled`}
        />

        <StatCard
          icon={<ClipboardList className="text-yellow-600" />}
          label="Books Issued"
          value={issuedBooks}
          sub={overdueBooks === 0 ? "All on time" : `${overdueBooks} overdue`}
        />

        <StatCard
          icon={<TrendingUp className="text-green-600" />}
          label="This Month Issues"
          value={
            records.filter(
              (r) =>
                new Date(r.borrow_date).getMonth() === new Date().getMonth()
            ).length
          }
          sub="Updated live"
        />
      </div>

      {/* CHART + ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART */}
        <Card className="rounded-xl shadow-none border-0">
          <CardHeader>
            <CardTitle>Issues Over Time</CardTitle>
          </CardHeader>
          <CardContent style={{ height: "270px" }}>
            <ResponsiveContainer>
              <LineChart data={issuesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ACTIVITY */}
          <Card className="rounded-xl shadow-none border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> Recent Activity
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {recent.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 px-4">
                No activity yet.
              </p>
            )}

            <div className="w-full">
              {/* TABLE HEADER */}
              <div className="grid grid-cols-12 px-4 py-2 text-xs font-medium text-muted-foreground border-b">
                <div className="col-span-6">Activity</div>
                <div className="col-span-3">Member</div>
                <div className="col-span-3 text-right">Time</div>
              </div>

              {/* ROWS */}
              {recent.map((r) => (
                <div
                  key={r._id}
                  className="grid grid-cols-12 px-4 py-3 text-sm border-b hover:bg-gray-50 transition"
                >
                  {/* Activity */}
                  <div className="col-span-6 flex items-center gap-2">
                    {r.status === "borrowed" && (
                      <>
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span>
                          Book issued: <b className="ms-1 text-zinc-600 font-medium">{r.book_id.title}</b>
                        </span>
                      </>
                    )}

                    {r.status === "returned" && (
                      <>
                        <RotateCw className="h-4 w-4 text-green-600" />
                        <span>
                          Returned: <b>{r.book_id.title}</b>
                        </span>
                      </>
                    )}

                    {r.status === "overdue" && (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span>
                          Overdue: <b>{r.book_id.title}</b>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Member */}
                  <div className="col-span-3 text-muted-foreground">
                    {r.member_id.fullName}
                  </div>

                  {/* Time */}
                  <div className="col-span-3 text-right text-xs text-gray-400">
                    {format(new Date(r.createdAt), "MMM d, h:mm a")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: any;
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <Card className="rounded-xl border-0 shadow-none">
      <CardContent className="p-5 flex items-center gap-4">
        <div className="p-3 bg-gray-100 rounded-xl">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-xs text-gray-400">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}
