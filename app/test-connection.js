import { supabase } from './_lib/supabase';

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test connection by fetching the first cabin
    const { data, error } = await supabase
      .from('cabins')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Connection successful!');
    console.log('Retrieved data:', data);
    return true;
  } catch (error) {
    console.error('❌ Error testing connection:', error.message);
    return false;
  }
}

// Run the test
testConnection();
