import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient.model";
import MedicalRecord from "@/models/medical-record.model";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // ── Total unique patient owners ────────────────────────────────────────
    const totalPatients = await Patient.countDocuments({ is_active: true });

    // ── Count total embedded pets ──────────────────────────────────────────
    const petCountAgg = await Patient.aggregate([
      { $match: { is_active: true } },
      { $project: { petCount: { $size: { $ifNull: ["$pets", []] } } } },
      { $group: { _id: null, total: { $sum: "$petCount" } } },
    ]);
    const totalPets = petCountAgg[0]?.total ?? 0;

    // ── Total medical records (all time) ──────────────────────────────────
    const totalRecords = await MedicalRecord.countDocuments();

    // ── This month vs last month records ─────────────────────────────────
    const thisMonthRecords = await MedicalRecord.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const lastMonthRecords = await MedicalRecord.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
    });
    const recordGrowth =
      lastMonthRecords === 0
        ? 100
        : Math.round(((thisMonthRecords - lastMonthRecords) / lastMonthRecords) * 100);

    // ── This month vs last month patients ─────────────────────────────────
    const thisMonthPatients = await Patient.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const lastMonthPatients = await Patient.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
    });
    const patientGrowth =
      lastMonthPatients === 0
        ? 100
        : Math.round(
            ((thisMonthPatients - lastMonthPatients) / lastMonthPatients) * 100
          );

    // ── Recent patients (last 5) ──────────────────────────────────────────
    const recentPatients = await Patient.find({ is_active: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("owner_name phone pets pet_name pet_category createdAt");

    // ── Weekly record trend (last 7 days) ────────────────────────────────
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyAgg = await MedicalRecord.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build full 7-day array with zeros for missing days
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split("T")[0];
      const found = weeklyAgg.find((x) => x._id === dateStr);
      return {
        day: days[d.getDay()],
        value: found?.count ?? 0,
        date: dateStr,
      };
    });

    // ── Pet category breakdown ────────────────────────────────────────────
    const categoryAgg = await Patient.aggregate([
      { $match: { is_active: true } },
      { $unwind: { path: "$pets", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: { $toLower: { $ifNull: ["$pets.pet_category", "Unknown"] } },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return NextResponse.json({
      stats: {
        totalPatients,
        totalPets,
        totalRecords,
        thisMonthRecords,
        recordGrowth,
        patientGrowth,
      },
      recentPatients,
      weeklyData,
      categoryBreakdown: categoryAgg.map((c) => ({
        name: c._id.charAt(0).toUpperCase() + c._id.slice(1),
        value: c.count,
      })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
