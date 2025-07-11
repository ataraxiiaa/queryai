import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'queryai',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};


const pool = mysql.createPool(dbConfig);


export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('MySQL Connection failed:', error);
    return false;
  }
};

export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  }
};

export default pool;
