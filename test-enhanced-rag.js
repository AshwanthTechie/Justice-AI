const axios = require('axios');

const BASE_URL = 'http://localhost:7777';

// Test queries
const testQueries = [
    'IPC 302 murder cases',
    'Article 21 right to life',
    'dowry death cases',
    'bail provisions in criminal law',
    'contract breach remedies'
];

async function testEnhancedRAG() {
    console.log('🚀 Testing Enhanced RAG with IndianKanoon Integration\n');

    for (const query of testQueries) {
        console.log(`\n📝 Testing query: "${query}"`);
        console.log('=' .repeat(50));

        try {
            // Test enhanced RAG query
            console.log('\n1. Enhanced RAG Query (AI + Cases + Documents):');
            const enhancedResponse = await axios.get(`${BASE_URL}/api/rag/query`, {
                params: { q: query, k: 3 }
            });
            
            const result = enhancedResponse.data;
            console.log(`   ✅ Query processed successfully`);
            console.log(`   📊 Found ${result.totalCases} case references`);
            console.log(`   📄 Found ${result.localDocuments?.length || 0} local documents`);
            console.log(`   🤖 AI Summary: ${result.summary?.substring(0, 100)}...`);

            // Test case references only
            console.log('\n2. Case References Only:');
            const casesResponse = await axios.get(`${BASE_URL}/api/rag/cases`, {
                params: { q: query }
            });
            
            const casesResult = casesResponse.data;
            console.log(`   ⚖️ Found ${casesResult.total} cases from IndianKanoon`);
            
            if (casesResult.cases.length > 0) {
                const firstCase = casesResult.cases[0];
                console.log(`   📋 First case: ${firstCase.title || 'Untitled'}`);
                console.log(`   🏛️ Court: ${firstCase.court || 'Unknown'}`);
                console.log(`   📅 Date: ${firstCase.date || 'Unknown'}`);
            }

            // Test local documents only
            console.log('\n3. Local Documents Only:');
            const docsResponse = await axios.get(`${BASE_URL}/api/rag/search`, {
                params: { q: query, k: 3 }
            });
            
            console.log(`   📚 Found ${docsResponse.data.length} relevant local documents`);

        } catch (error) {
            console.error(`   ❌ Error testing query "${query}":`, error.message);
            if (error.response) {
                console.error(`   📄 Response status: ${error.response.status}`);
                console.error(`   📄 Response data:`, error.response.data);
            }
        }

        console.log('\n' + '-'.repeat(50));
    }
}

async function testCaseIndexing() {
    console.log('\n🗂️ Testing Case Indexing\n');

    const sampleCase = {
        caseId: 'test_case_001',
        caseData: {
            title: 'State of Maharashtra v. Ajmal Kasab',
            court: 'Supreme Court of India',
            date: '2012-08-29',
            citation: '(2012) 9 SCC 1',
            judge: 'Aftab Alam, J.',
            petitioner: 'State of Maharashtra',
            respondent: 'Ajmal Kasab',
            act: 'Indian Penal Code',
            section: '302, 121, 121A',
            snippet: 'This case deals with the terrorist attack on Mumbai on 26/11/2008. The court upheld the death sentence for the accused.'
        }
    };

    try {
        const response = await axios.post(`${BASE_URL}/api/rag/index-case`, sampleCase);
        console.log('✅ Case indexed successfully:', response.data);
    } catch (error) {
        console.error('❌ Error indexing case:', error.message);
        if (error.response) {
            console.error('📄 Response data:', error.response.data);
        }
    }
}

async function runTests() {
    console.log('🧪 Enhanced RAG System Test Suite');
    console.log('==================================\n');

    // Check if backend is running
    try {
        await axios.get(`${BASE_URL}/api/rag/search?q=test&k=1`);
        console.log('✅ Backend is running and accessible\n');
    } catch (error) {
        console.error('❌ Backend is not accessible. Please start the backend server first.');
        console.error('   Run: cd doj-chatbot-backend && mvn spring-boot:run');
        return;
    }

    await testEnhancedRAG();
    await testCaseIndexing();

    console.log('\n🎉 Test suite completed!');
    console.log('\n💡 Tips:');
    console.log('   - IndianKanoon API key is configured: 13c0888d0cb03bf0352b22528bfd9581277eb79c');
    console.log('   - The Gemini API key is already configured');
    console.log('   - Try the enhanced search in the frontend at http://localhost:5173');
}

// Run the tests
runTests().catch(console.error);