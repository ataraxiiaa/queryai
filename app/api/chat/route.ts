import pool from "@/lib/postgres";
import { NextResponse } from "next/server";

export async function GET() {
    const client = await pool.connect();
    
    try {
        if (!client) {
            return NextResponse.json(
                { error: "Database connection failed" },
                { status: 503 }
            );
        }
        const result = await client.query(`
            SELECT chat_id
            FROM chat_table 
            ORDER BY chat_id DESC
        `);
        
        return NextResponse.json({ sessions: result.rows });
        
    } catch (error) {
        console.error('Error fetching chat sessions:', error);
        return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(request: Request) {
    const client = await pool.connect();

    try {
        if (!client) {
            return NextResponse.json(
                { error: "Database connection failed" },
                { status: 503 }
            );
        }
        
        const body = await request.json();
        console.log("Received body:", body);
        const result = await client.query(`
            INSERT INTO chat_table DEFAULT VALUES
            RETURNING chat_id
        `);
        
        return NextResponse.json({ session: result.rows[0] });
        
    } catch (error) {
        console.error("Error creating chat session:", error);
        return NextResponse.json({ error: "Failed to create chat session" }, { status: 500 });
    } finally {
        client.release();
    }
}