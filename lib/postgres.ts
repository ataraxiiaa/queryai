import { Pool } from "pg"
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
})


export const executeQuery = async (query: string) => {
  const client = await pool.connect();
  try {
    const results = await client.query(query);
    return results.rows
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  }
  finally {
    client.release()
  }
};

export default pool;
