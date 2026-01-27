// Debug script to identify and fix application issues
console.log('🔍 Starting application debug...');

// Check for common issues
function debugApplication() {
  console.log('📋 Application Debug Report');
  console.log('==========================');
  
  // 1. Check localStorage
  console.log('1. LocalStorage Status:');
  try {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    console.log('   - Access Token:', token ? 'Present' : 'Missing');
    console.log('   - User Data:', userData ? 'Present' : 'Missing');
    
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log('   - User Role:', parsed.role);
      } catch (e) {
        console.log('   - User Data Parse Error:', e.message);
      }
    }
  } catch (e) {
    console.log('   - LocalStorage Error:', e.message);
  }
  
  // 2. Check environment variables
  console.log('\n2. Environment Variables:');
  console.log('   - NODE_ENV:', import.meta?.env?.NODE_ENV || 'undefined');
  console.log('   - DEV Mode:', import.meta?.env?.DEV || 'undefined');
  console.log('   - PROD Mode:', import.meta?.env?.PROD || 'undefined');
  
  // 3. Check API endpoints
  console.log('\n3. API Configuration:');
  console.log('   - Client API:', import.meta?.env?.VITE_CLIENT_API_URL || '/api (proxy)');
  console.log('   - Crew API:', import.meta?.env?.VITE_CREW_API_URL || '/crew-api (proxy)');
  
  // 4. Check React Router
  console.log('\n4. Current Location:');
  console.log('   - URL:', window.location.href);
  console.log('   - Pathname:', window.location.pathname);
  console.log('   - Hash:', window.location.hash);
  
  // 5. Check for errors in console
  console.log('\n5. Console Errors:');
  const originalError = console.error;
  let errorCount = 0;
  console.error = function(...args) {
    errorCount++;
    console.log(`   - Error ${errorCount}:`, args[0]);
    originalError.apply(console, args);
  };
  
  console.log('✅ Debug report complete');
}

// Clear corrupted data function
function clearCorruptedData() {
  console.log('🧹 Clearing potentially corrupted data...');
  try {
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ Storage cleared successfully');
  } catch (e) {
    console.log('❌ Error clearing storage:', e.message);
  }
}

// Initialize debug
if (typeof window !== 'undefined') {
  window.debugApp = debugApplication;
  window.clearAppData = clearCorruptedData;
  
  // Auto-run debug on load
  setTimeout(debugApplication, 1000);
}

export { debugApplication, clearCorruptedData };