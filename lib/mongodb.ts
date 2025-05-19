import mongoose from "mongoose";

// Get MongoDB URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Global cached connection
interface MongoConnection {
  isConnected?: boolean;
}

const connection: MongoConnection = {};

async function connectMongo() {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "auth-demo"
    });
    
    connection.isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
export default connectMongo;

