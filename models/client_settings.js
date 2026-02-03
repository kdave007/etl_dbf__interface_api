const db = require('../db/Database');

class ClientsSettings{
     constructor() {
        this.db = db;
      }

      async getbyId(client_id){
        try {
          const query = `
            SELECT key, value FROM public.spot_settings
            WHERE client_id = $1
            ORDER BY client_id ASC, key ASC 
          `;
          
          const result = await this.db.query(query, [client_id]);
          console.log('Client settings rows:', result.rows.length);

          if (result.rows.length === 0) {
            return {
              success: false,
              message: 'No client settings found',
              data: null
            };
          }
          
          return {
            success: true,
            client_id: client_id,
            data: result.rows,
            totalRecords: result.rows.length
          };


        } catch (error) {
          console.error('Error in getbyId:', error);
          return {
            success: false,
            message: 'Failed to get client settings',
            data: null
          };
        }
      }

      async updateById(client_id, settings){
        try {
          if (!Array.isArray(settings) || settings.length === 0) {
            return {
              success: false,
              message: 'settings must be a non-empty array of {key, value} objects',
              data: null
            };
          }

          let totalUpdated = 0;
          const results = [];

          for (const setting of settings) {
            if (!setting.key || setting.value === undefined) {
              results.push({
                key: setting.key || 'unknown',
                success: false,
                message: 'Missing key or value'
              });
              continue;
            }

            const query = `
              UPDATE spot_settings 
              SET value = $1, 
                  updated_at = CURRENT_TIMESTAMP 
              WHERE client_id = $2 AND key = $3
            `;
            
            const result = await this.db.query(query, [setting.value, client_id, setting.key]);
            
            if (result.rowCount > 0) {
              totalUpdated += result.rowCount;
              results.push({
                key: setting.key,
                success: true,
                rowsUpdated: result.rowCount
              });
            } else {
              results.push({
                key: setting.key,
                success: false,
                message: 'No matching setting found'
              });
            }
          }

          console.log('Client settings bulk update - Total updated rows:', totalUpdated);
          
          return {
            success: totalUpdated > 0,
            message: totalUpdated > 0 
              ? `Successfully updated ${totalUpdated} setting(s)` 
              : 'No settings were updated',
            data: {
              totalUpdated,
              results
            }
          };
          
        } catch (error) {
          console.error('Error in updateById:', error);
          return {
            success: false,
            message: 'Failed to update client settings',
            data: null
          };
        }
      }



    }


module.exports = ClientsSettings;