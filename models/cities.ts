import { executeQuery } from "@/lib/mysql";

export interface City {
    city_id: number,
    city_name: string,
    state:string,
    country:string,
    postal_code:string,
    created_at?: Date
}

export class CityModel {
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS cities (
                city_id INT AUTO_INCREMENT PRIMARY KEY,
                city_name VARCHAR(255) NOT NULL,
                state VARCHAR(255) NOT NULL,
                country VARCHAR(255) NOT NULL,
                postal_code VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        try {
            await executeQuery(query);
            console.log('Cities table created/verified');
        } catch (error) {
            console.error('Error creating cities table:', error);
            throw error;
        }
    }
}