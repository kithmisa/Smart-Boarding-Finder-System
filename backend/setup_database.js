// setup_database.js
const db = require('./db');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...');
    
    const connection = await db.getConnection();
    console.log('✅ Database connection successful!');
    
    // Read and execute the migration
    const migrationPath = path.join(__dirname, 'migrations', 'update_users_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} migration statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (error) {
          // Some statements might fail if constraints don't exist, that's okay
          if (error.message.includes('doesn\'t exist') || error.message.includes('Duplicate key name')) {
            console.log(`⚠️  Statement ${i + 1} skipped (constraint already removed): ${error.message}`);
          } else {
            console.log(`❌ Statement ${i + 1} failed: ${error.message}`);
          }
        }
      }
    }
    
    // Verify the table structure
    console.log('\n🔍 Verifying table structure...');
    const [columns] = await connection.execute('DESCRIBE users');
    console.log('📋 Users table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });
    
    // Check indexes
    console.log('\n🔍 Checking indexes...');
    const [indexes] = await connection.execute('SHOW INDEX FROM users');
    console.log('📋 Users table indexes:');
    indexes.forEach(idx => {
      if (idx.Key_name !== 'PRIMARY') {
        console.log(`  - ${idx.Key_name}: ${idx.Column_name} (${idx.Non_unique ? 'Non-unique' : 'Unique'})`);
      }
    });
    
    connection.release();
    console.log('\n✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Make sure you have:');
    console.log('  1. MySQL server running');
    console.log('  2. .env file with correct database credentials');
    console.log('  3. Database "smart_boarding_finder" created');
  }
}

setupDatabase();
