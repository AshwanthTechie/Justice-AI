async function testBackend() {
  console.log('🧪 Testing backend API...\n');

  const BASE_URL = 'http://localhost:7777';

  try {
    // Test 1: Get chat list
    console.log('1. Testing get chat list...');
    const response = await fetch(`${BASE_URL}/api/chat/list`);
    const data = await response.json();
    console.log('✅ Get chat list successful!');
    console.log('Status:', response.status);
    console.log('Data:', data);

    // Test 2: Send message to new chat
    console.log('\n2. Testing send message to new chat...');
    const messageResponse = await fetch(`${BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'What is IPC 302?',
        title: 'Test Legal Query'
      })
    });
    const messageData = await messageResponse.json();
    console.log('✅ Send message successful!');
    console.log('Status:', messageResponse.status);
    console.log('Data:', messageData);

  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
  }
}

testBackend();
