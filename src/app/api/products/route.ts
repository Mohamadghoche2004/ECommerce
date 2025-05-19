import { NextRequest, NextResponse } from "next/server";
import connectMongo from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import { writeFile } from "fs/promises";
import path from "path";

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
    await connectMongo();
    
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const image = formData.get("image") as File;
    
    if (!name || !image) {
      return NextResponse.json(
        { error: "Name and image are required" },
        { status: 400 }
      );
    }
    
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${image.name.replace(/\s+/g, "-")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    
    // Save the image to the file system
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    
    // Save product to database
    const imageUrl = `/uploads/${filename}`;
    const product = await Product.create({
      name,
      imageUrl
    });
    
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
} 