const API_KEY = 'AIzaSyA-uOb4Rc3klyE4SPZIpsXXj0xKa2_vQNg';

async function listModels() {
    console.log('Listing available Gemini models...');

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Response status:', response.status);
        if (response.ok) {
            console.log('Available models:');
            data.models.forEach(model => {
                console.log(`- ${model.name}: ${model.description}`);
                console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
            });
        } else {
            console.log('❌ Error:', data.error);
        }
    } catch (error) {
        console.log('❌ Network Error:', error.message);
    }
}

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}`);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    const requestBody = {
        contents: [{
            role: 'user',
            parts: [{ text: 'Hello, can you respond to this test message?' }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log('Response status:', response.status);

        if (response.ok && data.candidates && data.candidates[0]) {
            const text = data.candidates[0].content.parts[0].text;
            console.log('✅ AI Response:', text);
        } else {
            console.log('❌ API Error:', data.error || 'Unknown error');
        }
    } catch (error) {
        console.log('❌ Network Error:', error.message);
    }
}

// First list models, then test the first available one
listModels().then(() => {
    // Test the stable model
    testModel('gemini-2.5-flash');
});
