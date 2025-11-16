# DOJ Chatbot - JusticeAI

A full-stack AI-powered legal assistant chatbot with modern UI, real-time messaging, and case law integration.

## 🚀 Quick Start (Easiest Way)

1. **Double-click `run.bat`** (Windows) or run `./run.sh` (Linux/Mac)
2. Wait for both backend and frontend to start
3. Open `http://localhost:5173` in your browser
4. Register/Login and start chatting!

## 📋 Prerequisites

- **Java 17+** (for backend)
- **Node.js 16+** (for frontend)
- **No database setup required** (uses H2 in-memory)

## 🏗️ Manual Setup (Alternative)

### Backend Setup
```bash
cd doj-chatbot-backend
.\mvnw.cmd spring-boot:run
```
Backend runs on `http://localhost:7777`

### Frontend Setup
```bash
cd doj-chatbot
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## ✨ Features

- 🤖 **AI-Powered Chat** - Legal assistant with OpenAI integration
- 💬 **Real-time Messaging** - WebSocket communication
- 🔍 **Case Law Search** - Indian Kanoon API integration
- 🔐 **Secure Authentication** - JWT tokens with BCrypt hashing
- 📱 **Responsive Design** - Works on desktop and mobile
- 💾 **Persistent Chats** - H2 database (no setup needed)
- 🌙 **Dark Theme** - Modern professional UI

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router
- **Backend**: Spring Boot 3.5, JPA, WebSocket
- **Database**: H2 (in-memory, no setup)
- **Security**: JWT, BCrypt, Spring Security
- **AI**: OpenAI GPT-3.5-turbo (optional)
- **APIs**: Indian Kanoon case search

## 🔧 Configuration (Optional)

### Backend Environment Variables
Create `doj-chatbot-backend/.env`:
```env
# Database (defaults to H2)
DB_URL=jdbc:h2:mem:doj
DB_USERNAME=sa
DB_PASSWORD=

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=86400000

# OpenAI (optional)
OPENAI_API_KEY=your_openai_key

# Indian Kanoon (optional)
INDIANKANOON_API_KEY=your_api_key
```

### Frontend Environment Variables
Create `doj-chatbot/.env`:
```env
VITE_API_BASE_URL=http://localhost:7777
VITE_WS_URL=ws://localhost:7777
```

## 📁 Project Structure

```
doj-chatbot/
├── run.bat                 # Easy startup script
├── doj-chatbot-backend/    # Spring Boot API
│   ├── src/main/java/      # Backend source
│   └── src/main/resources/ # Config files
└── doj-chatbot/            # React frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── services/       # API services
    │   └── utils/          # Utilities
    └── public/             # Static assets
```

## 🎯 Usage

1. **Register/Login** with your credentials
2. **Start a New Chat** or select existing
3. **Type legal questions** or use "Search Cases"
4. **AI responds** with legal insights and case references
5. **Chat history** is automatically saved

## 🔒 Security Features

- Password hashing with BCrypt
- JWT token authentication
- CORS protection
- Input validation and sanitization
- SQL injection prevention

## 🚨 Troubleshooting

### Backend Won't Start
- Ensure Java 17+ is installed
- Check port 7777 is available
- Run `.\mvnw.cmd clean compile` first

### Frontend Won't Load
- Run `npm install` in frontend directory
- Check port 5173 is available
- Clear browser cache

### Database Issues
- H2 is in-memory, restarts with clean DB
- No MySQL setup needed by default

### WebSocket Connection
- Ensure backend is running first
- Check firewall settings
- Browser console for connection errors

## 📞 Support

For issues:
1. Check the troubleshooting section
2. Review console logs
3. Ensure all prerequisites are installed
4. Try the `run.bat` script for clean startup

---

**🎉 Happy chatting with JusticeAI!**
