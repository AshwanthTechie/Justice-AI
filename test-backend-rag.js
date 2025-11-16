const axios = require('axios');

const BASE_URL = 'http://localhost:7777';

async function testBackendRAG() {
    console.log('🧪 Testing Backend RAG with IndianKanoon Integration\n');

    const testQueries = [
        'IPC 302 murder',
        'Article 21 right to life',
        'bail provisions'
    ];

    for (const query of testQueries) {
        console.log(`\n📝 Testing query: "${query}"`);
        console.log('=' .repeat(50));

        try {
            // Test enhanced RAG query
            console.log('\n1. Enhanced RAG Query:');
            const enhancedResponse = await axios.get(`${BASE_URL}/api/rag/query`, {
                params: { q: query, k: 3 },
                timeout: 30000
            });
            
            const result = enhancedResponse.data;
            console.log(`   ✅ Query processed successfully`);
            console.log(`   📊 Found ${result.totalCases || 0} case references`);
            console.log(`   📄 Found ${result.localDocuments?.length || 0} local documents`);
            
            if (result.summary) {
                console.log(`   🤖 AI Summary: ${result.summary.substring(0, 150)}...`);
            }
            
            if (result.caseReferences && result.caseReferences.length > 0) {
                console.log(`   ⚖️ First case: ${result.caseReferences[0].title || 'Untitled'}`);
            }

        } catch (error) {
            console.error(`   ❌ Error testing query "${query}":`, error.message);
            if (error.response) {
                console.error(`   📄 Response status: ${error.response.status}`);
                console.error(`   📄 Response data:`, JSON.stringify(error.response.data).substring(0, 200));
            }
        }

        console.log('\n' + '-'.repeat(50));
    }
}

async function testCaseReferencesOnly() {
    console.log('\n🧪 Testing Case References Only\n');

    try {
        const response = await axios.get(`${BASE_URL}/api/rag/cases`, {
            params: { q: 'IPC 302' },
            timeout: 15000
        });
        
        const result = response.data;
        console.log(`✅ Found ${result.total || 0} cases`);
        
        if (result.cases && result.cases.length > 0) {
            console.log(`📋 First case: ${result.cases[0].title || 'Untitled'}`);
            console.log(`🏛️ Court: ${result.cases[0].court || 'Unknown'}`);
            console.log(`📅 Date: ${result.cases[0].date || 'Unknown'}`);
        }
        
    } catch (error) {
        console.error('❌ Error testing case references:', error.message);
        if (error.response) {
            console.error('📄 Response:', JSON.stringify(error.response.data).substring(0, 200));
        }
    }
}

async function runTests() {
    console.log('🚀 Backend RAG Test Suite');
    console.log('=========================\n');

    // Check if backend is running
    try {
        await axios.get(`${BASE_URL}/api/rag/search?q=test&k=1`);
        console.log('✅ Backend is running and accessible\n');
    } catch (error) {
        console.error('❌ Backend is not accessible. Please start the backend server first.');
        console.error('   Make sure the server is running on port 7777');
        return;
    }

    await testBackendRAG();
    await testCaseReferencesOnly();

    console.log('\n🎉 Test suite completed!');
}

runTests().catch(console.error);