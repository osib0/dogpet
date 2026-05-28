import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient.model";
import { z } from "zod";

const ownerSchema = z.object({
  owner_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  is_active: z.boolean().optional(),
});

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
  // owner _id — present when editing/adding to existing owner
  _id: z.string().nullable().optional(),
  // pet_id — present when editing a specific pet
  pet_id: z.string().nullable().optional(),
  // owner-level fields
  owner_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  is_active: z.boolean().optional(),
  // pet-level fields
  pet_name: z.string().optional(),
  pet_category: z.string().optional(),
  pet_type: z.string().optional(),
  breed: z.string().optional(),
  color: z.string().optional(),
  sex: z.string().optional(),
  dob: z.string().optional(),
  picture: z.string().optional(),
  // legacy date fields
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
      select_date, visit_date, next_visit_date,
    } = validated;

    const ownerData = { owner_name, phone, email, is_active };
    const petData = { pet_name, pet_category, pet_type, breed, color, sex, dob, picture };

    // ── CASE 1: Edit existing owner info (no pet_id, has _id) ─────────────
    if (_id && !pet_id && !pet_name) {
      const updated = await Patient.findByIdAndUpdate(
        _id,
        { $set: { ...ownerData, select_date, visit_date, next_visit_date } },
        { new: true }
      );
      return NextResponse.json(updated);
    }

    // ── CASE 2: Edit existing pet (has _id and pet_id) ────────────────────
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

      if (!updated) {
        return NextResponse.json({ error: "Pet not found" }, { status: 404 });
      }
      return NextResponse.json(updated);
    }

    // ── CASE 3: Add new pet to existing owner (has _id, no pet_id) ────────
    if (_id && !pet_id) {
      // Check duplicate pet name for this owner
      const owner = await Patient.findById(_id);
      if (!owner) {
        return NextResponse.json({ error: "Owner not found" }, { status: 404 });
      }

      if (pet_name && owner.pets && Array.isArray(owner.pets)) {
        const dupPet = owner.pets.find(
          (p: { pet_name?: string }) =>
            p.pet_name?.toLowerCase().trim() === pet_name.toLowerCase().trim()
        );
        if (dupPet) {
          return NextResponse.json(
            { error: `Pet named "${pet_name}" already registered under this owner.` },
            { status: 400 }
          );
        }
      }

      const updated = await Patient.findByIdAndUpdate(
        _id,
        { $push: { pets: { ...petData } } },
        { new: true }
      );
      return NextResponse.json(updated);
    }

    // ── CASE 4: Create new owner with first pet ───────────────────────────
    // Check for duplicate pet name under same phone
    if (phone && pet_name) {
      const existingOwner = await Patient.findOne({ phone });
      if (existingOwner) {
        // Owner exists — add pet to them instead
        if (existingOwner.pets && Array.isArray(existingOwner.pets)) {
          const dupPet = existingOwner.pets.find(
            (p: { pet_name?: string }) =>
              p.pet_name?.toLowerCase().trim() === pet_name.toLowerCase().trim()
          );
          if (dupPet) {
            return NextResponse.json(
              { error: `Pet named "${pet_name}" is already registered under this phone number.` },
              { status: 400 }
            );
          }
        }
        const updated = await Patient.findByIdAndUpdate(
          existingOwner._id,
          {
            $set: { owner_name, email, is_active },
            $push: { pets: { ...petData } },
          },
          { new: true }
        );
        return NextResponse.json(updated);
      }
    }

    // Brand new owner + first pet
    const newPatient = await Patient.create({
      owner_name,
      phone,
      email,
      is_active: is_active ?? true,
      pets: pet_name ? [{ ...petData }] : [],
      select_date,
      visit_date,
      next_visit_date,
    });

    return NextResponse.json(newPatient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error saving patient:", error);
    return NextResponse.json({ error: "Failed to save patient" }, { status: 500 });
  }
}