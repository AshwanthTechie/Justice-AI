const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api/rag';

async function testKeywordExtraction() {
    console.log('🧪 Testing Keyword Extraction vs Raw Search\n');
    
    const testQueries = [
        "What is the punishment for murder under IPC?",
        "Can I get bail in a dowry harassment case?", 
        "What are the grounds for divorce in Hindu Marriage Act?",
        "Is Section 498A bailable or non-bailable?",
        "What is the procedure for filing an FIR?"
    ];

    for (const query of testQueries) {
        console.log(`\n📝 Testing Query: "${query}"`);
        console.log('=' .repeat(60));
        
        try {
            // Test with processed keywords
            console.log('\n🎯 With Keyword Processing:');
            const processedResponse = await axios.get(`${BASE_URL}/cases`, {
                params: { q: query }
            });
            
            console.log(`Original Query: ${processedResponse.data.originalQuery}`);
            console.log(`Processed Keywords: ${processedResponse.data.processedKeywords}`);
            console.log(`Total Similar Cases: ${processedResponse.data.total}`);
            
            if (processedResponse.data.cases.length > 0) {
                const topCase = processedResponse.data.cases[0];
                console.log('Top Case:', topCase.title?.substring(0, 100) + '...');
                if (topCase.id) {
                    console.log(`Navigate to: http://localhost:3000/case/${topCase.id}`);
                }
            }
            
            // Test with raw query
            console.log('\n📄 With Raw Query:');
            const rawResponse = await axios.get(`${BASE_URL}/cases-raw`, {
                params: { q: query }
            });
            
            console.log(`Raw Query: ${rawResponse.data.query}`);
            console.log(`Total Similar Cases: ${rawResponse.data.total}`);
            
            if (rawResponse.data.cases.length > 0) {
                const topCase = rawResponse.data.cases[0];
                console.log('Top Case:', topCase.title?.substring(0, 100) + '...');
                if (topCase.id) {
                    console.log(`Navigate to: http://localhost:3000/case/${topCase.id}`);
                }
            }
            
            // Compare results
            const improvement = processedResponse.data.total - rawResponse.data.total;
            console.log(`\n📊 Improvement: ${improvement > 0 ? '+' : ''}${improvement} cases`);
            
        } catch (error) {
            console.error(`❌ Error testing query: ${error.message}`);
            if (error.response?.data) {
                console.error('Response:', error.response.data);
            }
        }
        
        // Wait between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Run the test
testKeywordExtraction().catch(console.error);