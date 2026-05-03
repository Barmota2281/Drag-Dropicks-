import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getToken } from '../tokenManager';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  connect(onMessageReceived) {
    if (this.connected) return;

    const token = getToken();
    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    this.client = new Client({
      // We use SockJS if native STOMP over ws isn't supported or to fallback
      webSocketFactory: () => new SockJS(`${serverUrl}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      onConnect: () => {
        this.connected = true;
        console.log('WebSocket Connected');
        // Subscribe to a generic topic for board updates
        this.client.subscribe('/topic/board', (message) => {
          if (message.body && onMessageReceived) {
            onMessageReceived(JSON.parse(message.body));
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      onWebSocketClose: () => {
        this.connected = false;
      }
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
    }
  }

  sendUpdate(action, data) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/app/board.update',
        body: JSON.stringify({ action, data })
      });
    }
  }
}

export const wsService = new WebSocketService();
