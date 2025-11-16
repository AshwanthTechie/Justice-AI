# Troubleshooting Guide - DOJ Chatbot

## 403 Forbidden Error Fix

If you're getting a 403 Forbidden error when trying to register, follow these steps:

### 1. **Restart the Backend Server**
The backend server needs to be restarted after the security configuration changes:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
cd doj-chatbot-backend
.\mvnw.cmd spring-boot:run
```

### 2. **Check Server Status**
- Make sure the backend is running on `http://localhost:7777`
- Check the console for any startup errors
- Look for "Started DojChatbotBackendApplication" message

### 3. **Test Basic Connectivity**
Use the test component on the home page to verify:
- Click "Test Basic Connection" - should show ✅
- Click "Test Registration" - should show ✅

### 4. **Database Setup**
Make sure MySQL is running and the database exists:

```sql
CREATE DATABASE doj;
```

### 5. **Check Browser Console**
Open browser DevTools (F12) and check:
- Network tab for failed requests
- Console tab for error messages
- Look for CORS errors

### 6. **Common Issues & Solutions**

#### Issue: 403 Forbidden
**Solution**: Server needs restart after security config changes

#### Issue: CORS Error
**Solution**: CORS is now configured in SecurityConfig.java

#### Issue: Database Connection Error
**Solution**: 
- Check MySQL is running
- Verify database credentials in application.yml
- Create the 'doj' database

#### Issue: JWT Secret Key Error
**Solution**: Updated to use a longer secret key

### 7. **Manual Testing**

Test the API directly using curl or Postman:

```bash
# Test basic endpoint
curl http://localhost:7777/user/test

# Test registration
curl -X POST http://localhost:7777/user/add \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Test",
    "lastname": "User", 
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 8. **Expected Responses**

- **Test endpoint**: `200 OK` with "Server is working!"
- **Registration**: `201 Created` with user data (password will be hashed)
- **Login**: `200 OK` with user data and JWT token

### 9. **If Still Having Issues**

1. Check the backend console logs for detailed error messages
2. Verify all dependencies are installed (`mvn clean install`)
3. Make sure no other service is using port 7777
4. Check firewall settings

### 10. **Clean Restart Process**

```bash
# Backend
cd doj-chatbot-backend
.\mvnw.cmd clean
.\mvnw.cmd spring-boot:run

# Frontend (in new terminal)
cd doj-chatbot
npm run dev
```

The 403 error should be resolved after restarting the backend server with the updated security configuration.
