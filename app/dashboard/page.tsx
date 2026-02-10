"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PawPrint,
  CalendarCheck,
  Stethoscope,
  DollarSign,
  Activity,
  Plus,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------- MOCK DATA (DOG / PET CLINIC) ---------------- */

const stats = {
  totalPets: 1248,
  todayAppointments: 18,
  activeDoctors: 6,
  monthlyRevenue: 42500,
};

const appointmentsByWeek = [
  { day: "Mon", value: 12 },
  { day: "Tue", value: 18 },
  { day: "Wed", value: 14 },
  { day: "Thu", value: 22 },
  { day: "Fri", value: 19 },
  { day: "Sat", value: 9 },
  { day: "Sun", value: 16 },
];

const recentAppointments = [
  {
    id: "1",
    pet: "Luna",
    owner: "Emma Watson",
    service: "Vaccination",
    status: "Upcoming",
    time: new Date(),
  },
  {
    id: "2",
    pet: "Max",
    owner: "James Anderson",
    service: "Dental Care",
    status: "Completed",
    time: new Date(),
  },
  {
    id: "3",
    pet: "Bella",
    owner: "Sophia Martinez",
    service: "Annual Check-up",
    status: "Upcoming",
    time: new Date(),
  },
  {
    id: "4",
    pet: "Charlie",
    owner: "Michael Brown",
    service: "Surgery",
    status: "In Progress",
    time: new Date(),
  },
];

/* ---------------- PAGE ---------------- */

export default function Page() {
  const { data: session, isPending } = authClient.useSession();

  /* ---------- LOADING SKELETON ---------- */
  if (isPending) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <div className="p-6">Not logged in</div>;
  }

  return (
    <div className="p-6 space-y-6 mt-5">
      {/* HEADER */}
      <div className="flex flex-wrap gap-4 justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back,{" "}
            <span className="capitalize">
              {session.user.name?.split(" ")[0]}
            </span>{" "}
            👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here’s what’s happening in your pet clinic today.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant={"outline"}
            size={"sm"}
            className="shadow-none text-xs cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Add Pet
          </Button>
          <Button
            variant={"outline"}
            size={"sm"}
            className="shadow-none text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<PawPrint className="text-blue-600" />}
          label="Total Pets"
          value={stats.totalPets}
          sub="+12% this month"
        />

        <StatCard
          icon={<CalendarCheck className="text-purple-600" />}
          label="Today's Appointments"
          value={stats.todayAppointments}
          sub="Stable"
        />

        <StatCard
          icon={<Stethoscope className="text-green-600" />}
          label="Active Doctors"
          value={stats.activeDoctors}
          sub="All available"
        />

        <StatCard
          icon={<DollarSign className="text-emerald-600" />}
          label="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          sub="+5.2% growth"
        />
      </div>

      {/* CHART + RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART */}
        <Card className="rounded-xl shadow-none border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Appointments This Week
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Daily appointment trend
            </p>
          </CardHeader>

          <CardContent className="h-65 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={appointmentsByWeek}
                margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
              >
                {/* Gradient */}
                <defs>
                  <linearGradient
                    id="appointmentsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#72e3ad" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#72e3ad" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* Grid */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                {/* Axis */}
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />

                {/* Tooltip */}
                <Tooltip
                  cursor={{ stroke: "#72e3ad", strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />

                {/* Area */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#72e3ad"
                  strokeWidth={3}
                  fill="url(#appointmentsGradient)"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RECENT APPOINTMENTS */}
        <Card className="rounded-xl shadow-none border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> Recent Appointments
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full">
              <div className="grid grid-cols-12 px-4 py-2 text-xs font-medium text-muted-foreground border-b">
                <div className="col-span-4">Pet</div>
                <div className="col-span-4">Owner</div>
                <div className="col-span-2">Service</div>
                <div className="col-span-2 text-right">Time</div>
              </div>

              {recentAppointments.map((a) => (
                <div
                  key={a.id}
                  className="grid grid-cols-12 px-4 py-3 text-sm border-b hover:bg-gray-50"
                >
                  <div className="col-span-4 font-medium">{a.pet}</div>
                  <div className="col-span-4 text-muted-foreground">
                    {a.owner}
                  </div>
                  <div className="col-span-2 text-xs">{a.service}</div>
                  <div className="col-span-2 text-right text-xs text-gray-400">
                    {format(a.time, "hh:mm a")}
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

/* ---------------- STAT CARD ---------------- */

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <Card className="rounded-xl border shadow-none">
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
