import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    imageUrl: { 
      type: String, 
      required: true 
    },
  },
  { timestamps: true }
);

// Use type casting to handle the model compilation correctly
const Product = (mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)) as Model<IProduct>;

export default Product; 