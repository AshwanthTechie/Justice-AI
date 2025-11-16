import React, { useState, useEffect, useRef, useContext } from 'react';
import { FiSend, FiPlus, FiTrash2, FiMic, FiMicOff } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { MyContext } from '../contexts/MyContext';
import chatService from '../services/chatService';
import CategoryCards from './CategoryCards';
import LegalNoticeGenerator from './LegalNoticeGenerator';
import DropdownSearch from './DropdownSearch';
// import websocketService from '../services/websocketService';
import './Chat.css';

const Chat = () => {
  const { user } = useContext(MyContext);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [showNoticeGenerator, setShowNoticeGenerator] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadChats();
      // connectWebSocket();
    }
    return () => {
      // websocketService.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        console.log('Speech result received');
        let transcript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        console.log('Transcript:', transcript);
        setInput(prev => prev + transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          alert('Please allow microphone access');
        }
      };
      
      recognitionInstance.onend = () => {
        console.log('Speech ended');
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);



  // const connectWebSocket = async () => {
  //   try {
  //     await websocketService.connect();
  //     setIsConnected(true);

  //     websocketService.subscribeToMessages((data) => {
  //       if (data.type === 'message') {
  //         setMessages(prev => [...prev, data.message]);
  //       } else if (data.type === 'chatCreated') {
  //         setChats(prev => [data.chat, ...prev]);
  //         setCurrentChat(data.chat);
  //         if (data.message) {
  //         setMessages([data.message]);
  //         }
  //       }
  //     });

  //     websocketService.subscribeToErrors((error) => {
  //       console.error('WebSocket error:', error);
  //       alert('Error: ' + error.message);
  //     });
  //   } catch (error) {
  //     console.error('Failed to connect to WebSocket:', error);
  //     setIsConnected(false);
  //   }
  // };

  const loadChats = async () => {
  try {
    setError('');

    const chatList = await chatService.getUserChats();
    console.log("chatList received:", chatList);  // 🔍 debug output
    const chatsArray = Array.isArray(chatList) ? chatList : [];
    setChats(chatsArray);

    if (!chatsArray.length) {
      console.warn('No chats found for this user.');
      setCurrentChat(null);
      return;
    }

    // Find the first valid chat with an id
    const validChats = chatsArray.filter(chat => chat && chat.id);
    if (validChats.length === 0) {
      console.error('No valid chats with id found');
      setError('Invalid chat data received. Please try again later.');
      return;
    }

    const firstValidChat = validChats[0];
    console.log("First valid chat object:", firstValidChat); // 🔍 debug output

    setCurrentChat(firstValidChat);
    await loadMessages(firstValidChat.id);

  } catch (error) {
    console.error('Failed to load chats:', error);
    setError('Failed to load chats. Please check your connection and try again.');
  }
};



  const loadMessages = async (chatId) => {
    if (!chatId) {
      console.error('loadMessages called with undefined chatId');
      setError('Invalid chat selected. Please select a valid chat.');
      setMessages([]);
      return;
    }
    try {
      setError('');
      const messageList = await chatService.getChatMessages(chatId);
      setMessages(messageList);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setError('Failed to load messages. Please check your connection and try selecting the chat again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Optimistic user bubble
      setMessages(prev => [
        ...prev,
        { role: 'USER', content: messageText, createdAt: new Date().toISOString() }
      ]);

      if (currentChat) {
        // If this is the first message and title is placeholder, set title locally for instant UI
        if (!currentChat.title || currentChat.title.trim() === '' || currentChat.title === 'New Chat') {
          const newTitle = messageText.length > 60 ? messageText.substring(0, 60) : messageText;
          setCurrentChat({ ...currentChat, title: newTitle });
          setChats(prev => prev.map(c => c.id === currentChat.id ? { ...c, title: newTitle } : c));
        }
        const resp = await chatService.sendMessage(currentChat.id, messageText);
        if (resp) {
          setMessages(prev => [...prev, resp]);
        }
      } else {
        const result = await chatService.sendMessageToNewChat(messageText, 'New Chat');
        if (result?.chat) {
          // Ensure the title shows as the first message
          const newTitle = messageText.length > 60 ? messageText.substring(0, 60) : messageText;
          const chatWithTitle = { ...result.chat, title: newTitle };
          setChats(prev => [chatWithTitle, ...prev]);
          setCurrentChat(chatWithTitle);
        }
        if (result?.message) {
          setMessages(prev => [...prev, result.message]);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please check your connection and try again.');
      // Remove the optimistic user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const chat = await chatService.createChat('New Chat');
      if (chat) {
        setChats(prev => [chat, ...prev]);
        setCurrentChat(chat);
        setMessages([]);
      }
    } catch (e) {
      console.error('Failed to create chat:', e);
      setError('Could not create a new chat. Please try again.');
    }
  };

  const handleSelectChat = async (chat) => {
    setCurrentChat(chat);
    await loadMessages(chat.id);
  };

  const handleDeleteChat = async (chatId) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await chatService.deleteChat(chatId);
        setChats(prev => prev.filter(chat => chat.id !== chatId));
        if (currentChat && currentChat.id === chatId) {
          setCurrentChat(null);
          setMessages([]);
        }
      } catch (error) {
        console.error('Failed to delete chat:', error);
        setError('Failed to delete chat. Please try again.');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  const handleCaseSelect = (caseData) => {
    const caseMessage = `I found a relevant case: "${caseData.title}" from ${caseData.court}. ${caseData.snippet}`;
    setInput(caseMessage);
  };



  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition not supported');
      return;
    }
    
    if (isRecording) {
      console.log('Stopping');
      recognition.stop();
    } else {
      console.log('Starting');
      try {
        recognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Start error:', error);
      }
    }
  };

  return (
    <div className="chat-app">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={handleNewChat}>
            <FiPlus size={20} />
            New Chat
          </button>
          <div className="search-container">
            <DropdownSearch 
              onCaseSelect={handleCaseSelect}
              placeholder="Search Indian Kanoon cases..."
            />
          </div>
        </div>

        <CategoryCards onCategorySelect={(category) => setInput(category)} />
        
        <div style={{ padding: '15px 0', borderTop: '1px solid #444' }}>
          <button
            onClick={() => setShowNoticeGenerator(true)}
            style={{
              width: '100%',
              padding: '12px',
              background: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📄 Generate Legal Notice
          </button>
        </div>



        <div className="chat-list">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${currentChat?.id === chat.id ? 'active' : ''}`}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="chat-title">{chat.title}</div>
              <div className="chat-actions">
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {error && (
          <div style={{
            color: "red",
            backgroundColor: "#ffe6e6",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #ffcccc"
          }}>
            {error}
          </div>
        )}
        {currentChat ? (
          <>
            <div className="chat-header">
              <h3>{currentChat.title}</h3>
            </div>

            <div className="messages-container">
              {/* Default assistant greeting */}
              {messages.length === 0 && (
                <div className="message assistant">
                  <div className="message-content">Hello 👋 I am JusticeAI. How can I help you today?</div>
                  <div className="message-time">{new Date().toLocaleTimeString()}</div>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message?.role ? message.role.toLowerCase() : 'assistant'}`}
                >
                  <div className="message-content">
                    {message?.role?.toLowerCase() === 'assistant' ? (
                      <ReactMarkdown>{message?.content || '[No message content]'}</ReactMarkdown>
                    ) : (
                      message?.content || '[No message content]'
                    )}
                  </div>
                  <div className="message-time">
                    {message?.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ''}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        ) : (
          <div className="welcome-screen">
            <h2>Welcome to JusticeAI</h2>
            <p>Start a new conversation or select an existing chat from the sidebar.</p>
          </div>
        )}

        <div className="chat-input-container">
          <div className="chat-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or click mic to speak..."
              disabled={isLoading}
            />
            <button
              onClick={handleVoiceInput}
              className={`voice-btn ${isRecording ? 'recording' : ''}`}
              title={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              {isRecording ? <FiMicOff size={20} /> : <FiMic size={20} />}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="send-btn"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>

      <LegalNoticeGenerator 
        isOpen={showNoticeGenerator}
        onClose={() => setShowNoticeGenerator(false)}
      />
    </div>
  );
};

export default Chat;
