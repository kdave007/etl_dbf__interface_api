

const RawDataModel = require('../models/raw_data');
const tableSchemas = require('../utils/tables_schemas.json');

class DataTablesController{
    constructor(){
        this.rawDataModel = new RawDataModel();
    }

    async getFilteredData(tableName, filterField, fieldValue, paginationContext = {}) {
       const { page = 1, pageSize = 10 } = paginationContext;
       
       const metadata = await this.rawDataModel.getTableMetadata(tableName);
       const data = await this.rawDataModel.getFilteredPaginated(filterField, fieldValue, tableName, page, pageSize);
       
       return {
           metadata,
           data,
           pagination: {
               page,
               pageSize,
               totalRecords: data.length
           }
       };
    }

    async getData(tableName, dateRange, city,  paginationContext = {}){
        const { page = 1, pageSize = 10 } = paginationContext;
        
        const metadata = await this.rawDataModel.getTableMetadata(tableName);
        const data = await this.rawDataModel.getPaginatedData(tableName, dateRange, city, page, pageSize);
        const tableConfig = tableSchemas.tables[tableName.toUpperCase()] || { date: false };

        console.log('META ',metadata)

          return {
           metadata,
           data,
           tableConfig,
           pagination: {
               page,
               pageSize,
               totalRecords: data.length
           }
       };
    }

 
}

module.exports = DataTablesController;