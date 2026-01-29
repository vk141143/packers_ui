// Test Authentication Endpoints
const testAuth = async () => {
  console.log('🔐 Testing Authentication Endpoints...\n');

  // Test client login endpoint
  try {
    console.log('Testing Client Login...');
    const response = await fetch('https://client.voidworksgroup.co.uk/api/auth/login/client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    });
    
    console.log(`Status: ${response.status}`);
    const data = await response.text();
    console.log(`Response: ${data.substring(0, 200)}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  console.log('\n---\n');

  // Test admin login endpoint
  try {
    console.log('Testing Admin Login...');
    const response = await fetch('https://voidworksgroup.co.uk/api/auth/login/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'adminpassword'
      })
    });
    
    console.log(`Status: ${response.status}`);
    const data = await response.text();
    console.log(`Response: ${data.substring(0, 200)}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

testAuth();