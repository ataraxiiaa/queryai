import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/postgres";


export async function GET() {
  let client;
  try {
    client = await pool.connect();
    if (!client) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }
    const result = await client.query("SELECT * FROM users");
    return NextResponse.json({
      users: result.rows
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}

export async function POST(request: NextRequest) {
  let client;
  try {
    client = await pool.connect();
    if (!client) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }
    const body = await request.json();
    console.log("Received body:", body);

    const { name, email, password, bio, location, city, state, country, birthdate, role, postal_code } = body;
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields (name, email, password) are required" },
        { status: 400 }
      );
    }

    const existingUser = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const userInsert = await client.query(
      `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id`,
      [name, email, password]
    );
    const userId = userInsert.rows[0].user_id;

    let cityId = null;
    if (city) {
      const cityRes = await client.query(
        `SELECT city_id FROM cities WHERE city_name = $1 AND state = $2 AND country = $3`,
        [city, state, country]
      );
      if (cityRes.rows.length > 0) {
        cityId = cityRes.rows[0].city_id;
      } else {
        const cityInsert = await client.query(
          `INSERT INTO cities (city_name, state, country, postal_code) VALUES ($1, $2, $3, $4) RETURNING city_id`,
          [city, state, country, postal_code || null]
        );
        cityId = cityInsert.rows[0].city_id;
      }
    }

    await client.query(
      `INSERT INTO userprofiles (user_id, full_name, bio, location, birthdate, city_id) VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, name, bio, location, birthdate ? new Date(birthdate) : null, cityId]
    );

    let roleId = null;
    if (role) {
      const roleRes = await client.query(
        `SELECT role_id FROM userroles WHERE role_name = $1`,
        [role]
      );
      if (roleRes.rows.length > 0) {
        roleId = roleRes.rows[0].role_id;
      } else {
        const roleInsert = await client.query(
          `INSERT INTO userroles (role_name) VALUES ($1) RETURNING role_id`,
          [role]
        );
        roleId = roleInsert.rows[0].role_id;
      }
      await client.query(
        `INSERT INTO userrolemappings (user_id, role_id) VALUES ($1, $2)`,
        [userId, roleId]
      );
    }

    const createdUserRes = await client.query(
      `SELECT u.id, u.username AS name, u.email, up.created_at FROM users u JOIN userprofiles up ON u.id = up.user_id WHERE u.id = $1`,
      [userId]
    );
    const createdUser = createdUserRes.rows[0];
    if (!createdUser) {
      throw new Error('Failed to retrieve created user');
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: createdUser
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}
