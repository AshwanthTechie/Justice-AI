const axios = require('axios');

const BASE_URL = 'http://localhost:7777';

async function testSimilarCases() {
  try {
    console.log('🧪 Testing Similar Cases API...\n');

    // Test 1: Get similar cases for a case ID
    console.log('1. Testing similar cases endpoint...');
    const caseId = '123456'; // Replace with an actual case ID from your database
    
    try {
      const response = await axios.get(`${BASE_URL}/api/cases/similar/${caseId}`, {
        params: {
          page: 0,
          size: 5
        }
      });
      
      console.log('✅ Similar cases response:');
      console.log(`   - Total cases: ${response.data.totalElements}`);
      console.log(`   - Current page: ${response.data.currentPage + 1}`);
      console.log(`   - Total pages: ${response.data.totalPages}`);
      console.log(`   - Cases returned: ${response.data.cases.length}`);
      console.log(`   - Has next: ${response.data.hasNext}`);
      console.log(`   - Has previous: ${response.data.hasPrevious}`);
      
      if (response.data.cases.length > 0) {
        console.log('\n   Sample case:');
        const sampleCase = response.data.cases[0];
        console.log(`   - ID: ${sampleCase.id}`);
        console.log(`   - Title: ${sampleCase.title?.substring(0, 80)}...`);
        console.log(`   - Court: ${sampleCase.court}`);
        console.log(`   - Date: ${sampleCase.date}`);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('⚠️  Case not found - this is expected if the case ID doesn\'t exist');
      } else {
        console.log('❌ Error:', error.response?.data?.error || error.message);
      }
    }

    // Test 2: Test pagination
    console.log('\n2. Testing pagination...');
    try {
      const page1 = await axios.get(`${BASE_URL}/api/cases/similar/${caseId}`, {
        params: { page: 0, size: 3 }
      });
      
      const page2 = await axios.get(`${BASE_URL}/api/cases/similar/${caseId}`, {
        params: { page: 1, size: 3 }
      });
      
      console.log('✅ Pagination test:');
      console.log(`   - Page 1 cases: ${page1.data.cases.length}`);
      console.log(`   - Page 2 cases: ${page2.data.cases.length}`);
      console.log(`   - Page 1 has next: ${page1.data.hasNext}`);
      console.log(`   - Page 2 has previous: ${page2.data.hasPrevious}`);
    } catch (error) {
      console.log('❌ Pagination test failed:', error.response?.data?.error || error.message);
    }

    // Test 3: Test size limits
    console.log('\n3. Testing size limits...');
    try {
      const largeSize = await axios.get(`${BASE_URL}/api/cases/similar/${caseId}`, {
        params: { page: 0, size: 10 } // Should be limited to 5
      });
      
      console.log('✅ Size limit test:');
      console.log(`   - Requested size: 10`);
      console.log(`   - Actual page size: ${largeSize.data.pageSize}`);
      console.log(`   - Cases returned: ${largeSize.data.cases.length}`);
    } catch (error) {
      console.log('❌ Size limit test failed:', error.response?.data?.error || error.message);
    }

    console.log('\n🎉 Similar Cases API testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSimilarCases();