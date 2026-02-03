const db = require('../db/Database');

class ClientsList {
    constructor() {
        this.db = db;
    }

    async get_by_city(city){
        try {
            if (!city || city.trim() === '') {
                return {
                    success: false,
                    message: 'City parameter is required',
                    plaza: city || '',
                    data: [],
                    totalRecords: 0
                };
            }

            let query = `
            SELECT client_id, tienda, tipo FROM spots
            WHERE plaza = $1 and is_active = true
            ORDER BY tienda ASC LIMIT 200
            `;
            
            const result = await this.db.query(query, [city])
           
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'No clients found for the specified city',
                    plaza: city,
                    data: [],
                    totalRecords: 0
                };
            }

            return {
                success: true,
                plaza: city,
                data: result.rows,
                totalRecords: result.rows.length
            };
        } catch (error) {
            console.error('Error in get_by_city:', error);
            return {
                success: false,
                message: 'Failed to get clients by city',
                plaza: city || '',
                data: [],
                totalRecords: 0
            };
        }
    }
}

module.exports = ClientsList;