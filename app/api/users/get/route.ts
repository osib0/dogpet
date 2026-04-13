import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(request: Request) {
  try {
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    
    const db = client.db();
    // Query better-auth's user collection
    const users = await db.collection("user").find({}).toArray();
    
    await client.close();

    // Remove passwords from response
    const safeUsers = users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    return NextResponse.json({ success: true, users: safeUsers }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
