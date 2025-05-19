import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import connectMongo from "../../../lib/mongodb";


const SECRET_KEY = process.env.SECRET_KEY as string;

/**
 * Authentication service handling user login and registration
 */
export class AuthService {
  /**
   * Register a new user in the system
   * @param email User's email address
   * @param password User's plain text password
   * @returns Result object with success status and message
   */
  static async registerUser(email: string, password: string) {
    try {
      await connectMongo();
      
      // Validate input
      if (!email || !password) {
        return { 
          success: false, 
          message: "Email and password are required",
          status: 400 
        };
      }
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return { 
          success: false, 
          message: "User already exists",
          status: 400 
        };
      }
      
      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        email,
        password: hashedPassword,
      });
      
      return { 
        success: true, 
        message: "User registered successfully",
        status: 201 
      };
      
    } catch (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        message: "Error registering user",
        status: 500 
      };
    }
  }
  
  /**
   * Authenticate a user and generate JWT token
   * @param email User's email address
   * @param password User's plain text password
   * @returns Result object with token if successful
   */
  static async loginUser(email: string, password: string) {
    try {
      await connectMongo();
      
      // Validate input
      if (!email || !password) {
        return { 
          success: false, 
          message: "Email and password are required",
          status: 400 
        };
      }
      
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return { 
          success: false, 
          message: "User not found",
          status: 400 
        };
      }
      
      // Verify password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return { 
          success: false, 
          message: "Invalid credentials",
          status: 401 
        };
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email }, 
        SECRET_KEY, 
        { expiresIn: "1h" }
      );
      
      return { 
        success: true, 
        message: "Login successful",
        token,
        status: 200 
      };
      
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: "Error logging in",
        status: 500 
      };
    }
  }
} 