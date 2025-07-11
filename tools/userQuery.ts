import { DynamicTool } from "@langchain/core/tools";
import { executeQuery } from "@/lib/mysql";
import { ChatGroq } from "@langchain/groq";

export const UserQuery = new DynamicTool({
  name: "user_query",
  description: `You are an AI agent that helps generate and execute SQL queries (MySQL dialect) based on natural language prompts. The database contains user-related tables with a comprehensive relational schema. Use the schema below to understand the structure and relationships when writing queries.

Database Schema:

1. users:
- user_id (INT, PK, AUTO_INCREMENT)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

2. UserProfiles:
- profile_id (INT, PK, AUTO_INCREMENT)
- user_id (INT, FK to users.user_id)
- full_name (VARCHAR)
- bio (TEXT)
- profile_picture_url (TEXT)
- location (VARCHAR)
- birthdate (DATE)
- city_id (INT, FK to Cities.city_id)

3. Cities:
- city_id (INT, PK, AUTO_INCREMENT)
- city_name (VARCHAR)
- state (VARCHAR)
- country (VARCHAR)
- postal_code (VARCHAR)
- created_at (TIMESTAMP)

4. UserRoles:
- role_id (INT, PK, AUTO_INCREMENT)
- role_name (VARCHAR, UNIQUE)

5. UserRoleMappings:
- user_id (INT, FK to users.user_id)
- role_id (INT, FK to UserRoles.role_id)
- PRIMARY KEY (user_id, role_id)

Instructions:
- Input will be a natural language query about users and their related data.
- Generate valid MySQL SQL queries using JOINs when needed to access related data.
- Execute the query and return the results in a readable format.
- You can query across all tables and their relationships.

Example prompts:
- "Show all users from Lahore" → JOIN with UserProfiles and Cities
- "Find users with admin role" → JOIN with UserRoleMappings and UserRoles
- "Show user profiles with their cities" → JOIN UserProfiles with Cities`,

  func: async (input: string) => {
    try {
      console.log("UserQuery tool called with input:", input);
      
      const model = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY!,
        model: "llama3-70b-8192",
      });

      const sqlPrompt = `
You are a SQL query generator. Given a natural language query about users, generate a valid MySQL SQL query.

Database schema:
1. users: user_id (INT PK), username (VARCHAR), email (VARCHAR), password_hash (VARCHAR), created_at, updated_at
2. UserProfiles: profile_id (INT PK), user_id (FK), full_name (VARCHAR), bio (TEXT), profile_picture_url (TEXT), location (VARCHAR), birthdate (DATE), city_id (FK)
3. Cities: city_id (INT PK), city_name (VARCHAR), state (VARCHAR), country (VARCHAR), postal_code (VARCHAR), created_at
4. UserRoles: role_id (INT PK), role_name (VARCHAR)
5. UserRoleMappings: user_id (FK), role_id (FK)

Rules:
1. Only return the SQL query, no explanations
2. Use proper MySQL syntax with JOINs when accessing related data
3. You are allowed to update tables as well but do not create new tables.
4. Use LIMIT 50 to prevent large result sets
5. Never include password_hash in SELECT clauses
6. Use table aliases for clarity, but ONLY in SELECT statements and JOIN clauses. 
   DO NOT use aliases in the table name for UPDATE or DELETE statements. 
   For UPDATE or DELETE, always use the full table name (e.g., UPDATE users SET ...).
7. Adhere to the MySQL dialect and follow the database schema I provided
8. DO NOT CHANGE THE TABLE NAMES OR COLUMN NAMES, USE THEM AS THEY ARE. YOU CAN USE ALIASES but DO NOT CHANGE THE NAMES
9. Do NOT include any special or non-ASCII characters in the SQL query. Only use standard ASCII characters and valid MySQL syntax.
10. The SQL query must be valid and executable as-is. Do not include any markdown, backticks, or extra formatting.
User query: "${input}"

SQL query:`;

      const response = await model.invoke([
        { role: "user", content: sqlPrompt }
      ]);

      let sqlQuery = response.content.toString()
        .replace(/[`\n\r\t]/g, ' ')
        .replace(/[^\x00-\x7F]+/g, '') 
        .replace(/\s+/g, ' ') 
        .trim();
      

      const results = await executeQuery(sqlQuery);
      
      console.log(`Query executed successfully, found ${Array.isArray(results) ? results.length : 0} results`);

      if (Array.isArray(results) && results.length > 0) {
        const formattedResults = results.map((row: any, index: number) => {
          const { password, password_hash, ...safeRow } = row; 
          return `${index + 1}. ${Object.entries(safeRow).map(([key, value]) => `${key}: ${value}`).join(', ')}`;
        }).join('\n');

        return `Found ${results.length} result(s):\n\n${formattedResults}`;
      } else {
        return "No results found for the given query.";
      }

    } catch (error) {
      console.error("Error in UserQuery tool:", error);
      return `Error executing query`;
    }
  }
});

