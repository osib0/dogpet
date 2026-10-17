import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient.model";
import MedicalRecord from "@/models/medical-record.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date"); // optional: YYYY-MM-DD

    const now = new Date();

    // ─── TODAY boundaries ─────────────────────────────────────────────────
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // ─── THIS MONTH boundaries ────────────────────────────────────────────
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // ─── SELECTED DATE boundaries (for date-wise filter) ─────────────────
    let startOfSelected = startOfToday;
    let endOfSelected = endOfToday;
    if (dateParam) {
      const d = new Date(dateParam);
      startOfSelected = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      endOfSelected = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  DAILY DATA  (today)
    // ═══════════════════════════════════════════════════════════════════════
    const dailyNewPatients = await Patient.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const dailyRecords = await MedicalRecord.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    // Today's records with patient info
    const dailyRecordList = await MedicalRecord.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Enrich with patient name
    const dailyPatientIds = [...new Set(dailyRecordList.map((r) => r.patient_id?.toString()).filter(Boolean))];
    const dailyPatients = await Patient.find({ _id: { $in: dailyPatientIds } })
      .select("owner_name phone pets")
      .lean();
    const patientMap = Object.fromEntries(dailyPatients.map((p) => [p._id.toString(), p]));

    const dailyRecordsFull = dailyRecordList.map((r) => {
      const pat = patientMap[r.patient_id?.toString() ?? ""];
      const pet = pat?.pets?.find((p: any) => p._id?.toString() === r.pet_id?.toString());
      return {
        ...r,
        owner_name: pat?.owner_name ?? "—",
        phone: pat?.phone ?? r.phone,
        pet_name: pet?.pet_name ?? "—",
        pet_category: pet?.pet_category ?? "—",
      };
    });

    // Type breakdown for today
    const dailyTypeBreakdown = await MedicalRecord.aggregate([
      { $match: { createdAt: { $gte: startOfToday, $lte: endOfToday } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    // ═══════════════════════════════════════════════════════════════════════
    //  MONTHLY DATA  (this month)
    // ═══════════════════════════════════════════════════════════════════════
    const monthlyNewPatients = await Patient.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const monthlyRecords = await MedicalRecord.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Daily breakdown within this month (day-by-day record counts)
    const monthlyDailyAgg = await MedicalRecord.aggregate([
      { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Type breakdown for this month
    const monthlyTypeBreakdown = await MedicalRecord.aggregate([
      { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    // Top patients this month by record count
    const topPatientsByRecords = await MedicalRecord.aggregate([
      { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: "$patient_id", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    const topPatientIds = topPatientsByRecords.map((x) => x._id);
    const topPatientDocs = await Patient.find({ _id: { $in: topPatientIds } })
      .select("owner_name phone")
      .lean();
    const topPatientMapById = Object.fromEntries(topPatientDocs.map((p) => [p._id.toString(), p]));
    const topPatientsEnriched = topPatientsByRecords.map((x) => ({
      owner_name: topPatientMapById[x._id?.toString()]?.owner_name ?? "—",
      phone: topPatientMapById[x._id?.toString()]?.phone ?? "—",
      records: x.count,
    }));

    // ═══════════════════════════════════════════════════════════════════════
    //  DATE-WISE DATA  (selected date)
    // ═══════════════════════════════════════════════════════════════════════
    const dateNewPatients = await Patient.countDocuments({
      createdAt: { $gte: startOfSelected, $lte: endOfSelected },
    });

    const dateRecords = await MedicalRecord.countDocuments({
      createdAt: { $gte: startOfSelected, $lte: endOfSelected },
    });

    const dateRecordList = await MedicalRecord.find({
      createdAt: { $gte: startOfSelected, $lte: endOfSelected },
    })
      .sort({ createdAt: -1 })
      .lean();

    const datePatientIds = [...new Set(dateRecordList.map((r) => r.patient_id?.toString()).filter(Boolean))];
    const datePatientsDoc = await Patient.find({ _id: { $in: datePatientIds } })
      .select("owner_name phone pets")
      .lean();
    const datePatientMap = Object.fromEntries(datePatientsDoc.map((p) => [p._id.toString(), p]));

    const dateRecordsFull = dateRecordList.map((r) => {
      const pat = datePatientMap[r.patient_id?.toString() ?? ""];
      const pet = pat?.pets?.find((p: any) => p._id?.toString() === r.pet_id?.toString());
      return {
        ...r,
        owner_name: pat?.owner_name ?? "—",
        phone: pat?.phone ?? r.phone,
        pet_name: pet?.pet_name ?? "—",
        pet_category: pet?.pet_category ?? "—",
      };
    });

    const dateTypeBreakdown = await MedicalRecord.aggregate([
      { $match: { createdAt: { $gte: startOfSelected, $lte: endOfSelected } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      daily: {
        date: startOfToday.toISOString().split("T")[0],
        newPatients: dailyNewPatients,
        totalRecords: dailyRecords,
        typeBreakdown: dailyTypeBreakdown.map((x) => ({ type: x._id, count: x.count })),
        records: dailyRecordsFull,
      },
      monthly: {
        month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
        newPatients: monthlyNewPatients,
        totalRecords: monthlyRecords,
        typeBreakdown: monthlyTypeBreakdown.map((x) => ({ type: x._id, count: x.count })),
        dailyBreakdown: monthlyDailyAgg.map((x) => ({ date: x._id, count: x.count })),
        topPatients: topPatientsEnriched,
      },
      datewise: {
        date: startOfSelected.toISOString().split("T")[0],
        newPatients: dateNewPatients,
        totalRecords: dateRecords,
        typeBreakdown: dateTypeBreakdown.map((x) => ({ type: x._id, count: x.count })),
        records: dateRecordsFull,
      },
    });
  } catch (error) {
    console.error("Master stats error:", error);
    return NextResponse.json({ error: "Failed to fetch master stats" }, { status: 500 });
  }
}
