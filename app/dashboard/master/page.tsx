"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  CalendarRange,
  Search,
  Users,
  FileText,
  Syringe,
  FlaskConical,
  Pill,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface RecordItem {
  _id: string;
  owner_name: string;
  phone: string;
  pet_name: string;
  pet_category: string;
  type: "VACCINATION" | "TEST" | "MEDICATION";
  item_name: string;
  disease?: string;
  createdAt: string;
}

interface TypeBreakdown {
  type: string;
  count: number;
}

interface DailyData {
  date: string;
  newPatients: number;
  totalRecords: number;
  typeBreakdown: TypeBreakdown[];
  records: RecordItem[];
}

interface MonthlyData {
  month: string;
  newPatients: number;
  totalRecords: number;
  typeBreakdown: TypeBreakdown[];
  dailyBreakdown: { date: string; count: number }[];
  topPatients: { owner_name: string; phone: string; records: number }[];
}

interface DatewiseData {
  date: string;
  newPatients: number;
  totalRecords: number;
  typeBreakdown: TypeBreakdown[];
  records: RecordItem[];
}

interface MasterData {
  daily: DailyData;
  monthly: MonthlyData;
  datewise: DatewiseData;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  VACCINATION: "#72e3ad",
  TEST: "#60a5fa",
  MEDICATION: "#f472b6",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  VACCINATION: <Syringe className="w-3.5 h-3.5" />,
  TEST: <FlaskConical className="w-3.5 h-3.5" />,
  MEDICATION: <Pill className="w-3.5 h-3.5" />,
};

function typeBadge(type: string) {
  const color =
    type === "VACCINATION"
      ? "bg-green-100 text-green-700"
      : type === "TEST"
      ? "bg-blue-100 text-blue-700"
      : "bg-pink-100 text-pink-700";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${color}`}
    >
      {TYPE_ICONS[type]}
      {type}
    </span>
  );
}

// ─── STAT MINI CARD ───────────────────────────────────────────────────────────

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="rounded-xl border shadow-none">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2.5 bg-gray-100 rounded-xl shrink-0">{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <h3 className="text-xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── TYPE BREAKDOWN PILLS ─────────────────────────────────────────────────────

function TypeBreakdownRow({ breakdown }: { breakdown: TypeBreakdown[] }) {
  if (!breakdown.length)
    return <p className="text-xs text-muted-foreground">No records found.</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {breakdown.map((b) => (
        <div
          key={b.type}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: TYPE_COLORS[b.type] ?? "#e5e7eb" }}
        >
          {TYPE_ICONS[b.type]}
          <span>{b.type}</span>
          <Badge
            variant="secondary"
            className="ml-1 text-[10px] px-1.5 py-0 h-4"
          >
            {b.count}
          </Badge>
        </div>
      ))}
    </div>
  );
}

// ─── RECORDS TABLE ────────────────────────────────────────────────────────────

function RecordsTable({ records }: { records: RecordItem[] }) {
  if (!records.length)
    return (
      <div className="text-center py-10 text-sm text-muted-foreground">
        No records found for this period.
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">
              Owner
            </th>
            <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">
              Phone
            </th>
            <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">
              Pet
            </th>
            <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">
              Type
            </th>
            <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">
              Item
            </th>
            <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">
              Disease
            </th>
            <th className="text-right px-4 py-2.5 text-xs text-muted-foreground font-medium">
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{r.owner_name}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.phone}</td>
              <td className="px-4 py-3">
                <span className="font-medium">{r.pet_name}</span>
                {r.pet_category && r.pet_category !== "—" && (
                  <span className="text-muted-foreground text-xs ml-1">
                    ({r.pet_category})
                  </span>
                )}
              </td>
              <td className="px-4 py-3">{typeBadge(r.type)}</td>
              <td className="px-4 py-3 text-xs">{r.item_name}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {r.disease ?? "—"}
              </td>
              <td className="px-4 py-3 text-xs text-right text-gray-400">
                {format(new Date(r.createdAt), "hh:mm a")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
      <Skeleton className="h-10 w-56 rounded-full" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function MasterPage() {
  const [data, setData] = useState<MasterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [dateLoading, setDateLoading] = useState(false);

  const fetchData = useCallback(async (date?: string) => {
    const isDateFilter = !!date;
    if (isDateFilter) setDateLoading(true);
    else setLoading(true);

    try {
      const url = date
        ? `/api/dashboard/master?date=${date}`
        : "/api/dashboard/master";
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setDateLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDateSearch = () => {
    fetchData(selectedDate);
  };

  return (
    <div className="p-6 space-y-6 mt-5">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Master Report</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Daily, Monthly &amp; Date-wise records overview
        </p>
      </div>

      {/* TABS */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="rounded-xl">
          <TabsTrigger value="daily" className="gap-1.5 text-xs">
            <CalendarDays className="w-3.5 h-3.5" />
            Daily (Today)
          </TabsTrigger>
          <TabsTrigger value="monthly" className="gap-1.5 text-xs">
            <CalendarRange className="w-3.5 h-3.5" />
            Monthly
          </TabsTrigger>
          <TabsTrigger value="datewise" className="gap-1.5 text-xs">
            <Search className="w-3.5 h-3.5" />
            Date-wise
          </TabsTrigger>
        </TabsList>

        {/* ── DAILY TAB ── */}
        <TabsContent value="daily" className="mt-6 space-y-5">
          {loading ? (
            <LoadingSkeleton />
          ) : data ? (
            <>
              {/* Date label */}
              <p className="text-xs text-muted-foreground font-medium">
                Showing data for:{" "}
                <span className="text-black font-semibold">
                  {format(new Date(data.daily.date), "dd MMM yyyy")}
                </span>
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MiniStat
                  icon={<Users className="text-blue-600 w-5 h-5" />}
                  label="New Patients Today"
                  value={data.daily.newPatients}
                />
                <MiniStat
                  icon={<FileText className="text-purple-600 w-5 h-5" />}
                  label="Total Records Today"
                  value={data.daily.totalRecords}
                />
                <Card className="rounded-xl border shadow-none">
                  <CardHeader className="pb-1 pt-4 px-4">
                    <CardTitle className="text-xs font-medium text-muted-foreground">
                      Type Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <TypeBreakdownRow breakdown={data.daily.typeBreakdown} />
                  </CardContent>
                </Card>
              </div>

              {/* Records Table */}
              <Card className="rounded-xl border shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Today&apos;s Records
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    All medical records created today
                  </p>
                </CardHeader>
                <CardContent>
                  <RecordsTable records={data.daily.records} />
                </CardContent>
              </Card>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Failed to load data.</p>
          )}
        </TabsContent>

        {/* ── MONTHLY TAB ── */}
        <TabsContent value="monthly" className="mt-6 space-y-5">
          {loading ? (
            <LoadingSkeleton />
          ) : data ? (
            <>
              {/* Month label */}
              <p className="text-xs text-muted-foreground font-medium">
                Showing data for:{" "}
                <span className="text-black font-semibold">
                  {format(
                    new Date(data.monthly.month + "-01"),
                    "MMMM yyyy"
                  )}
                </span>
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MiniStat
                  icon={<Users className="text-blue-600 w-5 h-5" />}
                  label="New Patients This Month"
                  value={data.monthly.newPatients}
                />
                <MiniStat
                  icon={<FileText className="text-purple-600 w-5 h-5" />}
                  label="Total Records This Month"
                  value={data.monthly.totalRecords}
                />
                <Card className="rounded-xl border shadow-none">
                  <CardHeader className="pb-1 pt-4 px-4">
                    <CardTitle className="text-xs font-medium text-muted-foreground">
                      Type Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <TypeBreakdownRow breakdown={data.monthly.typeBreakdown} />
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Bar Chart */}
              {data.monthly.dailyBreakdown.length > 0 && (
                <Card className="rounded-xl border shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">
                      Day-wise Record Trend
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Number of records per day this month
                    </p>
                  </CardHeader>
                  <CardContent className="h-64 px-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.monthly.dailyBreakdown.map((d) => ({
                          day: format(new Date(d.date), "dd"),
                          count: d.count,
                        }))}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e5e7eb"
                        />
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "#6b7280" }}
                        />
                        <YAxis
                          allowDecimals={false}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "#6b7280" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {data.monthly.dailyBreakdown.map((_, i) => (
                            <Cell key={i} fill="#72e3ad" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Top Patients */}
              {data.monthly.topPatients.length > 0 && (
                <Card className="rounded-xl border shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      Top Patients This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto rounded-xl border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">
                              #
                            </th>
                            <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">
                              Owner Name
                            </th>
                            <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">
                              Phone
                            </th>
                            <th className="text-right px-4 py-2.5 text-xs text-muted-foreground font-medium">
                              Records
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.monthly.topPatients.map((p, i) => (
                            <tr
                              key={i}
                              className="border-b last:border-0 hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-muted-foreground text-xs">
                                {i + 1}
                              </td>
                              <td className="px-4 py-3 font-medium">
                                {p.owner_name}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {p.phone}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Badge variant="secondary">{p.records}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Failed to load data.</p>
          )}
        </TabsContent>

        {/* ── DATE-WISE TAB ── */}
        <TabsContent value="datewise" className="mt-6 space-y-5">
          {/* Date Picker */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                Select Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#72e3ad] bg-white"
              />
            </div>
            <button
              onClick={handleDateSearch}
              disabled={dateLoading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#72e3ad] hover:bg-[#4fe09a] text-sm font-medium transition-colors disabled:opacity-60"
            >
              <Search className="w-3.5 h-3.5" />
              {dateLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {loading || dateLoading ? (
            <LoadingSkeleton />
          ) : data ? (
            <>
              {/* Date label */}
              <p className="text-xs text-muted-foreground font-medium">
                Showing data for:{" "}
                <span className="text-black font-semibold">
                  {format(new Date(data.datewise.date), "dd MMM yyyy")}
                </span>
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MiniStat
                  icon={<Users className="text-blue-600 w-5 h-5" />}
                  label="New Patients"
                  value={data.datewise.newPatients}
                />
                <MiniStat
                  icon={<FileText className="text-purple-600 w-5 h-5" />}
                  label="Total Records"
                  value={data.datewise.totalRecords}
                />
                <Card className="rounded-xl border shadow-none">
                  <CardHeader className="pb-1 pt-4 px-4">
                    <CardTitle className="text-xs font-medium text-muted-foreground">
                      Type Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <TypeBreakdownRow breakdown={data.datewise.typeBreakdown} />
                  </CardContent>
                </Card>
              </div>

              {/* Records Table */}
              <Card className="rounded-xl border shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Records on{" "}
                    {format(new Date(data.datewise.date), "dd MMM yyyy")}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    All medical records for the selected date
                  </p>
                </CardHeader>
                <CardContent>
                  <RecordsTable records={data.datewise.records} />
                </CardContent>
              </Card>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Failed to load data.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
