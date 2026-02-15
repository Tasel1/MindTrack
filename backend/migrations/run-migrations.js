#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

// Import database connection
const db = require('../src/config/database');

async function runMigrations() {
  console.log('Starting database migrations...');
  
  const fs = require('fs');
  const path = require('path');
  
  // Define migration files explicitly
  const migrationFiles = [
    '001_create_users_table.sql',
    '002_create_emotions_table.sql',
    '003_create_entries_table.sql',
    '004_create_tags_table.sql',
    '005_create_entry_tags_table.sql',
    '006_create_schools_table.sql'
  ];

  console.log(`Found ${migrationFiles.length} migration files`);

  for (const fileName of migrationFiles) {
    const filePath = path.join(__dirname, fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`Migration file does not exist: ${filePath}`);
      continue;
    }
    
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log(`Executing migration: ${fileName}`);
    
    try {
      await db.query(sql);
      console.log(`✓ Migration ${fileName} completed successfully`);
    } catch (error) {
      console.error(`✗ Error executing migration ${fileName}:`, error.message);
      throw error;
    }
  }

  console.log('All migrations completed successfully!');
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migrations finished.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };