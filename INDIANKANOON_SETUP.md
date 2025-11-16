# Indian Kanoon API Integration Setup Guide

## Overview

This guide will help you set up the Indian Kanoon API integration in your DOJ Chatbot project. The integration allows your chatbot to search and retrieve relevant legal cases from the Indian Kanoon database.

## Prerequisites

1. **Indian Kanoon API Key**: You need to register at [Indian Kanoon API](https://api.indiankanoon.org/documentation/#apidetails) and obtain an API key.

2. **Backend Server**: Ensure your Spring Boot backend is running on port 7777.

3. **Database**: MySQL database should be running and accessible.

## Setup Steps

### 1. Backend Configuration

#### Set Environment Variables

Create a `.env` file in your backend root directory or set environment variables:

```bash
# Indian Kanoon API Configuration
INDIANKANOON_API_KEY=13c0888d0cb03bf0352b22528bfd9581277eb79c
INDIANKANOON_API_BASE_URL=https://api.indiankanoon.org
```

#### Update application.yml

The configuration has been added to `src/main/resources/application.yml`:

```yaml
# Indian Kanoon API configuration
indiankanoon:
  api:
    key: ${INDIANKANOON_API_KEY:13c0888d0cb03bf0352b22528bfd9581277eb79c}
    baseUrl: ${INDIANKANOON_API_BASE_URL:https://api.indiankanoon.org}
```

### 2. Database Setup

The integration adds a new `cases` table to store retrieved case data. The table will be created automatically when you start the backend.

#### Table Structure

```sql
CREATE TABLE cases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(1000) NOT NULL,
    court VARCHAR(500),
    date VARCHAR(50),
    snippet TEXT,
    url VARCHAR(1000),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. New Backend Components

#### Services Added

1. **IndianKanoonService** (`src/main/java/com/example/doj_chatbot_backend/service/IndianKanoonService.java`)
   - Handles API calls to Indian Kanoon
   - Parses responses and generates contextual responses
   - Manages case data retrieval

2. **Case Model** (`src/main/java/com/example/doj_chatbot_backend/model/Case.java`)
   - JPA entity for storing case data
   - Includes all relevant case information

3. **CaseRepo** (`src/main/java/com/example/doj_chatbot_backend/repo/CaseRepo.java`)
   - Repository for database operations on cases
   - Includes search and filtering methods

4. **CaseController** (`src/main/java/com/example/doj_chatbot_backend/controller/CaseController.java`)
   - REST endpoints for case operations
   - Integrates with Indian Kanoon API

#### New API Endpoints

- `GET /api/cases/search?query={query}` - Search for cases
- `GET /api/cases/{caseId}` - Get case details
- `GET /api/cases/contextual?query={query}` - Get contextual response with cases
- `GET /api/cases/local?keyword={keyword}` - Get local stored cases

### 4. Frontend Components

#### New Components Added

1. **CaseSearch** (`src/components/CaseSearch.jsx`)
   - Modal component for searching cases
   - Displays search results and case details
   - Allows users to select cases for chat

2. **CaseService** (`src/services/caseService.js`)
   - Frontend service for API calls
   - Handles case search and retrieval

#### Updated Components

1. **Chat.jsx**
   - Added case search button
   - Integrated CaseSearch modal
   - Enhanced with legal query detection

2. **api.js**
   - Added case-related API endpoints

### 5. Testing the Integration

#### Run the Test Script

```bash
# Install axios if not already installed
npm install axios

# Run the test script
node test-indian-kanoon.js
```

#### Manual Testing

1. **Start the Backend**:
   ```bash
   cd doj-chatbot-backend
   mvn spring-boot:run
   ```

2. **Start the Frontend**:
   ```bash
   cd doj-chatbot
   npm run dev
   ```

3. **Test Case Search**:
   - Open the chat interface
   - Click "Search Cases" button
   - Search for legal terms like "contract law", "criminal case", etc.
   - Select a case to use in your chat

4. **Test Legal Queries**:
   - Ask legal questions in the chat
   - The system will automatically search for relevant cases
   - Responses will include case law references

## Features

### 1. Automatic Legal Query Detection

The system automatically detects when a user asks legal questions by checking for keywords like:
- "case", "law", "legal", "court", "judgment"
- "rights", "liability", "contract", "dispute"
- "criminal", "civil", "constitutional"

### 2. Case Search and Retrieval

- Search the Indian Kanoon database for relevant cases
- Store retrieved cases locally for faster access
- Display case details with court, date, and summary

### 3. Contextual Responses

- Generate responses that include relevant case law
- Provide case citations and summaries
- Include disclaimers about legal advice

### 4. Local Case Storage

- Cache frequently accessed cases locally
- Improve response times for repeated queries
- Reduce API calls to Indian Kanoon

## Configuration Options

### Environment Variables

```bash
# Required
INDIANKANOON_API_KEY=your_api_key_here

# Optional (defaults provided)
INDIANKANOON_API_BASE_URL=https://api.indiankanoon.org
DB_URL=jdbc:mysql://localhost:3306/doj
DB_USERNAME=root
DB_PASSWORD=1234
SERVER_PORT=7777
```

### Backend Configuration

You can modify the legal keywords detection in `ChatService.java`:

```java
private boolean isLegalQuery(String message) {
    String lowerMessage = message.toLowerCase();
    String[] legalKeywords = {
        "case", "law", "legal", "court", "judgment", "ruling",
        // Add more keywords as needed
    };
    // ... rest of the method
}
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**:
   - Verify your API key is correct
   - Check if the key has proper permissions
   - Ensure the key is set in environment variables

2. **Database Connection Issues**:
   - Verify MySQL is running
   - Check database credentials
   - Ensure the database exists

3. **No Search Results**:
   - Try different search terms
   - Check if the Indian Kanoon API is accessible
   - Verify network connectivity

4. **Frontend Not Loading Cases**:
   - Check browser console for errors
   - Verify backend is running
   - Check CORS configuration

### Debug Steps

1. **Check Backend Logs**:
   ```bash
   cd doj-chatbot-backend
   mvn spring-boot:run
   ```

2. **Test API Directly**:
   ```bash
   curl "http://localhost:7777/api/cases/search?query=contract"
   ```

3. **Check Database**:
   ```sql
   SELECT * FROM cases LIMIT 5;
   ```

## Security Considerations

1. **API Key Protection**:
   - Never commit API keys to version control
   - Use environment variables for configuration
   - Consider using a secrets management service

2. **Rate Limiting**:
   - Indian Kanoon API may have rate limits
   - Implement caching to reduce API calls
   - Consider implementing request throttling

3. **Data Privacy**:
   - Case data is stored locally for performance
   - Consider data retention policies
   - Implement proper access controls

## Performance Optimization

1. **Caching Strategy**:
   - Local database caching for frequently accessed cases
   - Consider Redis for session-based caching
   - Implement cache invalidation strategies

2. **Search Optimization**:
   - Use database indexes on search fields
   - Implement pagination for large result sets
   - Consider full-text search capabilities

3. **API Optimization**:
   - Batch API requests where possible
   - Implement request queuing
   - Use async processing for non-critical operations

## Future Enhancements

1. **Advanced Search**:
   - Implement faceted search
   - Add filters by court, date, jurisdiction
   - Support complex legal queries

2. **Case Analysis**:
   - Extract key legal principles
   - Identify case precedents
   - Generate case summaries

3. **Integration Features**:
   - Export case data
   - Generate legal reports
   - Integration with legal research tools

## Support

If you encounter issues:

1. Check the logs for error messages
2. Verify all configuration settings
3. Test individual components separately
4. Refer to the Indian Kanoon API documentation

For additional help, refer to the main project documentation or create an issue in the project repository.
