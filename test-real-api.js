const { ApiIntegrationHelper } = require('./apiIntegration');

class ApiTester {
  constructor() {
    this.api = new ApiIntegrationHelper({
      baseUrl: 'https://jsonplaceholder.typicode.com',
      timeout: 10000,
      retries: 2
    });
  }

  async testGetRequest() {
    console.log('Testing GET request...');
    try {
      const response = await this.api.request('/posts/1');
      console.log('✓ GET Success:', response.status === 200);
      console.log('Data:', response.data);
    } catch (error) {
      console.log('✗ GET Failed:', error.message);
    }
  }

  async testPostRequest() {
    console.log('\nTesting POST request...');
    try {
      const response = await this.api.request('/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Post',
          body: 'Test content',
          userId: 1
        })
      });
      console.log('✓ POST Success:', response.status === 201);
      console.log('Created:', response.data);
    } catch (error) {
      console.log('✗ POST Failed:', error.message);
    }
  }

  async testErrorHandling() {
    console.log('\nTesting error handling...');
    try {
      const response = await this.api.request('/invalid-endpoint');
      console.log('Response status:', response.status);
    } catch (error) {
      console.log('✓ Error handled correctly:', error.message);
    }
  }

  async testMockMode() {
    console.log('\nTesting mock mode...');
    this.api.setTestMode(true);
    try {
      const response = await this.api.request('/any-endpoint');
      console.log('✓ Mock mode works:', response.data.message === 'Mock response');
    } catch (error) {
      console.log('✗ Mock mode failed:', error.message);
    }
    this.api.setTestMode(false);
  }

  async runAllTests() {
    console.log('Starting API Integration Tests\n');
    await this.testGetRequest();
    await this.testPostRequest();
    await this.testErrorHandling();
    await this.testMockMode();
    console.log('\nAll tests completed!');
  }
}

const tester = new ApiTester();
tester.runAllTests();