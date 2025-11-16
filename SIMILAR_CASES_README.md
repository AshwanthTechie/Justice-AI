# Similar Cases Feature

This document describes the implementation of the Similar Cases feature with pagination support.

## Overview

The Similar Cases feature allows users to find up to 16 similar legal cases based on a given case, with pagination support showing 5 cases per page.

## Backend Implementation

### API Endpoint

```
GET /api/cases/similar/{caseId}?page=0&size=5
```

**Parameters:**
- `caseId` (path): The ID of the case to find similar cases for
- `page` (query, optional): Page number (default: 0)
- `size` (query, optional): Page size (default: 5, max: 5)

**Response:**
```json
{
  "cases": [
    {
      "id": "case_id",
      "title": "Case Title",
      "court": "Court Name",
      "date": "Date",
      "snippet": "Case snippet",
      "url": "Case URL"
    }
  ],
  "currentPage": 0,
  "totalPages": 4,
  "totalElements": 16,
  "pageSize": 5,
  "hasNext": true,
  "hasPrevious": false
}
```

### Database Changes

Added new methods to `CaseRepo`:

```java
@Query("SELECT c FROM Case c WHERE c.id != :excludeId AND (c.title LIKE %:keyword% OR c.snippet LIKE %:keyword% OR c.content LIKE %:keyword% OR c.court LIKE %:keyword%) ORDER BY c.createdAt DESC")
Page<Case> findSimilarCases(@Param("excludeId") Long excludeId, @Param("keyword") String keyword, Pageable pageable);
```

### Controller Logic

The `CaseController` includes:
- Keyword extraction from the target case
- Pagination with size limits (max 5 per page, max 16 total results)
- Similar case finding based on title, content, snippet, and court
- Response formatting with pagination metadata

## Frontend Implementation

### Components

1. **SimilarCases.jsx** - Main component for displaying similar cases
2. **SimilarCasesPage.jsx** - Standalone page for similar cases functionality
3. **Updated CaseSearch.jsx** - Integrated similar cases in case search

### Features

- **Pagination Controls**: Previous/Next buttons with page information
- **Case Selection**: Click to select and view case details
- **Responsive Design**: Mobile-friendly layout
- **Loading States**: Loading indicators and error handling
- **Integration**: Works with existing case search functionality

### Service Method

```javascript
async getSimilarCases(caseId, page = 0, size = 5) {
  const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.CASES.SIMILAR}/${caseId}`, {
    params: { page, size }
  });
  return response.data;
}
```

## Usage Examples

### Backend API

```bash
# Get first page of similar cases
curl "http://localhost:7777/api/cases/similar/123456?page=0&size=5"

# Get second page
curl "http://localhost:7777/api/cases/similar/123456?page=1&size=5"
```

### Frontend Component

```jsx
import SimilarCases from './components/SimilarCases';

function MyComponent() {
  const handleCaseSelect = (selectedCase) => {
    console.log('Selected case:', selectedCase);
  };

  return (
    <SimilarCases 
      caseId="123456" 
      onCaseSelect={handleCaseSelect}
    />
  );
}
```

### Standalone Page

```jsx
import SimilarCasesPage from './components/SimilarCasesPage';

function App() {
  return (
    <div>
      <SimilarCasesPage />
    </div>
  );
}
```

## Configuration

### Limits

- **Maximum Results**: 16 similar cases
- **Page Size**: 5 cases per page (fixed)
- **Total Pages**: Up to 4 pages (16 ÷ 5 = 3.2, rounded up to 4)

### Keyword Extraction

The system extracts keywords from:
- Case title (filtering common words)
- Court name
- Case content and snippets

Common words filtered out: "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "vs", "versus"

## Testing

Run the test script to verify functionality:

```bash
node test-similar-cases.js
```

The test script verifies:
- Similar cases endpoint functionality
- Pagination behavior
- Size limit enforcement
- Error handling

## Security

- The endpoint is publicly accessible (configured in SecurityConfig)
- No authentication required for case search functionality
- CORS enabled for localhost origins

## Performance Considerations

- Database queries are optimized with proper indexing
- Results are limited to prevent large response payloads
- Pagination reduces memory usage
- Keyword extraction is lightweight and fast

## Future Enhancements

1. **Advanced Similarity**: Implement ML-based similarity scoring
2. **Caching**: Add Redis caching for frequently accessed similar cases
3. **Filters**: Add court, date range, and category filters
4. **Relevance Scoring**: Sort by relevance rather than creation date
5. **Full-text Search**: Implement Elasticsearch for better search capabilities