import { executeQuery } from "@/lib/mysql";

export interface userProfile {
    profile_id: number,
    user_id: number,
    full_name: string,
    bio: string,
    profile_picture: string,
    location: string,
    birthdate: Date,
    city_id: number,
}

export class UserProfileModel {
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS user_profiles (
                profile_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                bio TEXT,
                profile_picture VARCHAR(255),
                location VARCHAR(255),
                birthdate DATE,
                city_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (city_id) REFERENCES cities(city_id)
            )
        `;

        try {
            await executeQuery(query);
            console.log('User profiles table created/verified');
        } catch (error) {
            console.error('Error creating user profiles table:', error);
            throw error;
        }
    }
}