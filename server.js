const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db/Database');
const routes = require('./routes/Routes');
const RawDataModel = require('./models/raw_data');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Allow Angular app to connect
app.use(express.json()); // Parse JSON requests

// Basic route - test it works
app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// API routes
app.use('/api', routes.getRouter());

// Test database connection
async function testDatabaseConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('✅ Database connected successfully at:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Test RawDataModel queries (for debugging)
async function testRawDataModel() {
  try {
    const rawData = new RawDataModel();
    
    // Test getTableMetadata - replace 'your_table_name' with an actual table
    const tableName = 'cunota'; // TODO: Change this to your actual table name
    console.log(`\n🔍 Testing getTableMetadata for table: ${tableName}`);
    const metadata = await rawData.getTableMetadata(tableName);
    console.log('✅ Table metadata fields found ::', metadata.length)
    
    // Test getPaginatedData with filters
    const dateRange = { start: '2024-01-01', end: '2024-12-31' };
    const city = 'Xalap'; // Change to actual city/PLAZA value
    const data = await rawData.getPaginatedData(tableName, dateRange, city, 1, 50);
    console.log('✅ Paginated data records found ::', data.length);
    
    // Test without date filter (but city is required)
    const dataNoFilter = await rawData.getPaginatedData(tableName, null, city, 1, 10);
    console.log('✅ Paginated data (no date filter) records found ::', dataNoFilter.length);
    
    // Test getTotalCount
    const total_by_client = await rawData.getTotalCount(tableName);
    console.log('✅ Total records by client ::', total_by_client);
    
    // Test getFilteredPaginated
    const filteredData = await rawData.getFilteredPaginated('_client_id', 1, tableName, 1, 20);
    console.log('✅ Filtered paginated data records found ::', filteredData.length);
    
    // Add more tests here as you implement other methods
    
  } catch (error) {
    console.error('❌ RawDataModel test failed:', error.message);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await testDatabaseConnection();
  // await testRawDataModel();
});