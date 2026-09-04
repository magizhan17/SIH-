import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { simulateSensorTick } from '../services/sensorSimulationService';
import { getConveyorById } from '../models/conveyorModel';

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  // Currently active subscriptions per connection
  const subscriptions = new Map<WebSocket, string>();

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Default subscription to CV-04 for demo
    subscriptions.set(ws, 'CV-04');

    ws.on('message', (message) => {
      try {
        const msg = JSON.parse(message.toString());
        if (msg.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG' }));
        } else if (msg.type === 'SUBSCRIBE' && msg.conveyorId) {
          subscriptions.set(ws, msg.conveyorId);
          console.log(`Client subscribed to ${msg.conveyorId}`);
        }
      } catch (e) {
        console.error('WebSocket message parsing error', e);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      subscriptions.delete(ws);
    });
  });

  // Start the simulation loop
  setInterval(() => {
    // Collect updates for all distinct subscribed conveyors
    const activeConveyors = new Set(subscriptions.values());
    
    for (const conveyorId of activeConveyors) {
      // Validate conveyor exists
      if (!getConveyorById(conveyorId)) continue;

      const update = simulateSensorTick(conveyorId);
      if (!update) continue;

      // Broadcast to all clients subscribed to this conveyor
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && subscriptions.get(client) === conveyorId) {
          client.send(JSON.stringify({
            type: 'SENSOR_UPDATE',
            data: {
              conveyorId,
              sensors: update.sensors,
              riskScore: update.riskScore,
              beltHealth: update.beltHealth,
              timestamp: new Date().toISOString()
            }
          }));

          // Send alert if one was generated
          if (update.newAlert) {
            client.send(JSON.stringify({
              type: 'ALERT',
              data: update.newAlert
            }));
          }
        }
      });
    }
  }, 3000); // Tick every 3 seconds

  return wss;
};
