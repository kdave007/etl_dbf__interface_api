const express = require('express');
const router = express.Router();
const db = require('../db/Database');

class Routes {
  constructor() {
    this.router = router;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/default_data', this.defaultData.bind(this));
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

  getRouter() {
    return this.router;
  }
}

module.exports = new Routes();
