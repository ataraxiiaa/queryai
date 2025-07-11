import { NextRequest, NextResponse } from "next/server";
import { runGroqChain } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { message, prompt } = await req.json();
    let userInput = message || prompt;

    if (!userInput) {
      return NextResponse.json({ error: "No message or prompt provided" }, { status: 400 });
    }

    const sqlMatch = userInput.match(/([\s\S]*?;)/);
    if (sqlMatch) {
      userInput = sqlMatch[1];
    } else {
      userInput = userInput.split('\n')[0];
    }

    const result = await runGroqChain(userInput);
    return NextResponse.json({ response: result });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ 
      error: "Groq failed", 
    }, { status: 500 });
  }
}
