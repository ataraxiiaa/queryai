import { executeQuery } from '@/lib/mysql';

export interface MySQLUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  bio?: string;
  postal_code?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  birthdate?: Date;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    try {
      await executeQuery(query);
      console.log('Users table created/verified');
    } catch (error) {
      console.error('Error creating users table:', error);
      throw error;
    }
  }

  static async findAll(): Promise<MySQLUser[]> {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const results = await executeQuery(query);
    return results as MySQLUser[];
  }

  static async findByEmail(email: string): Promise<MySQLUser | null> {
    const query = 'SELECT * FROM users WHERE email = ?';
    const results = await executeQuery(query, [email]) as MySQLUser[];
    return results.length > 0 ? results[0] : null;
  }


  static async findById(id: number): Promise<MySQLUser | null> {
    const query = 'SELECT * FROM users WHERE user_id = ?';
    const results = await executeQuery(query, [id]) as MySQLUser[];
    return results.length > 0 ? results[0] : null;
  }


  static async create(userData: Omit<MySQLUser, 'id' | 'created_at' | 'updated_at'>): Promise<MySQLUser> {
    const userResult = await executeQuery(
      `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`,
      [userData.name, userData.email, userData.password]
    ) as { insertId: number };
    const userId = userResult.insertId;

    let cityId: number = -1
    if (userData.city) {
      const [city] = await executeQuery(
        `SELECT city_id FROM Cities WHERE city_name = ? AND state = ? AND country = ?`,
        [userData.city, userData.state, userData.country]
      ) as any[];
      if (city) {
        cityId = city.city_id;
      } else {
        const cityResult = await executeQuery(
          `INSERT INTO cities (city_name, state, country, postal_code) VALUES (?, ?, ?, ?)`,
          [userData.city, userData.state, userData.country, userData.postal_code || null]
        ) as { insertId: number };
        cityId = cityResult.insertId;
      }
    }
    await executeQuery(
      `INSERT INTO userprofiles (user_id, full_name, bio, location, birthdate, city_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        userData.name,
        userData.bio,
        userData.location,
        userData.birthdate ? new Date(userData.birthdate) : null,
        cityId
      ]
    );
    let roleId: number = -1
    if (userData.role) {
      const [role] = await executeQuery(
        `SELECT role_id FROM userroles WHERE role_name = ?`,
        [userData.role]
      ) as any[];
      if (role) {
        roleId = role.role_id;
      } else {
        const roleResult = await executeQuery(
          `INSERT INTO UserRoles (role_name) VALUES (?)`,
          [userData.role]
        ) as { insertId: number };
        roleId = roleResult.insertId;
      }
      await executeQuery(
        `INSERT INTO userrolemappings (user_id, role_id) VALUES (?, ?)`,
        [userId, roleId]
      );
    }

    const createdUser = await this.findById(userId);
    if (!createdUser) {
      throw new Error('Failed to retrieve created user');
    }
    return createdUser;
  }
}
