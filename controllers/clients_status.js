const db = require('../db/Database');
const ClientsActivity = require('../models/clients_activity');

class ClientsStatusController {
    constructor() {
        this.db = db;
    }

    async getClientsStatus() {
        const clientsActivity = new ClientsActivity();
        const lastConnect = await clientsActivity.getLastConnect();
        
        if (!lastConnect.success) {
            return lastConnect;
        }
        
        // Parse client_id to separate city and location
        const parsedData = lastConnect.data.map(client => {
            const [city, location] = client.client_id.split('_');
            return {
                client_id: client.client_id,
                city: city || null,
                location: location || null,
                last_seen: client.last_seen
            };
        });
        
        return {
            success: true,
            data: parsedData,
            totalRecords: lastConnect.totalRecords
        };
    }

    async getClientsStatusByPlaza(plaza) {
        const clientsActivity = new ClientsActivity();
        const lastConnect = await clientsActivity.getLastConnectByPlaza(plaza);
        
        if (!lastConnect.success) {
            return lastConnect;
        }
        
        // Parse client_id to separate city and location
        const parsedData = lastConnect.data.map(client => {
            const [city, location] = client.client_id.split('_');
            return {
                client_id: client.client_id,
                city: city || null,
                location: location || null,
                last_seen: client.last_seen
            };
        });
        
        return {
            success: true,
            plaza: plaza,
            data: parsedData,
            totalRecords: lastConnect.totalRecords
        };
    }
}

module.exports = ClientsStatusController;