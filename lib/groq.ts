import { UserQuery } from "@/tools/userQuery";
import { ChatGroq } from "@langchain/groq";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful AI assistant that can query user data from a PostgreSQL database. When users ask about finding users, user information, or database queries, use the user_query tool to search the database. You can search by name, email, or other user fields. Always provide helpful and accurate information based on the database results.",
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

export const runGroqChain = async (userInput: string) => {
  try {
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY!,
      model: "llama3-70b-8192",
    });

    const agent = await createToolCallingAgent({
      llm: model,
      tools: [UserQuery],
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools: [UserQuery],
      returnIntermediateSteps: true,
    });

    const response = await agentExecutor.invoke({
      input: userInput,
      chat_history: [],
    });

    const toolOutput = response.intermediateSteps?.[0]?.observation;

    if (!toolOutput) {
      return response.output; 
    }

    const summaryPrompt = `You are an assistant that received the following JSON data from a PostgreSQL query:\n\n${toolOutput}\n\nExtract and clearly display the user list in a readable format. Do not ask follow-up questions or defer to the user. Just output the list and DO NOT make the text bold`;
    
    const summary = await model.invoke(summaryPrompt);

    return summary.content;
  } catch (error) {
    console.error("Groq chain error:", error);
    throw error;
  }
};
