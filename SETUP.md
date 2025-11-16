# JusticeAI Chatbot - Complete Setup Guide

## 🚀 **Advanced Features Implemented**

Your DOJ Chatbot now includes:

✅ **Real AI Integration** - OpenAI GPT-3.5-turbo  
✅ **Chat History Persistence** - MySQL database storage  
✅ **Real-time Messaging** - WebSocket communication  
✅ **User Session Management** - JWT token authentication  
✅ **Modern UI/UX** - Professional chat interface  
✅ **Security** - BCrypt password hashing, input validation  

## 📋 **Prerequisites**

- Java 17+
- Node.js 16+
- MySQL 8.0+
- OpenAI API Key (optional, for AI features)

## 🔧 **Backend Setup**

### 1. Database Setup
```sql
CREATE DATABASE doj;
```

### 2. Environment Variables
Create a `.env` file in the backend root:
```env
# Database
DB_URL=jdbc:mysql://localhost:3306/doj
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT Security
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_EXPIRATION=86400000

# OpenAI (Optional)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
```

### 3. Start Backend
```bash
cd doj-chatbot-backend
.\mvnw.cmd spring-boot:run
```

## 🎨 **Frontend Setup**

### 1. Install Dependencies
```bash
cd doj-chatbot
npm install
```

### 2. Environment Variables (Optional)
Create a `.env` file in the frontend root:
```env
VITE_API_BASE_URL=http://localhost:7777
VITE_WS_URL=ws://localhost:7777
```

### 3. Start Frontend
```bash
npm run dev
```

## 🔑 **OpenAI API Setup (Optional)**

1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Set `OPENAI_API_KEY` in backend environment
3. Without API key, the chatbot will show a fallback message

## 🌟 **Features Overview**

### **AI Chat Integration**
- Real-time AI responses using OpenAI GPT-3.5-turbo
- Context-aware conversations
- Legal assistant persona
- Fallback for when API is unavailable

### **Chat Management**
- Create multiple chat sessions
- Persistent chat history
- Delete old conversations
- Real-time message updates

### **User Authentication**
- Secure JWT token authentication
- Password hashing with BCrypt
- Session management
- Protected API endpoints

### **Real-time Communication**
- WebSocket for instant messaging
- Live typing indicators
- Connection status monitoring
- Error handling and reconnection

### **Modern UI/UX**
- Professional dark theme
- Responsive design
- Mobile-friendly interface
- Smooth animations and transitions

## 📱 **Usage**

1. **Register/Login**: Create account or login with existing credentials
2. **Start Chat**: Click "New Chat" to begin a conversation
3. **AI Interaction**: Type messages and get AI responses in real-time
4. **Chat History**: View and manage previous conversations
5. **Logout**: Secure logout with token cleanup

## 🔒 **Security Features**

- **Password Security**: BCrypt hashing with salt
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for frontend-backend communication
- **SQL Injection Protection**: JPA/Hibernate ORM
- **XSS Protection**: Input sanitization

## 🛠 **API Endpoints**

### Authentication
- `POST /user/add` - User registration
- `POST /user/login` - User login

### Chat Management
- `GET /api/chat/list` - Get user's chats
- `POST /api/chat/create` - Create new chat
- `GET /api/chat/{id}` - Get specific chat
- `GET /api/chat/{id}/messages` - Get chat messages
- `POST /api/chat/{id}/message` - Send message
- `DELETE /api/chat/{id}` - Delete chat

### WebSocket
- `ws://localhost:7777/ws` - Real-time messaging

## 🚨 **Troubleshooting**

### Backend Issues
- Check MySQL is running
- Verify database credentials
- Check port 7777 is available
- Review application logs

### Frontend Issues
- Clear browser cache
- Check console for errors
- Verify API endpoints are accessible
- Check WebSocket connection

### AI Integration Issues
- Verify OpenAI API key is set
- Check API quota and billing
- Review network connectivity
- Check API response logs

## 📊 **Performance**

- **Database**: Optimized queries with JPA
- **Caching**: JWT token validation
- **Real-time**: Efficient WebSocket communication
- **Frontend**: React optimization with proper state management

## 🔄 **Development**

### Adding New Features
1. Backend: Add models, services, controllers
2. Frontend: Create components, services, API calls
3. Database: Update schema as needed
4. Test: Verify functionality end-to-end

### Deployment
1. Build frontend: `npm run build`
2. Package backend: `mvn clean package`
3. Deploy to your preferred platform
4. Configure production environment variables

## 🎯 **Next Steps**

Your chatbot is now production-ready! Consider:

- **Deployment**: Deploy to cloud platforms
- **Monitoring**: Add logging and analytics
- **Scaling**: Implement load balancing
- **Features**: Add file uploads, voice messages
- **Analytics**: Track usage and performance

## 📞 **Support**

For issues or questions:
1. Check the troubleshooting section
2. Review application logs
3. Verify all dependencies are installed
4. Ensure all environment variables are set

---

**🎉 Congratulations! Your JusticeAI chatbot is ready to use!**
