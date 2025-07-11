import { executeQuery } from "@/lib/mysql";

export interface userRoles {
    role_id: number;
    role_name: string;
}

export class UserRoleModel {
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS roles (
                role_id INT AUTO_INCREMENT PRIMARY KEY,
                role_name VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;

        try {
            await executeQuery(query);
            console.log('Roles table created/verified');
        } catch (error) {
            console.error('Error creating roles table:', error);
            throw error;
        }
    }
}