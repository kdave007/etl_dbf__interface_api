const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db/Database');
const routes = require('./routes/Routes');
const RawDataModel = require('./models/raw_data');

const app = express();
const PORT = process.env.PORT || 3001;

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
    const data = await rawData.getPaginatedData(tableName,2,10);
    console.log('✅ Table data records found ::', data)
    // console.log('✅ Table metadata:', JSON.stringify(metadata, null, 2));
    
    // Add more tests here as you implement other methods
    
  } catch (error) {
    console.error('❌ RawDataModel test failed:', error.message);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await testDatabaseConnection();
  await testRawDataModel();
});