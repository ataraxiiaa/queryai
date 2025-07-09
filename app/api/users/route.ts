import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { userSchema } from "@/schemas/userSchema";


export async function GET() {
  try {
    await dbConnect()
    const users = await UserModel.find({})
    return NextResponse.json({ users });
  }
  catch (error) {
    console.error("Error fetching users:", error);

    return NextResponse.json("Error fetching users")
  }
}


export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    console.log("Received body:", body);

    const validationData = {
      name: body.name,
      email: body.email,
      password: body.password,
      city: body.city,
    };

    console.log("Validation data:", validationData);

    const createUserSchema = userSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });

    const validatedData = createUserSchema.parse(validationData);
    console.log("Validated data:", validatedData);

    const existingUser = await UserModel.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const newUser = new UserModel(validatedData);
    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
