const db = require('../db/Database');
const tableSchemas = require('../utils/tables_schemas.json');

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
 async getPaginatedData(tableName, dateRange, city, page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize;
  
  let whereClauses = [];
  let params = [];
  let paramIndex = 1;
  
  const tableConfig = tableSchemas.tables[tableName.toUpperCase()];
  
  if (dateRange && dateRange.start && dateRange.end && tableConfig?.date) {
    const dateField = tableConfig.date_field ;
    whereClauses.push(`${dateField} BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
    params.push(dateRange.start, dateRange.end);
    paramIndex += 2;
  }
  
  if (city) {
    whereClauses.push(`PLAZA = $${paramIndex}`);
    params.push(city);
    paramIndex += 1;
  }
  
  const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  
  const query = `
    SELECT * FROM ${tableName}
    ${whereClause}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
  `;
  
  params.push(pageSize, offset);
  
  const result = await this.db.query(query, params);
  return result.rows;
}

  async getFilteredPaginated(field, value, tableName, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
  
    // Get table metadata to validate field exists
    const metadata = await this.getTableMetadata(tableName);
    const allowedFields = metadata.map(col => col.column_name);
  
    if (!allowedFields.includes(field)) {
      throw new Error(`Invalid field: ${field}. Field does not exist in table ${tableName}`);
    }
  
    // Use parameterized query for the value to prevent SQL injection
    const query = `
      SELECT * FROM ${tableName}
      WHERE ${field} = $1
      LIMIT $2 OFFSET $3;
    `;
  
    const result = await this.db.query(query, [value, pageSize, offset]);
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