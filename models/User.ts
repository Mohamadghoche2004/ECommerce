import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true
    },
    password: { 
      type: String, 
      required: true 
    },
  },
  { timestamps: true }
);

// Use type casting to handle the model compilation correctly
const User = (mongoose.models.User || mongoose.model<IUser>("User", UserSchema)) as Model<IUser>;

export default User;
