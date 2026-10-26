const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'my_custom_secure_token';

// Meta Lead Webhook Verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[Meta Webhook] Verification successful!');
    return res.status(200).send(challenge);
  }
  
  console.error('[Meta Webhook] Verification failed. Token mismatch.');
  return res.sendStatus(403);
});

// Meta Lead Event Endpoint (POST)
app.post('/webhook', (req, res) => {
  const body = req.body;
  console.log('[Meta Webhook] Incoming payload:', JSON.stringify(body, null, 2));

  if (body.object === 'page' || body.entry) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const leadValue = changes?.value;

    const leadData = {
      id: leadValue?.leadgen_id || `lead_${Date.now()}`,
      form_id: leadValue?.form_id || 'sample_form_id',
      page_id: leadValue?.page_id || 'sample_page_id',
      created_time: leadValue?.created_time 
        ? new Date(leadValue.created_time * 1000).toLocaleString()
        : new Date().toLocaleString(),
      status: 'Received via Meta Webhook'
    };

    // Broadcast lead to all connected React Native clients
    io.emit('new_lead', leadData);
    console.log('[Socket.io] Emitted new_lead event:', leadData);
  }

  // Meta expects 200 OK immediately
  res.status(200).send('EVENT_RECEIVED');
});

// Socket connection handling
io.on('connection', (socket) => {
  console.log(`[Socket.io] React Native app connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`[Socket.io] React Native app disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Webhook Verification URL: GET http://localhost:${PORT}/webhook`);
  console.log(`Webhook Payload Receiver: POST http://localhost:${PORT}/webhook`);
});
