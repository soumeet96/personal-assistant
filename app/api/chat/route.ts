import { createGroq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = "edge";

const SYSTEM_PROMPT = `You are a smart, friendly personal assistant. You help with:
- Brainstorming and quick ideas
- Explaining concepts clearly
- Writing, editing, and summarizing
- Answering general knowledge questions
- Breaking down complex problems

Keep responses concise and practical. Be direct and helpful.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 1024,
  });

  return result.toUIMessageStreamResponse();
}
