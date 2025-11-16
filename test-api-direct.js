// Direct API test for Indian Kanoon
// This tests the API directly without going through our backend

import axios from 'axios';

async function testIndianKanoonDirectly() {
  console.log('🧪 Testing Indian Kanoon API directly...\n');

  const API_KEY = '13c0888d0cb03bf0352b22528bfd9581277eb79c';
  const BASE_URL = 'https://api.indiankanoon.org';

  try {
    // Test 1: Simple search
    console.log('1. Testing simple search...');
    const searchUrl = `${BASE_URL}/search/`;

    const response = await axios.post(searchUrl,
      new URLSearchParams({
        'formInput': 'contract',
        'format': 'json'
      }), {
      headers: {
        'Authorization': `Token ${API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'DOJ-Chatbot/1.0'
      }
    });

    console.log('✅ Direct API call successful!');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Response type:', typeof response.data);
    console.log('Response length:', response.data ? response.data.length : 'undefined');

    let responseText = '';
    if (typeof response.data === 'string') {
      responseText = response.data;
    } else {
      responseText = JSON.stringify(response.data);
    }

    console.log('Response preview:', responseText.substring(0, 500));

    // Try to parse as JSON
    try {
      let jsonData;
      if (typeof response.data === 'object') {
        jsonData = response.data;
      } else {
        jsonData = JSON.parse(responseText);
      }
      console.log('✅ JSON parsing successful!');
      console.log('JSON keys:', Object.keys(jsonData));
      console.log('JSON structure:', JSON.stringify(jsonData, null, 2).substring(0, 1000));
    } catch (jsonError) {
      console.log('❌ JSON parsing failed:', jsonError.message);
      console.log('Response might be HTML or other format');
    }

  } catch (error) {
    console.error('❌ Direct API test failed:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    }
    
    console.log('\n💡 Possible issues:');
    console.log('1. API key might be invalid or expired');
    console.log('2. API endpoint might have changed');
    console.log('3. Rate limiting or quota exceeded');
    console.log('4. Network connectivity issues');
  }
}

// Run the test
testIndianKanoonDirectly();
