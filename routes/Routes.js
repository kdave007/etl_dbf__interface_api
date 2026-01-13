const express = require('express');
const router = express.Router();
const db = require('../db/Database');
const DataTablesController = require('../controllers/data_tables');

class Routes {
  constructor() {
    this.router = router;
    this.dataTablesController = new DataTablesController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/default_data', this.defaultData.bind(this));
    this.router.post('/paginated_data', this.getPaginatedData.bind(this));
    this.router.post('/filtered_data', this.getFilteredData.bind(this));
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
      const { tableName, searchField, searchText, paginationContext } = req.body;
      
      console.log('📥 Filtered request received:', {
        tableName,
        searchField,
        searchText,
        paginationContext
      });
      
      if (!tableName) {
        return res.status(400).json({
          success: false,
          message: 'tableName is required'
        });
      }
      
      if (!searchField) {
        return res.status(400).json({
          success: false,
          message: 'searchField is required'
        });
      }
      
      if (searchText === undefined || searchText === null) {
        return res.status(400).json({
          success: false,
          message: 'searchText is required'
        });
      }
      
      const result = await this.dataTablesController.getFilteredData(
        tableName,
        searchField,
        searchText, 
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

  getRouter() {
    return this.router;
  }
}

module.exports = new Routes();
