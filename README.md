# 📞 Call and Text Me Maybe

A LiveKit cloud agent integrated with Twilio for voice calls and SMS messaging. This project enables customers to interact with an AI agent through voice calls and text messages.

## Features

- 🎙️ **Voice Calls** - Accept incoming voice calls via Twilio
- 💬 **SMS Messages** - Handle incoming and outgoing SMS via Twilio
- 🤖 **AI Agent** - Powered by LiveKit agents with OpenAI integration
- 🔐 **Secure** - Uses environment variables for sensitive credentials
- 🐳 **Containerized** - Docker and Docker Compose configuration included
- 🚀 **Scalable** - Built with Node.js/Express and LiveKit

## Prerequisites

- Node.js 18+ or Docker
- Twilio account with API credentials
- LiveKit Cloud account
- OpenAI API key
- Deepgram API key (for speech-to-text)
- Cartesia API key (for text-to-speech)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Twilio Configuration
TWILIO_API_SID=your_api_sid
TWILIO_API_SECRET=your_api_secret
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890  # Optional: Your Twilio phone number

# LiveKit Configuration
LIVEKIT_URL=wss://your-livekit-instance.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# AI Service API Keys
OPENAI_API_KEY=your_openai_key
DEEPGRAM_API_KEY=your_deepgram_key
CARTESIA_API_KEY=your_cartesia_key

# Server Configuration
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000  # For production, use your domain
```

## Installation

### Option 1: Local Installation

```bash
# Install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

### Option 2: Docker

```bash
# Build and start with Docker Compose
docker-compose up --build

# Or build the image manually
docker build -t call-and-text-me-maybe .
docker run -p 3000:3000 --env-file .env call-and-text-me-maybe
```

## API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the service.

### Generate LiveKit Token
```
POST /livekit-token
Content-Type: application/json

{
  "identity": "user_id",
  "room": "room_name"
}
```

Returns a JWT token for connecting to a LiveKit room.

### Handle Incoming Voice Calls
```
POST /twilio-voice
```
Webhook endpoint for Twilio voice calls. Configure this URL in your Twilio console.

### Handle Incoming SMS
```
POST /twilio-sms
```
Webhook endpoint for Twilio SMS messages. Configure this URL in your Twilio console.

### Send SMS
```
POST /send-sms
Content-Type: application/json

{
  "to": "+1234567890",
  "message": "Your message here"
}
```

### Make Outgoing Call
```
POST /make-call
Content-Type: application/json

{
  "to": "+1234567890",
  "from": "+0987654321"  # Optional
}
```

### Agent Status
```
GET /agent-status
```
Returns the current status and capabilities of the agent.

## Twilio Configuration

1. Go to [Twilio Console](https://console.twilio.com)
2. Get your Account SID and Auth Token
3. Set up a Twilio phone number
4. Configure webhooks:
   - **Voice Incoming**: Set to `https://your-domain.com/twilio-voice`
   - **Messaging Incoming**: Set to `https://your-domain.com/twilio-sms`

## LiveKit Configuration

1. Go to [LiveKit Cloud](https://cloud.livekit.io/)
2. Create a new project
3. Get your API Key and API Secret
4. Note the WebSocket URL of your LiveKit instance

## Deployment

### Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create a new app
heroku create call-and-text-me-maybe

# Add buildpack for Node.js
heroku buildpacks:add heroku/nodejs

# Set environment variables
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
# ... set other variables

# Deploy
git push heroku main
```

### AWS (EC2, Lambda, ECS)

1. Build Docker image: `docker build -t call-and-text-me-maybe .`
2. Push to ECR or dockerhub
3. Deploy using your preferred AWS service

### Vercel/Netlify

For serverless deployment, you may need to adapt the code to use serverless functions.

## Development

```bash
# Install dev dependencies
npm install --save-dev nodemon

# Run with auto-reload
npx nodemon index.js
```

## Project Structure

```
call-and-text-me-maybe/
├── index.js                 # Main application file
├── package.json             # Node.js dependencies
├── .env                      # Environment variables
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose configuration
├── README.md                # This file
└── .gitignore               # Git ignore rules
```

## Architecture

```
Incoming Call/SMS
       ↓
  Twilio Webhook
       ↓
  Express Server
       ↓
  LiveKit Agent
       ↓
  AI Service (OpenAI)
       ↓
  Response
       ↓
  Twilio (send back to user)
```

## Key Features Explained

### Voice Call Flow
1. Person calls your Twilio phone number
2. Twilio makes a POST request to `/twilio-voice` endpoint
3. Server generates a welcome message and connects to LiveKit agent
4. LiveKit agent processes audio with speech-to-text (Deepgram)
5. AI processes the text with OpenAI
6. Response is converted to speech (Cartesia)
7. Audio is streamed back to the caller

### SMS Flow
1. Person sends SMS to your Twilio phone number
2. Twilio makes a POST request to `/twilio-sms` endpoint
3. Server processes the message and generates a response
4. Response is sent back via Twilio
5. Can be extended to use AI for intelligent responses

## Security Considerations

- ✅ Never commit `.env` file to version control
- ✅ Use environment variables for all sensitive credentials
- ✅ Add `.env` to `.gitignore`
- ✅ Use HTTPS in production
- ✅ Validate and sanitize all incoming requests
- ✅ Implement rate limiting for API endpoints
- ✅ Use authentication tokens for sensitive operations

## Troubleshooting

### Connection Issues
- Verify your LiveKit URL is correct
- Check that your API keys are valid
- Ensure your Twilio credentials are correct
- Check firewall/security group rules

### Audio Issues
- Verify Deepgram and Cartesia credentials
- Check internet connection stability
- Monitor LiveKit room health

### Webhook Issues
- Ensure your server is accessible from the internet
- Use a tool like ngrok for local testing: `ngrok http 3000`
- Update Twilio webhook URLs after deployment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- 📧 Email: support@example.com
- 🐛 GitHub Issues: [Report a bug](https://github.com/your-username/call-and-text-me-maybe/issues)
- 💬 Discussions: [Ask a question](https://github.com/your-username/call-and-text-me-maybe/discussions)

## Resources

- [Twilio Docs](https://www.twilio.com/docs)
- [LiveKit Docs](https://docs.livekit.io)
- [OpenAI Docs](https://platform.openai.com/docs)
- [Deepgram Docs](https://developers.deepgram.com)
- [Cartesia Docs](https://docs.cartesia.ai)

## Changelog

### v1.0.0
- Initial release
- Voice call support
- SMS support
- LiveKit agent integration
- Docker support

---

Made with ❤️ for seamless AI agent communication
