# Enhanced RAG System with IndianKanoon Integration

This enhanced RAG (Retrieval-Augmented Generation) system combines local document search with IndianKanoon case references and AI-powered summaries using Google Gemini.

## Features

### 🤖 AI-Powered Summaries
- Uses Google Gemini to generate comprehensive legal analysis
- Combines local documents and case references for context
- Provides structured, markdown-formatted responses

### ⚖️ IndianKanoon Case References
- Real-time case search from IndianKanoon API
- Extracts case titles, courts, dates, citations, and summaries
- Supports legal terminology recognition (IPC sections, Articles, etc.)

### 📚 Local Document RAG
- Vector-based similarity search using embeddings
- Supports document chunking and indexing
- Cosine similarity matching for relevant content

## API Endpoints

### Enhanced RAG Query
```
GET /api/rag/query?q={query}&k={limit}
```
Returns AI summary with case references and local documents.

**Response:**
```json
{
  "query": "IPC 302 murder cases",
  "summary": "AI-generated comprehensive analysis...",
  "localDocuments": [...],
  "caseReferences": [...],
  "totalCases": 25
}
```

### Case References Only
```
GET /api/rag/cases?q={query}
```
Returns only IndianKanoon case references.

### Local Documents Only
```
GET /api/rag/search?q={query}&k={limit}
```
Returns only local document matches.

### Index Case Document
```
POST /api/rag/index-case
{
  "caseId": "case_001",
  "caseData": {
    "title": "Case Title",
    "court": "Supreme Court",
    "date": "2023-01-01",
    ...
  }
}
```

## Configuration

### 1. IndianKanoon API Key
Add your IndianKanoon API key to `application.yml`:
```yaml
indiankanoon:
  api:
    key: YOUR_INDIANKANOON_API_KEY
    baseUrl: https://api.indiankanoon.org
```

### 2. Gemini API Key
The Gemini API key is already configured:
```yaml
gemini:
  api:
    key: AIzaSyA-uOb4Rc3klyE4SPZIpsXXj0xKa2_vQNg
  chatModel: gemini-2.5-flash
  embedModel: embedding-001
```

## Usage Examples

### Backend Testing
```bash
# Run the test script
node test-enhanced-rag.js
```

### Frontend Integration
```javascript
import ragService from './services/ragService';

// Enhanced search with AI summary
const result = await ragService.queryWithReferences('IPC 302 murder cases');
console.log(result.summary); // AI-generated analysis
console.log(result.caseReferences); // IndianKanoon cases
console.log(result.localDocuments); // Local documents

// Case references only
const cases = await ragService.getCaseReferences('dowry death');
console.log(cases.cases); // Array of case references
```

### React Component
Use the `EnhancedSearch` component:
```jsx
import EnhancedSearch from './components/EnhancedSearch';

function App() {
  return (
    <div>
      <EnhancedSearch />
    </div>
  );
}
```

## Query Examples

### Legal Terminology
- `"IPC 302 murder cases"` - Finds murder cases under IPC Section 302
- `"Article 21 right to life"` - Constitutional cases on right to life
- `"Section 498A dowry harassment"` - Dowry-related cases

### General Legal Queries
- `"bail provisions in criminal law"`
- `"contract breach remedies"`
- `"property dispute resolution"`
- `"consumer protection rights"`

## System Architecture

```
User Query
    ↓
Enhanced RAG Service
    ├── Local RAG Search (Vector Similarity)
    ├── IndianKanoon API (Case References)
    └── Gemini AI (Summary Generation)
    ↓
Comprehensive Response
```

## Benefits

1. **Comprehensive Coverage**: Combines multiple data sources
2. **AI-Powered Analysis**: Intelligent summarization and legal analysis
3. **Real-time Case Law**: Up-to-date case references from IndianKanoon
4. **Contextual Responses**: Uses both local knowledge and external references
5. **Structured Output**: Well-formatted responses with proper citations

## Getting Started

1. **Start Backend**:
   ```bash
   cd doj-chatbot-backend
   mvn spring-boot:run
   ```

2. **Start Frontend**:
   ```bash
   cd doj-chatbot
   npm run dev
   ```

3. **Test the System**:
   ```bash
   node test-enhanced-rag.js
   ```

4. **Access Frontend**: Open http://localhost:5173 and use the Enhanced Search component

## Troubleshooting

### Common Issues

1. **IndianKanoon API Key Missing**:
   - Add your API key to `application.yml`
   - The system will work without it but won't provide case references

2. **Gemini API Errors**:
   - Check if the API key is valid
   - Ensure you have sufficient quota

3. **No Local Documents**:
   - Index some documents first using `/api/rag/upsert`
   - The system will still provide case references and AI analysis

### Performance Tips

1. **Limit Results**: Use the `k` parameter to limit results for faster responses
2. **Cache Results**: The IndianKanoon service includes built-in caching
3. **Batch Indexing**: Index multiple documents at once for better performance

## Future Enhancements

- [ ] Support for more legal databases
- [ ] Advanced query preprocessing
- [ ] Citation extraction and validation
- [ ] Multi-language support
- [ ] Legal document classification
- [ ] Precedent analysis and ranking