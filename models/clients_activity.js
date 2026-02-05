const db = require('../db/Database');

class ClientsActivity{
     constructor() {
        this.db = db;
      }

      async getLastConnect(){
        try {
          const query = `
            SELECT 
              client_id,
              to_char(last_seen AT TIME ZONE 'America/Mexico_City', 'YYYY-MM-DD HH24:MI:SS') as last_seen
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

      async getLastConnectByPlaza(plaza){
        try {
          if (!plaza || plaza.trim() === '') {
            return {
              success: false,
              message: 'Plaza parameter is required',
              data: null
            };
          }

          const query = `
            SELECT 
              client_id,
              to_char(last_seen AT TIME ZONE 'America/Mexico_City', 'YYYY-MM-DD HH24:MI:SS') as last_seen
            FROM client_activity
            WHERE client_id LIKE $1
            ORDER BY last_seen DESC
            LIMIT 1000;
          `;
          
          const likePattern = `${plaza}_%`;
          const result = await this.db.query(query, [likePattern]);
          console.log(`Client activity rows for plaza ${plaza}:`, result.rows.length);
          
          if (result.rows.length === 0) {
            return {
              success: false,
              message: `No client activity found for plaza: ${plaza}`,
              plaza: plaza,
              data: []
            };
          }
          
          return {
            success: true,
            plaza: plaza,
            data: result.rows,
            totalRecords: result.rows.length
          };
        } catch (error) {
          console.error('Error in getLastConnectByPlaza:', error);
          return {
            success: false,
            message: `Failed to get last connection by plaza: ${error.message}`,
            plaza: plaza || '',
            data: null
          };
        }
      }
}

module.exports = ClientsActivity;