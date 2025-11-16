import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getToken } from '../utils/tokenUtils';

class WebSocketService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.subscriptions = new Map();
  }

  connect() {
    if (this.isConnected) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:7777'}/ws`);
      this.client = new Client({
        webSocketFactory: () => socket,
        onConnect: (frame) => {
          console.log('WebSocket connected:', frame);
          this.isConnected = true;
          resolve();
        },
        onStompError: (error) => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
          reject(error);
        },
        onWebSocketClose: () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
        }
      });

      this.client.activate();
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.isConnected = false;
    }
  }

  subscribeToMessages(callback) {
    if (!this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.client.subscribe('/user/queue/messages', (message) => {
      const data = JSON.parse(message.body);
      callback(data);
    });

    this.subscriptions.set('messages', subscription);
  }

  subscribeToErrors(callback) {
    if (!this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.client.subscribe('/user/queue/errors', (message) => {
      const data = JSON.parse(message.body);
      callback(data);
    });

    this.subscriptions.set('errors', subscription);
  }

  sendMessage(chatId, message) {
    if (!this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    const token = getToken();
    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        token,
        chatId,
        message
      })
    });
  }

  createChat(title, message) {
    if (!this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    const token = getToken();
    this.client.publish({
      destination: '/app/chat.createChat',
      body: JSON.stringify({
        token,
        title,
        message
      })
    });
  }

  unsubscribe(type) {
    const subscription = this.subscriptions.get(type);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(type);
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.clear();
  }
}

export default new WebSocketService();
