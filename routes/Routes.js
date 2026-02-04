const express = require('express');
const router = express.Router();
const db = require('../db/Database');
const DataTablesController = require('../controllers/data_tables');
const ClientsStatusController = require('../controllers/clients_status');
const ClientsSettings = require('../models/client_settings');
const ClientsList = require('../models/clients_list');

class Routes {
  constructor() {
    this.router = router;
    this.dataTablesController = new DataTablesController();
    this.clientsStatusController = new ClientsStatusController();
    this.clientsSettings = new ClientsSettings();
    this.clientsList = new ClientsList();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/default_data', this.defaultData.bind(this));
    this.router.post('/paginated_data', this.getPaginatedData.bind(this));
    this.router.post('/filtered_data', this.getFilteredData.bind(this));
    this.router.get('/clients_status', this.getClientsStatus.bind(this));
    this.router.post('/client_settings', this.clientSettings.bind(this));
    this.router.post('/clients_by_plaza', this.clients_by_plaza.bind(this));
  }

  async defaultData(req, res) {
    try {
      const data = req.body;
      
      res.status(200).json({
        success: true,
        message: 'Default data endpoint',
        receivedData: data
      });
    } catch (error) {
      console.error('Error in default_data endpoint:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getPaginatedData(req, res) {
    try {
      const { tableName, dateRange, city, paginationContext } = req.body;
      
      console.log('📥 Request received:', {
        tableName,
        dateRange,
        city,
        paginationContext
      });
      
      if (!tableName) {
        return res.status(400).json({
          success: false,
          message: 'tableName is required'
        });
      }
      
      const result = await this.dataTablesController.getData(
        tableName,
        dateRange,
        city,
        paginationContext
      );
      
      console.log('📤 Response data:', {
        metadataCount: result.metadata?.length || 0,
        dataCount: result.data?.length || 0,
        pagination: result.pagination
      });
      
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Error in paginated_data endpoint:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getFilteredData(req, res) {
    try {
      const { tableName, searchField, searchText, dateRange, city, paginationContext } = req.body;
      
      console.log('📥 Filtered request received:', {
        tableName,
        searchField,
        searchText,
        dateRange,
        city,
        paginationContext
      });
      
      if (!tableName) {
        return res.status(400).json({
          success: false,
          message: 'tableName is required'
        });
      }
      
      // Check if at least one filter is provided
      const hasSearchFilter = searchField && (searchText !== undefined && searchText !== null);
      const hasDateFilter = dateRange && dateRange.start && dateRange.end;
      
      if (!hasSearchFilter && !hasDateFilter) {
        return res.status(400).json({
          success: false,
          message: 'At least one filter is required: (searchField + searchText) or dateRange'
        });
      }
      
      // If search filter is provided, validate both field and text
      if (searchField && (searchText === undefined || searchText === null)) {
        return res.status(400).json({
          success: false,
          message: 'searchText is required when searchField is provided'
        });
      }
      
      if (searchText && !searchField) {
        return res.status(400).json({
          success: false,
          message: 'searchField is required when searchText is provided'
        });
      }
      
      const result = await this.dataTablesController.getFilteredData(
        tableName,
        searchField,
        searchText,
        dateRange,
        city,
        paginationContext
      );
      
      console.log('📤 Filtered response data:', {
        metadataCount: result.metadata?.length || 0,
        dataCount: result.data?.length || 0,
        pagination: result.pagination
      });
      
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Error in filtered_data endpoint:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getClientsStatus(req, res) {
    try {
      console.log('📥 Clients status request received');
      
      const result = await this.clientsStatusController.getClientsStatus();
      
      console.log('📤 Clients status response:', {
        success: result.success,
        hasData: !!result.data
      });
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in clients_status endpoint:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async clientSettings(req, res) {
    try {
      const { command, client_id, client_ids, settings } = req.body;
      
      console.log('📥 Client settings request received:', {
        command,
        client_id,
        client_ids_count: client_ids?.length,
        settingsCount: settings?.length
      });
      
      if (!command) {
        return res.status(400).json({
          success: false,
          message: 'command is required (get, update, or bulk_update)'
        });
      }
      
      let result;
      
      if (command === 'get') {
        if (!client_id) {
          return res.status(400).json({
            success: false,
            message: 'client_id is required for get command'
          });
        }

        result = await this.clientsSettings.getbyId(client_id);
        
        console.log('📤 Client settings response:', {
          success: result.success,
          totalRecords: result.totalRecords
        });
      } else if (command === 'update') {
        if (!client_id) {
          return res.status(400).json({
            success: false,
            message: 'client_id is required for update command'
          });
        }

        if (!settings || !Array.isArray(settings) || settings.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'settings array is required for update command (e.g., [{key: "STOP_FLAG", value: "0"}])'
          });
        }
        
        result = await this.clientsSettings.updateById(client_id, settings);
        
        console.log('📤 Update client settings response:', {
          success: result.success,
          message: result.message,
          totalUpdated: result.data?.totalUpdated
        });
      } else if (command === 'bulk_update') {
        if (!client_ids || !Array.isArray(client_ids) || client_ids.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'client_ids array is required for bulk_update command'
          });
        }

        if (!settings || !Array.isArray(settings) || settings.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'settings array is required for bulk_update command (e.g., [{key: "STOP_FLAG", value: "0"}])'
          });
        }
        
        result = await this.clientsSettings.updateBulk(client_ids, settings);
        
        console.log('📤 Bulk update client settings response:', {
          success: result.success,
          message: result.message,
          totalUpdated: result.data?.totalUpdated,
          clientsProcessed: result.data?.clientsProcessed
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid command. Use "get", "update", or "bulk_update"'
        });
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in client_settings endpoint:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async clients_by_plaza(req, res) {
    try {
      const { city } = req.body;

      console.log(' Clients by plaza request received:', {
        city
      });
      
      const result = await this.clientsList.get_by_city(city);
      console.log('📤 Clients by plaza response:', {
        success: result.success,
        totalRecords: result.totalRecords
      });
      res.status(200).json(result);  


    } catch (error) {
      console.error('Error in clients_by_plaza endpoint:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      }); 
    }
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new Routes();
