// Backend API Testing Script
const testEndpoints = async () => {
  const endpoints = [
    'https://client.voidworksgroup.co.uk',
    'https://voidworksgroup.co.uk',
    'https://client.voidworksgroup.co.uk/api/health',
    'https://voidworksgroup.co.uk/api/health',
    'https://client.voidworksgroup.co.uk/api/auth/login/client',
    'https://voidworksgroup.co.uk/api/auth/login/admin'
  ];

  console.log('🔍 Testing Backend Endpoints...\n');

  for (const url of endpoints) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log(`✅ Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.text();
        console.log(`📄 Response: ${data.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log('---');
  }
};

testEndpoints();