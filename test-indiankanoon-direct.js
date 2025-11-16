const axios = require('axios');

const API_KEY = '13c0888d0cb03bf0352b22528bfd9581277eb79c';
const BASE_URL = 'https://api.indiankanoon.org';

async function testIndianKanoonAPI() {
    console.log('🧪 Testing IndianKanoon API Direct Connection\n');
    
    const testQueries = [
        'IPC 302',
        'murder',
        'Article 21',
        'bail'
    ];
    
    for (const query of testQueries) {
        console.log(`\n📝 Testing query: "${query}"`);
        console.log('=' .repeat(40));
        
        try {
            const encodedQuery = encodeURIComponent(query);
            const url = `${BASE_URL}/search/?formInput=${encodedQuery}&pagenum=0`;
            
            console.log(`🔗 URL: ${url}`);
            console.log(`🔑 API Key: ${API_KEY.substring(0, 8)}...`);
            
            const response = await axios.post(`${BASE_URL}/search/`, 
                `formInput=${encodedQuery}&pagenum=0`, {
                headers: {
                    'Authorization': `Token ${API_KEY}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 10000
            });
            
            console.log(`✅ Status: ${response.status}`);
            console.log(`📊 Response length: ${JSON.stringify(response.data).length}`);
            
            if (response.data && response.data.docs) {
                console.log(`📋 Found ${response.data.docs.length} documents`);
                
                if (response.data.docs.length > 0) {
                    const firstDoc = response.data.docs[0];
                    console.log(`📄 First document:`);
                    console.log(`   - ID: ${firstDoc.docid || 'N/A'}`);
                    console.log(`   - Title: ${firstDoc.title || 'N/A'}`);
                    console.log(`   - Court: ${firstDoc.court || 'N/A'}`);
                    console.log(`   - Date: ${firstDoc.date || 'N/A'}`);
                }
            } else {
                console.log('⚠️ No docs array in response');
                console.log('📄 Response structure:', Object.keys(response.data));
                console.log('📄 Response preview:', JSON.stringify(response.data).substring(0, 200));
            }
            
        } catch (error) {
            console.error(`❌ Error testing query "${query}":`, error.message);
            if (error.response) {
                console.error(`📄 Status: ${error.response.status}`);
                console.error(`📄 Response: ${JSON.stringify(error.response.data).substring(0, 200)}`);
            }
        }
    }
}

// Test document retrieval
async function testDocumentRetrieval() {
    console.log('\n\n🧪 Testing Document Retrieval\n');
    
    // Use a known document ID (this might need to be updated with a valid one)
    const testDocId = '1';
    
    try {
        const url = `${BASE_URL}/doc/${testDocId}/`;
        console.log(`🔗 URL: ${url}`);
        
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Token ${API_KEY}`,
                'Accept': 'application/json'
            },
            timeout: 10000
        });
        
        console.log(`✅ Status: ${response.status}`);
        console.log(`📊 Response length: ${JSON.stringify(response.data).length}`);
        console.log(`📄 Document structure:`, Object.keys(response.data));
        
    } catch (error) {
        console.error(`❌ Error retrieving document:`, error.message);
        if (error.response) {
            console.error(`📄 Status: ${error.response.status}`);
        }
    }
}

async function runTests() {
    console.log('🚀 IndianKanoon API Test Suite');
    console.log('==============================\n');
    
    await testIndianKanoonAPI();
    await testDocumentRetrieval();
    
    console.log('\n🎉 Test suite completed!');
}

runTests().catch(console.error);