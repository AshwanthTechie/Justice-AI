import apiClient from '../utils/axiosConfig';
import { API_CONFIG } from '../config/api';

class ChatService {
  async createChat(title) {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CHAT.CREATE, null, {
      params: { title }
    });
    return response.data;
  }

  async getUserChats() {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CHAT.LIST);
    return response.data;
  }

  async getChat(chatId) {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.CHAT.GET}/${chatId}`);
    return response.data;
  }

  async getChatMessages(chatId) {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.CHAT.MESSAGES}/${chatId}/messages`);
    return response.data;
  }

  async sendMessage(chatId, message) {
    // Backend expects: POST /api/chat/{chatId}/message
    const response = await apiClient.post(`${API_CONFIG.ENDPOINTS.CHAT.GET}/${chatId}/message`, {
      message
    });
    return response.data;
  }

  async sendMessageToNewChat(message, title = 'New Chat') {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CHAT.SEND_MESSAGE, {
      message,
      title
    });
    return response.data;
  }

  async deleteChat(chatId) {
    const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.CHAT.DELETE}/${chatId}`);
    return response.data;
  }

  async updateChatTitle(chatId, title) {
    const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.CHAT.UPDATE_TITLE}/${chatId}/title`, {
      title
    });
    return response.data;
  }

  async deleteAllChats() {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CHAT.DELETE_ALL);
    return response.data;
  }
}

export default new ChatService();
