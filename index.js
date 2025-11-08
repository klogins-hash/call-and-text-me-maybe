require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const { AccessToken } = require('livekit');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio clients
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// LiveKit configuration
const liveKitUrl = process.env.LIVEKIT_URL;
const liveKitApiKey = process.env.LIVEKIT_API_KEY;
const liveKitApiSecret = process.env.LIVEKIT_API_SECRET;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Call and Text Me Maybe Agent is running' });
});

/**
 * Generate LiveKit access token for a user
 */
function generateLiveKitToken(identity, room, grants = {}) {
  const at = new AccessToken(liveKitApiKey, liveKitApiSecret, {
    identity,
    ...grants,
  });
  at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  });
  return at.toJwt();
}

/**
 * POST /livekit-token
 * Generate and return a LiveKit access token for connecting to a room
 */
app.post('/livekit-token', (req, res) => {
  try {
    const { identity, room } = req.body;

    if (!identity || !room) {
      return res.status(400).json({
        error: 'Missing required fields: identity and room',
      });
    }

    const token = generateLiveKitToken(identity, room);
    res.json({ token });
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /twilio-voice
 * Handle incoming voice calls from Twilio
 * This endpoint receives webhooks from Twilio when someone calls the phone number
 */
app.post('/twilio-voice', (req, res) => {
  try {
    const twiml = new twilio.twiml.VoiceResponse();

    // Generate a unique room name for this call
    const roomName = `call-${Date.now()}`;
    const callerId = req.body.From || 'unknown';

    // Create instructions for the caller
    const say = twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Welcome to Call and Text Me Maybe. Connecting you to our AI agent now.'
    );

    // In a production environment, you would:
    // 1. Connect to LiveKit agent in a room
    // 2. Handle audio streaming between Twilio and LiveKit
    // This is typically done via Twilio Media Streams

    twiml.play('https://api.twilio.com/Cowbell.mp3');

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error handling Twilio voice:', error);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Sorry, something went wrong. Please try again.');
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

/**
 * POST /twilio-sms
 * Handle incoming SMS messages from Twilio
 */
app.post('/twilio-sms', (req, res) => {
  try {
    const { From, Body } = req.body;

    console.log(`SMS received from ${From}: ${Body}`);

    const twiml = new twilio.twiml.MessagingResponse();

    // Process the SMS and generate a response
    // In production, you would integrate with the LiveKit agent for intelligent responses
    const response = generateSmsResponse(Body);

    twiml.message(response);

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error handling Twilio SMS:', error);
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Sorry, I could not process your message. Please try again.');
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

/**
 * Generate a response to an SMS message
 * In a production environment, this would call an AI service
 */
function generateSmsResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Simple heuristic responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! How can I help you today?';
  } else if (lowerMessage.includes('help')) {
    return 'I can help you with calls and messages. What do you need?';
  } else if (lowerMessage.includes('bye')) {
    return 'Goodbye! Have a great day!';
  } else {
    return 'Thank you for your message. I received: "' + message + '"';
  }
}

/**
 * POST /send-sms
 * Send an SMS message via Twilio
 */
app.post('/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        error: 'Missing required fields: to and message',
      });
    }

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
      to: to,
    });

    res.json({
      success: true,
      messageSid: result.sid,
      message: 'SMS sent successfully',
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /make-call
 * Initiate an outgoing call via Twilio
 */
app.post('/make-call', async (req, res) => {
  try {
    const { to, from } = req.body;

    if (!to) {
      return res.status(400).json({
        error: 'Missing required field: to',
      });
    }

    const call = await twilioClient.calls.create({
      to: to,
      from: from || process.env.TWILIO_PHONE_NUMBER || '+1234567890',
      url: `${process.env.BASE_URL || 'http://localhost:3000'}/twilio-voice`,
    });

    res.json({
      success: true,
      callSid: call.sid,
      message: 'Call initiated',
    });
  } catch (error) {
    console.error('Error making call:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /agent-status
 * Get the status of the AI agent
 */
app.get('/agent-status', (req, res) => {
  res.json({
    agent: 'call-and-text-me-maybe',
    status: 'active',
    capabilities: ['voice_calls', 'sms_messages', 'livekit_integration'],
    livekit_url: liveKitUrl,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Call and Text Me Maybe Agent is running on port ${port}`);
  console.log(`📞 Voice endpoint: /twilio-voice`);
  console.log(`📱 SMS endpoint: /twilio-sms`);
  console.log(`🔗 LiveKit URL: ${liveKitUrl}`);
});

module.exports = app;
