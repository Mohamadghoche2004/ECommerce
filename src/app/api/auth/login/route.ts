import { AuthService } from "@/services/auth/auth";
import { NextRequest, NextResponse } from "next/server";

// Make sure SECRET_KEY is defined
if (!process.env.SECRET_KEY) {
  throw new Error("Please define the SECRET_KEY environment variable");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    
    const result = await AuthService.loginUser(email, password);
    
    return NextResponse.json(
      result.success 
        ? { message: result.message, token: result.token }
        : { message: result.message }, 
      { status: result.status }
    );

  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "Error processing login request" }, 
      { status: 500 }
    );
  }
}

