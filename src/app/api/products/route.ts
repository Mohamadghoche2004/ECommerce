import { NextRequest, NextResponse } from "next/server";
import connectMongo from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import supabase from "../../../../lib/supabase";

// GET all products
export async function GET() {
  try {
    await connectMongo();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST a new product
export async function POST(request: NextRequest) {
  try {
    console.log("Starting product creation process");
    
    // Verify Supabase connection
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Supabase Key present:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON);
    
    await connectMongo();
    console.log("MongoDB connected successfully");
    
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const image = formData.get("image") as File;
    
    console.log("Form data received:", { name, imageReceived: !!image });
    
    if (!name || !image) {
      return NextResponse.json(
        { error: "Name and image are required" },
        { status: 400 }
      );
    }
    
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${image.name.replace(/\s+/g, "-")}`;
    console.log("Generated filename:", filename);
    
    // Convert image to buffer for Supabase upload
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("Converted image to buffer, size:", buffer.length);
    
    try {
      console.log("Attempting to upload to Supabase bucket: 'images'");
      // Upload to Supabase Storage
      const { error } = await supabase
        .storage
        .from('images')
        .upload(filename, buffer, {
          contentType: image.type,
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error("Supabase Storage upload error:", error);
        return NextResponse.json(
          { error: `Failed to upload image: ${error.message}` },
          { status: 500 }
        );
      }
      
      console.log("File uploaded successfully to Supabase");
      
      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase
        .storage
        .from('images')
        .getPublicUrl(filename);
      
      console.log("Got public URL:", publicUrlData.publicUrl);
      
      // Save product to database
      const imageUrl = publicUrlData.publicUrl;
      const product = await Product.create({
        name,
        imageUrl
      });
      
      console.log("Product saved to database:", product._id);
      
      return NextResponse.json({ product }, { status: 201 });
    } catch (uploadError: unknown) {
      console.error("Unexpected error during upload:", uploadError);
      const errorMessage = uploadError instanceof Error 
        ? uploadError.message 
        : String(uploadError);
      return NextResponse.json(
        { error: `Unexpected upload error: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : String(error);
    return NextResponse.json(
      { error: `Failed to create product: ${errorMessage}` },
      { status: 500 }
    );
  }
} 