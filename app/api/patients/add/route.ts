import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient.model";
import { z } from "zod";

const petSchema = z.object({
  pet_name: z.string().optional(),
  pet_category: z.string().optional(),
  pet_type: z.string().optional(),
  breed: z.string().optional(),
  color: z.string().optional(),
  sex: z.string().optional(),
  dob: z.string().optional(),
  picture: z.string().optional(),
  is_active: z.boolean().optional(),
});

const bodySchema = z.object({
  _id: z.string().nullable().optional(),
  pet_id: z.string().nullable().optional(),
  owner_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  is_active: z.boolean().optional(),
  // single pet fields (edit pet / add one pet)
  pet_name: z.string().optional(),
  pet_category: z.string().optional(),
  pet_type: z.string().optional(),
  breed: z.string().optional(),
  color: z.string().optional(),
  sex: z.string().optional(),
  dob: z.string().optional(),
  picture: z.string().optional(),
  // ── NEW: multiple pets array (for new owner creation) ──────────────────
  pets: z.array(petSchema).optional(),
  // legacy
  select_date: z.string().optional(),
  visit_date: z.string().optional(),
  next_visit_date: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const validated = bodySchema.parse(body);

    const {
      _id, pet_id,
      owner_name, phone, email, is_active,
      pet_name, pet_category, pet_type, breed, color, sex, dob, picture,
      pets: petsArray,
      select_date, visit_date, next_visit_date,
    } = validated;

    // Build single pet object from flat fields
    const singlePetData = { pet_name, pet_category, pet_type, breed, color, sex, dob, picture };

    // ── CASE 1: Edit owner info (has _id, no pet_id, no pet fields) ─────────
    if (_id && !pet_id && !pet_name && !petsArray?.length) {
      const updated = await Patient.findByIdAndUpdate(
        _id,
        { $set: { owner_name, phone, email, is_active, select_date, visit_date, next_visit_date } },
        { new: true }
      );
      return NextResponse.json(updated);
    }

    // ── CASE 2: Edit specific pet (has _id and pet_id) ───────────────────────
    if (_id && pet_id) {
      const updateFields: Record<string, unknown> = {};
      if (pet_name !== undefined) updateFields["pets.$.pet_name"] = pet_name;
      if (pet_category !== undefined) updateFields["pets.$.pet_category"] = pet_category;
      if (pet_type !== undefined) updateFields["pets.$.pet_type"] = pet_type;
      if (breed !== undefined) updateFields["pets.$.breed"] = breed;
      if (color !== undefined) updateFields["pets.$.color"] = color;
      if (sex !== undefined) updateFields["pets.$.sex"] = sex;
      if (dob !== undefined) updateFields["pets.$.dob"] = dob;
      if (picture !== undefined) updateFields["pets.$.picture"] = picture;
      if (is_active !== undefined) updateFields["pets.$.is_active"] = is_active;

      const updated = await Patient.findOneAndUpdate(
        { _id, "pets._id": pet_id },
        { $set: updateFields },
        { new: true }
      );
      if (!updated) return NextResponse.json({ error: "Pet not found" }, { status: 404 });
      return NextResponse.json(updated);
    }

    // ── CASE 3: Add one or more pets to existing owner (has _id) ────────────
    if (_id && !pet_id) {
      const owner = await Patient.findById(_id);
      if (!owner) return NextResponse.json({ error: "Owner not found" }, { status: 404 });

      // Determine which pets to add — either the array or single pet
      const newPets = petsArray?.length
        ? petsArray.filter((p) => p.pet_name)
        : pet_name ? [singlePetData] : [];

      if (newPets.length === 0) {
        return NextResponse.json({ error: "No pet data provided." }, { status: 400 });
      }

      // Check duplicate pet names
      const existingNames = (owner.pets || []).map((p: { pet_name?: string }) =>
        (p.pet_name || "").toLowerCase().trim()
      );
      const duplicates = newPets
        .map((p) => (p.pet_name || "").toLowerCase().trim())
        .filter((n) => existingNames.includes(n));

      if (duplicates.length > 0) {
        return NextResponse.json(
          { error: `Pet(s) "${duplicates.join('", "')}" already registered under this owner.` },
          { status: 400 }
        );
      }

      const updated = await Patient.findByIdAndUpdate(
        _id,
        { $push: { pets: { $each: newPets } } },
        { new: true }
      );
      return NextResponse.json(updated);
    }

    // ── CASE 4: Create new owner + pets ─────────────────────────────────────
    // Determine pets to create
    const newPetsToCreate = petsArray?.length
      ? petsArray.filter((p) => p.pet_name)
      : pet_name ? [singlePetData] : [];

    // Check if owner with this phone already exists → add pets to them
    if (phone && newPetsToCreate.length > 0) {
      const existingOwner = await Patient.findOne({ phone });
      if (existingOwner) {
        const existingNames = (existingOwner.pets || []).map((p: { pet_name?: string }) =>
          (p.pet_name || "").toLowerCase().trim()
        );
        const duplicates = newPetsToCreate
          .map((p) => (p.pet_name || "").toLowerCase().trim())
          .filter((n) => existingNames.includes(n));

        if (duplicates.length > 0) {
          return NextResponse.json(
            { error: `Pet(s) "${duplicates.join('", "')}" already registered under this phone number.` },
            { status: 400 }
          );
        }

        const updated = await Patient.findByIdAndUpdate(
          existingOwner._id,
          {
            $set: { owner_name, email, is_active },
            $push: { pets: { $each: newPetsToCreate } },
          },
          { new: true }
        );
        return NextResponse.json(updated);
      }
    }

    // Brand new owner
    const newPatient = await Patient.create({
      owner_name,
      phone,
      email,
      is_active: is_active ?? true,
      pets: newPetsToCreate,
      select_date,
      visit_date,
      next_visit_date,
    });

    return NextResponse.json(newPatient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    console.error("Error saving patient:", error);
    return NextResponse.json({ error: "Failed to save patient" }, { status: 500 });
  }
}