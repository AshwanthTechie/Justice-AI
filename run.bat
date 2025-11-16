@echo off
echo DOJ Chatbot - Easy Run Script
echo ==============================

echo Starting DOJ Chatbot Backend...
cd doj-chatbot-backend
start "Backend" cmd /k ".\mvnw.cmd spring-boot:run"

timeout /t 10 /nobreak > nul

echo Starting DOJ Chatbot Frontend...
cd ../doj-chatbot
start "Frontend" cmd /k "npm run dev"

echo.
echo DOJ Chatbot is starting up!
echo Backend: http://localhost:7777
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
