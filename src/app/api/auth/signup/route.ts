import { AuthService } from "@/services/auth/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get request data
    const body = await req.json();
    const { email, password } = body;
    
    // Call auth service to handle registration
    const result = await AuthService.registerUser(email, password);
    
    // Return appropriate response based on result
    return NextResponse.json(
      { message: result.message }, 
      { status: result.status }
    );

  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { message: "Error processing registration request" }, 
      { status: 500 }
    );
  }
}
