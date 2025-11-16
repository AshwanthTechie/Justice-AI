# DOJ Chatbot Backend

A Spring Boot REST API for the DOJ Chatbot application with JWT authentication and MySQL database.

## Features

- User registration and authentication
- JWT token-based security
- Password hashing with BCrypt
- Input validation
- CORS configuration
- MySQL database integration

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## Setup

1. **Database Setup**
   ```sql
   CREATE DATABASE doj;
   ```

2. **Environment Variables** (Optional)
   Create a `.env` file or set environment variables:
   ```
   DB_URL=jdbc:mysql://localhost:3306/doj
   DB_USERNAME=root
   DB_PASSWORD=your_password
   SERVER_PORT=7777
   JWT_SECRET=your_secret_key
   JWT_EXPIRATION=86400000
   ```

3. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```

The API will be available at `http://localhost:7777`

## API Endpoints

- `POST /user/add` - Register new user
- `POST /user/login` - User login (returns JWT token)
- `GET /user/get/{id}` - Get user by ID
- `PUT /user/update/{id}` - Update user
- `DELETE /user/delete/{id}` - Delete user

## Security

- Passwords are hashed using BCrypt
- JWT tokens are used for authentication
- CORS is configured for frontend integration
- Input validation is implemented
