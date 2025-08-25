// Quick script to check what houses are in your database
const db = require('./backend/db');

async function checkHouses() {
  try {
    console.log('🔍 Checking all houses in database...\n');
    
    // Get all houses
    const [allHouses] = await db.query('SELECT * FROM houses');
    console.log('📊 Total houses in database:', allHouses.length);
    
    if (allHouses.length === 0) {
      console.log('❌ No houses found in database');
      return;
    }
    
    // Show detailed info for each house
    allHouses.forEach((house, index) => {
      console.log(`\n🏠 House ${index + 1}:`);
      console.log('  ID:', house.id);
      console.log('  Title:', house.title);
      console.log('  Location:', house.location);
      console.log('  City:', house.city);
      console.log('  Gender Allowed:', house.genderAllowed);
      console.log('  Room Type:', house.roomType);
      console.log('  Type:', house.type);
      console.log('  Price:', house.price);
      console.log('  Status:', house.status);
      console.log('  Confirmed:', house.confirmed);
      console.log('  Availability Status:', house.availabilityStatus);
      console.log('  Short Term:', house.shortTerm);
    });
    
    console.log('\n' + '='.repeat(50));
    
    // Check approved houses specifically
    const [approvedHouses] = await db.query(`
      SELECT * FROM houses 
      WHERE status = 'approved' AND confirmed = 1 AND availabilityStatus = 'available'
    `);
    
    console.log('✅ Approved & Available houses:', approvedHouses.length);
    
    if (approvedHouses.length > 0) {
      console.log('\n🎯 SEARCH OPTIONS based on your data:');
      
      // Extract unique values for search options
      const locations = [...new Set(approvedHouses.map(h => h.location).filter(Boolean))];
      const genders = [...new Set(approvedHouses.map(h => h.genderAllowed).filter(Boolean))];
      const roomTypes = [...new Set(approvedHouses.map(h => h.roomType).filter(Boolean))];
      const types = [...new Set(approvedHouses.map(h => h.type).filter(Boolean))];
      const prices = approvedHouses.map(h => parseInt(h.price)).filter(Boolean);
      
      console.log('📍 Available Locations:', locations);
      console.log('👥 Available Genders:', genders);
      console.log('🏠 Available Room Types:', roomTypes);
      console.log('🏠 Available Types:', types);
      console.log('💰 Price Range:', Math.min(...prices), 'to', Math.max(...prices), 'LKR');
      
      console.log('\n🔎 EXACT SEARCH SUGGESTIONS:');
      approvedHouses.forEach((house, index) => {
        console.log(`\nFor House ${index + 1} "${house.title}":`)
        if (house.location) console.log(`  🔍 Location: "${house.location}"`);
        if (house.genderAllowed) console.log(`  🔍 Gender: "${house.genderAllowed}"`);
        if (house.roomType) console.log(`  🔍 Room Type: "${house.roomType}"`);
        const price = parseInt(house.price);
        if (price) {
          if (price <= 5000) console.log(`  🔍 Price Range: "0-5000"`);
          else if (price <= 10000) console.log(`  🔍 Price Range: "5000-10000"`);
          else if (price <= 15000) console.log(`  🔍 Price Range: "10000-15000"`);
          else console.log(`  🔍 Price Range: "15000+"`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking houses:', error);
  } finally {
    process.exit();
  }
}

checkHouses();
