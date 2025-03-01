import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Configuration from "@/models/Configuration";
import {
  createConfigurationSchema,
  configurationsListResponseSchema,
} from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
 
    const body = await request.json();

    // Validate with Zod schema
    const validationResult = createConfigurationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          issues: validationResult.error.issues,
          formErrors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }
 
    const configuration = await Configuration.create(validationResult.data);

    return NextResponse.json(
      { success: true, data: configuration },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving configuration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
 
    const configurations = await Configuration.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    const validationResult =
      configurationsListResponseSchema.safeParse(configurations);

    if (!validationResult.success) {
      console.error("Response validation failed:", validationResult.error);
 
      return NextResponse.json({ success: true, data: configurations });
    }

    return NextResponse.json({ success: true, data: validationResult.data });
  } catch (error) {
    console.error("Error fetching configurations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch configurations" },
      { status: 500 }
    );
  }
}
