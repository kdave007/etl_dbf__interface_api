const db = require('../db/Database');

class ClientsActivity{
     constructor() {
        this.db = db;
      }

      async getLastConnect(){
        try {
          await this.db.query("SET timezone = 'America/Mexico_City'");
          
          const query = `
            SELECT 
              client_id,
              last_seen AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City' as last_seen
            FROM client_activity
            ORDER BY last_seen DESC
            LIMIT 1000;
          `;
          
          const result = await this.db.query(query);
          console.log('Client activity rows:', result.rows.length);
          
          if (result.rows.length === 0) {
            return {
              success: false,
              message: 'No client activity found',
              data: null
            };
          }
          
          return {
            success: true,
            data: result.rows,
            totalRecords: result.rows.length
          };
        } catch (error) {
          console.error('Error in getLastConnect:', error);
          throw new Error(`Failed to get last connection: ${error.message}`);
        }
      }
}

module.exports = ClientsActivity;