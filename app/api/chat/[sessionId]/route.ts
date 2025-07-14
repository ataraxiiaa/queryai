import pool from "@/lib/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
    const client = await pool.connect();

    try {
        if (!client) {
            return NextResponse.json(
                { error: "Database connection failed" },
                { status: 503 }
            );
        }

        const { sessionId } = await params;
        const chatId = parseInt(sessionId);

        if (isNaN(chatId)) {
            return NextResponse.json({ error: 'Invalid chat ID format. Must be an integer.' }, { status: 400 });
        }

        const result = await client.query(`
            SELECT role, content
            FROM chat_messages 
            WHERE chat_id = $1
            ORDER BY id ASC
        `, [chatId]);

        return NextResponse.json({ messages: result.rows });

    } catch (error) {
        console.error('Error fetching chat messages:', error);
        return NextResponse.json({ error: 'Failed to fetch chat messages' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
    const client = await pool.connect();

    try {
        if (!client) {
            return NextResponse.json(
                { error: "Database connection failed" },
                { status: 503 }
            );
        }

        const { sessionId } = await params;
        const body = await request.json();
        const { role, content } = body;
        const chatId = parseInt(sessionId);

        if (!role || !content) {
            return NextResponse.json({ error: 'Role and content are required' }, { status: 400 });
        }
        if (isNaN(chatId)) {
            return NextResponse.json({ error: 'Invalid chat ID format. Must be an integer.' }, { status: 400 });
        }

        const chatCheck = await client.query(`
            SELECT chat_id FROM chat_table WHERE chat_id = $1
        `, [chatId]);

        if (chatCheck.rows.length === 0) {
            await client.query(`
                INSERT INTO chat_table (chat_id) VALUES ($1)
            `, [chatId]);
        }

        const result = await client.query(`
            INSERT INTO chat_messages (chat_id, role, content)
            VALUES ($1, $2, $3)
            RETURNING id, role, content
        `, [chatId, role, content]);

        return NextResponse.json({ message: result.rows[0] });

    } catch (error) {
        console.error('Error adding chat message:', error);
        return NextResponse.json({ error: 'Failed to add chat message' }, { status: 500 });
    } finally {
        client.release();
    }
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
    const client = await pool.connect();
    
    try {
        if (!client) {
            return NextResponse.json(
                { error: "Database connection failed" },
                { status: 503 }
            );
        }

        const { sessionId } = await params;
        const chatId = parseInt(sessionId);

        if (isNaN(chatId)) {
            return NextResponse.json({ error: 'Invalid chat ID format. Must be an integer.' }, { status: 400 });
        }
        const chatCheck = await client.query(`
            SELECT chat_id FROM chat_table WHERE chat_id = $1
        `, [chatId]);

        if (chatCheck.rows.length === 0) {
            return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
        }
        await client.query(`
            DELETE FROM chat_table WHERE chat_id = $1
        `, [chatId]);

        return NextResponse.json({ message: 'Chat deleted successfully' });

    } catch (error) {
        console.error('Error deleting chat:', error);
        return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
    } finally {
        client.release();
    }
}
