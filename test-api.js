// Simple test script to verify API endpoints
const API_BASE = 'http://localhost:7777';

async function testEndpoints() {
    console.log('Testing API endpoints...');
    
    // Test 1: Test endpoint
    try {
        const response = await fetch(`${API_BASE}/user/test`);
        const data = await response.text();
        console.log('✅ Test endpoint:', response.status, data);
    } catch (error) {
        console.log('❌ Test endpoint failed:', error.message);
    }
    
    // Test 2: Registration endpoint
    try {
        const response = await fetch(`${API_BASE}/user/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstname: 'Test',
                lastname: 'User',
                email: 'test@example.com',
                password: 'password123'
            })
        });
        const data = await response.text();
        console.log('✅ Registration endpoint:', response.status, data);
    } catch (error) {
        console.log('❌ Registration endpoint failed:', error.message);
    }
}

// Run tests
testEndpoints();
