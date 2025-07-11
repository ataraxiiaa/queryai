import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/user";
import { testConnection } from "@/lib/mysql";

export async function GET() {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }
    await UserModel.createTable();
    
    const users = await UserModel.findAll();
    
    return NextResponse.json({ 
      users,
      message: `Found ${users.length} users`
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users"},
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }
    await UserModel.createTable();
    
    const body = await request.json();
    console.log("Received body:", body);

    const { name, email, password, bio, location, city,state,country, birthdate, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields (name, email, password) are required" },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const newUser = await UserModel.create({ name, email, password , bio, location, city, state, country, birthdate, role });
    console.log("Created user:", newUser);

    return NextResponse.json(
      { 
        message: "User created successfully", 
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          created_at: newUser.created_at
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    return NextResponse.json(
      { error: "Failed to create user"},
      { status: 500 }
    );
  }
}
