const axios = require('axios');

const API_BASE = 'http://localhost:7777/api';
const TOKEN = 'mySuperSecretKey123!@#4567890abcdef';

async function test() {
  try {
    // Test chat list retrieval
    let res = await axios.get(`${API_BASE}/chat/list`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('Chat list:', res.data);

    // Test chat creation
    res = await axios.post(`${API_BASE}/chat/create?title=TestChatNode`, null, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('Chat created:', res.data);
    const chatId = res.data.chat.id;

    // Test sending message to chat
    res = await axios.post(`${API_BASE}/chat/${chatId}/message`, {
      message: 'What is IPC 302?'
    }, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('Message sent:', res.data);

    // Test getting messages for chat
    res = await axios.get(`${API_BASE}/chat/${chatId}/messages`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('Chat messages:', res.data);

    // Test updating chat title
    res = await axios.put(`${API_BASE}/chat/${chatId}/title`, {
      title: 'Updated Test Chat Node'
    }, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('Chat title updated:', res.data);

    // Test deleting chat
    res = await axios.delete(`${API_BASE}/chat/${chatId}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('Chat deleted:', res.data);

  } catch (error) {
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

test();
