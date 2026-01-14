

const RawDataModel = require('../models/raw_data');
const tableSchemas = require('../utils/tables_schemas.json');

class DataTablesController{
    constructor(){
        this.rawDataModel = new RawDataModel();
    }

    async getFilteredData(tableName, filterField, fieldValue, dateRange = null, city = null, paginationContext = {}) {
       const { page = 1, pageSize = 10 } = paginationContext;
       
       const metadata = await this.rawDataModel.getTableMetadata(tableName);
       const result = await this.rawDataModel.getFilteredPaginated(
           filterField, 
           fieldValue, 
           tableName, 
           dateRange, 
           city, 
           page, 
           pageSize
       );
       const tableConfig = tableSchemas.tables[tableName.toUpperCase()] || { date: false };
       
       return {
           metadata,
           data: result.rows,
           tableConfig,
           pagination: {
               page,
               pageSize,
               totalRecords: result.totalCount
           }
       };
    }

    async getData(tableName, dateRange, city,  paginationContext = {}){
        const { page = 1, pageSize = 10 } = paginationContext;
        
        const metadata = await this.rawDataModel.getTableMetadata(tableName);
        const result = await this.rawDataModel.getPaginatedData(tableName, dateRange, city, page, pageSize);
        const tableConfig = tableSchemas.tables[tableName.toUpperCase()] || { date: false };

          return {
           metadata,
           data: result.rows,
           tableConfig,
           pagination: {
               page,
               pageSize,
               totalRecords: result.totalCount
           }
       };
    }

 
}

module.exports = DataTablesController;