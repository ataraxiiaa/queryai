import { executeQuery } from "@/lib/mysql";

export interface UserRoleMapping {
    user_id: number;
    role_id: number;
}

export class UserRoleMappingModel {
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS user_roles_mapping (
                user_id INT NOT NULL,
                role_id INT NOT NULL,
                PRIMARY KEY (user_id, role_id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (role_id) REFERENCES roles(id)
            )
        `;

        try {
            await executeQuery(query);
            console.log('User roles mapping table created/verified');
        } catch (error) {
            console.error('Error creating user roles mapping table:', error);
            throw error;
        }
    }
}