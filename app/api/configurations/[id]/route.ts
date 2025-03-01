import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Configuration from '@/models/Configuration';
import { updateConfigurationSchema, configurationResponseSchema } from '@/lib/schemas';
import { z } from 'zod';

// Validate ID parameter
const idParamSchema = z.object({
  id: z.string().min(1, { message: "ID is required" })
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    const validatedParams = idParamSchema.safeParse(params);
    if (!validatedParams.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID parameter', issues: validatedParams.error.issues },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const id = params.id;
    const configuration = await Configuration.findById(id);
    
    if (!configuration) {
      return NextResponse.json(
        { success: false, error: 'Configuration not found' },
        { status: 404 }
      );
    }
    
    // Validate response data
    const validationResult = configurationResponseSchema.safeParse(configuration);
    
    if (!validationResult.success) {
      console.error('Response validation failed:', validationResult.error);
      // Still return the data but log the validation error
      return NextResponse.json({ success: true, data: configuration });
    }
    
    return NextResponse.json({ success: true, data: validationResult.data });
  } catch (error) {
    console.error('Error fetching configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    const validatedParams = idParamSchema.safeParse(params);
    if (!validatedParams.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID parameter', issues: validatedParams.error.issues },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const id = params.id;
    const body = await req.json();
    
    // Validate request body
    const validationResult = updateConfigurationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          issues: validationResult.error.issues 
        },
        { status: 400 }
      );
    }
    
    const configuration = await Configuration.findByIdAndUpdate(
      id,
      validationResult.data,
      { new: true, runValidators: true }
    );
    
    if (!configuration) {
      return NextResponse.json(
        { success: false, error: 'Configuration not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: configuration });
  } catch (error) {
    console.error('Error updating configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ID parameter
    const validatedParams = idParamSchema.safeParse(params);
    if (!validatedParams.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID parameter', issues: validatedParams.error.issues },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const id = params.id;
    const configuration = await Configuration.findByIdAndDelete(id);
    
    if (!configuration) {
      return NextResponse.json(
        { success: false, error: 'Configuration not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete configuration' },
      { status: 500 }
    );
  }
}
