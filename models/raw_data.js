const db = require('../db/Database');

// models/RawDataModel.js
class RawDataModel {
  constructor() {
    this.db = db;
  }

  // ==================== BASIC CRUD ====================

  /**
   * Get list of all tables in the database
   */
  async getAllTables() {
    // TODO: Implement
  }

  /**
   * Get metadata/columns for a specific table
   * @param {string} tableName - Name of the table
   */
  async getTableMetadata(tableName) {
    const query = `
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position;
    `;
    
    const result = await this.db.query(query, [tableName]);
    return result.rows;
  }

  // ==================== DATA QUERIES ====================

  /**
   * Get paginated data from a table
   * @param {string} tableName - Name of the table
   * @param {number} page - Page number (1-based)
   * @param {number} pageSize - Records per page
   */
  async getPaginatedData(tableName, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    
    const query = `
      SELECT * FROM ${tableName}
      LIMIT $1 OFFSET $2;
    `;
    
    const result = await this.db.query(query, [pageSize, offset]);
    return result.rows;
  }

  /**
   * Get total record count for a table
   * @param {string} tableName - Name of the table
   */
  async getTotalCount(tableName) {
    const query = `
      SELECT _client_id, count(_client_id)  as total
      FROM ${tableName}
      GROUP BY _client_id;
    `;
    
    const result = await this.db.query(query);
    return result.rows;
  }

  // ==================== FILTERING ====================

  /**
   * Get filtered data with pagination
   * @param {string} tableName - Name of the table
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.pageSize - Records per page
   * @param {string[]} options.fields - Fields to select
   * @param {Array} options.filters - Filter conditions
   * @param {string} options.search - Global search term
   * @param {string} options.sortField - Field to sort by
   * @param {string} options.sortDirection - 'asc' or 'desc'
   */
  async getFilteredData(tableName, options = {}) {
    // TODO: Implement
  }

  // ==================== UTILITIES ====================

  /**
   * Execute a raw SQL query (for complex operations)
   * @param {string} sql - SQL query string
   * @param {Array} params - Query parameters
   */
  async executeRawQuery(sql, params = []) {
    // TODO: Implement
  }

  /**
   * Get distinct values for a column (for filter dropdowns)
   * @param {string} tableName - Name of the table
   * @param {string} columnName - Name of the column
   * @param {number} limit - Maximum number of values
   */
  async getDistinctValues(tableName, columnName, limit = 100) {
    // TODO: Implement
  }

  // ==================== ADVANCED ====================

  /**
   * Get data with joins between tables
   * @param {Object} joinConfig - Join configuration
   * @param {string} joinConfig.mainTable - Primary table
   * @param {Array} joinConfig.joins - Array of join objects
   * @param {Object} options - Query options
   */
  async getJoinedData(joinConfig, options = {}) {
    // TODO: Implement
  }

  /**
   * Export table data to CSV/JSON format
   * @param {string} tableName - Name of the table
   * @param {Object} options - Export options
   */
  async exportData(tableName, options = {}) {
    // TODO: Implement
  }
}

module.exports = RawDataModel;