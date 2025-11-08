# Setup Guide - Call and Text Me Maybe

This guide walks you through setting up the Call and Text Me Maybe LiveKit agent with Twilio integration.

## Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/klogins-hash/call-and-text-me-maybe.git
cd call-and-text-me-maybe
```

### 2. Copy Environment Variables

```bash
cp .env.example .env
```

### 3. Update Your Credentials

Edit the `.env` file and add your actual API keys (see sections below).

### 4. Install & Run

```bash
# Option A: Local
npm install
npm start

# Option B: Docker
docker-compose up --build
```

### 5. Test the Server

```bash
curl http://localhost:3000/health
```

You should see:
```json
{ "status": "ok", "message": "Call and Text Me Maybe Agent is running" }
```

---

## Detailed Setup Instructions

### Prerequisites

Before you begin, make sure you have:
- ✅ Node.js 18+ installed (or Docker)
- ✅ A Twilio account: https://www.twilio.com/console
- ✅ A LiveKit Cloud account: https://cloud.livekit.io/
- ✅ OpenAI API key: https://platform.openai.com/api-keys
- ✅ Deepgram API key: https://console.deepgram.com/
- ✅ Cartesia API key: https://play.cartesia.ai/keys

### Step 1: Twilio Setup

#### 1.1 Get Your Credentials

1. Go to [Twilio Console](https://console.twilio.com)
2. Click on your project name in the top left
3. In the left sidebar, navigate to **Account** > **API Keys & Credentials**
4. You'll find:
   - **Account SID** - Copy this to `TWILIO_ACCOUNT_SID`
   - **Auth Token** - Copy this to `TWILIO_AUTH_TOKEN`
5. Look for **Synapse API Keys** section
   - Get the **API SID** → `TWILIO_API_SID`
   - Get the **API Secret** → `TWILIO_API_SECRET`

#### 1.2 Get a Phone Number

1. In the Twilio Console, go to **Develop** > **Phone Numbers** > **Manage**
2. If you don't have one, click **Buy a Number** and follow the prompts
3. Copy your phone number to `TWILIO_PHONE_NUMBER` (in E.164 format: +1234567890)

#### 1.3 Configure Webhooks

> **Note:** You'll do this after deployment. For now, just note the endpoints.

When your server is deployed, you need to configure these Twilio webhooks:

**Phone Number Configuration:**
1. Go to **Phone Numbers** > **Active Numbers**
2. Click on your phone number
3. Scroll to **Voice Configuration**:
   - **Configure With**: Webhooks/TwiML
   - **A call comes in**: POST to `https://your-domain.com/twilio-voice`
4. Scroll to **Messaging Configuration**:
   - **A message comes in**: POST to `https://your-domain.com/twilio-sms`
5. Save

**For Local Testing (using ngrok):**

```bash
# In another terminal
npm install -g ngrok
ngrok http 3000
```

This gives you a public URL like `https://abc123.ngrok.io`. Use this URL in your Twilio webhook configuration, then restart your server.

### Step 2: LiveKit Setup

#### 2.1 Create a Project

1. Go to [LiveKit Cloud Console](https://cloud.livekit.io/)
2. Sign in or create an account
3. Click **Create Project**
4. Give it a name (e.g., "call-and-text-me-maybe")
5. Choose a region closest to you
6. Click **Create**

#### 2.2 Get Your Credentials

1. Click on your newly created project
2. In the **Credentials** section, you'll find:
   - **WebSocket URL** - Copy to `LIVEKIT_URL` (should start with `wss://`)
   - **API Key** - Copy to `LIVEKIT_API_KEY`
   - **API Secret** - Copy to `LIVEKIT_API_SECRET`

#### 2.3 Verify Connection

```bash
# After updating your .env file
npm start

# In another terminal
curl -X POST http://localhost:3000/livekit-token \
  -H "Content-Type: application/json" \
  -d '{"identity":"test-user","room":"test-room"}'
```

You should get a response with a JWT token.

### Step 3: OpenAI Setup

#### 3.1 Get Your API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click **Create new secret key**
3. Copy the key and save it somewhere safe
4. Paste it in `.env` as `OPENAI_API_KEY`

> **⚠️ Important**: Never share your OpenAI API key publicly!

### Step 4: Deepgram Setup

#### 4.1 Get Your API Key

1. Go to [Deepgram Console](https://console.deepgram.com/)
2. Sign in or create an account
3. In the left menu, go to **API Keys**
4. Create a new API key (or use default if available)
5. Copy the key and paste it in `.env` as `DEEPGRAM_API_KEY`

**Optional**: Test the connection:
```bash
curl -X POST https://api.deepgram.com/v1/listen?model=nova-2 \
  -H "Authorization: Token YOUR_DEEPGRAM_API_KEY" \
  -H "Content-Type: audio/wav" \
  --data-binary @audio-file.wav
```

### Step 5: Cartesia Setup

#### 5.1 Get Your API Key

1. Go to [Cartesia Playground](https://play.cartesia.ai/keys)
2. Sign in or create an account
3. Go to **API Keys** in the left menu
4. Create a new key or copy an existing one
5. Paste it in `.env` as `CARTESIA_API_KEY`

### Step 6: Complete Your .env File

Your `.env` file should now look like:

```bash
# Twilio Configuration
TWILIO_API_SID=SKxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+14155552671

# LiveKit Configuration
LIVEKIT_URL=wss://project-name-abc123.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxxxxxxxxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# AI Service API Keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
DEEPGRAM_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
CARTESIA_API_KEY=sk_car_xxxxxxxxxxxxxxxxxxxxxxxx

# Server Configuration
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
```

---

## Running the Application

### Local Development

```bash
# Install dependencies (first time only)
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

Server will start on `http://localhost:3000`

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Testing the Application

### Test Health Check

```bash
curl http://localhost:3000/health
```

### Test LiveKit Token Generation

```bash
curl -X POST http://localhost:3000/livekit-token \
  -H "Content-Type: application/json" \
  -d '{
    "identity": "user123",
    "room": "test-room"
  }'
```

### Test Agent Status

```bash
curl http://localhost:3000/agent-status
```

### Test SMS Sending

```bash
curl -X POST http://localhost:3000/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "message": "Hello from Call and Text Me Maybe!"
  }'
```

### Test Outgoing Calls

```bash
curl -X POST http://localhost:3000/make-call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "from": "+0987654321"
  }'
```

---

## Deployment Options

### Option 1: Heroku

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create call-and-text-me-maybe

# Add buildpack
heroku buildpacks:add heroku/nodejs

# Set environment variables
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
heroku config:set LIVEKIT_URL=your_url
# ... set other variables

# Deploy
git push heroku master

# View logs
heroku logs --tail
```

**Update Twilio webhooks to:**
- `https://your-app-name.herokuapp.com/twilio-voice`
- `https://your-app-name.herokuapp.com/twilio-sms`

### Option 2: Railway

```bash
# Install Railway CLI
npm i -g railway

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway add

# Deploy
railway up
```

### Option 3: AWS EC2

```bash
# Create an EC2 instance (Ubuntu 22.04)
# SSH into the instance

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone your repo
git clone https://github.com/klogins-hash/call-and-text-me-maybe.git
cd call-and-text-me-maybe

# Create .env file with your credentials
nano .env

# Install and start
npm install
npm start
```

### Option 4: Docker on any server

```bash
# On your server
docker run -p 3000:3000 \
  --env-file .env \
  your-dockerhub-username/call-and-text-me-maybe
```

---

## Troubleshooting

### "Cannot find module" error

```bash
# Solution: Reinstall dependencies
rm -rf node_modules
npm install
npm start
```

### Twilio webhook not receiving requests

- ✅ Ensure your server is publicly accessible
- ✅ Update Twilio webhook URLs to your public domain
- ✅ Check Twilio Console > Logs for webhook attempts
- ✅ For testing locally, use ngrok: `ngrok http 3000`

### LiveKit connection fails

- ✅ Verify `LIVEKIT_URL` is correct (should start with `wss://`)
- ✅ Check `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are correct
- ✅ Ensure internet connection is stable
- ✅ Check LiveKit console for connection logs

### SMS/Call not working

- ✅ Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are correct
- ✅ Ensure your Twilio account has credits
- ✅ Check Twilio Console > Logs for API errors
- ✅ Verify phone numbers are in E.164 format: `+1234567890`

### Audio issues

- ✅ Verify `DEEPGRAM_API_KEY` is valid
- ✅ Verify `CARTESIA_API_KEY` is valid
- ✅ Check internet bandwidth
- ✅ Ensure microphone is working (for voice calls)

---

## Next Steps

1. **Customize SMS Responses**: Edit the `generateSmsResponse()` function in `index.js` to add AI-powered responses
2. **Implement Voice Agent**: Integrate a full LiveKit agent with AI capabilities
3. **Add Database**: Store conversation history with MongoDB or PostgreSQL
4. **Implement Authentication**: Add JWT or API key authentication
5. **Add Monitoring**: Set up logging and monitoring with Sentry or DataDog
6. **Scale**: Use load balancer and multiple instances for production

---

## Support & Resources

- 📚 [Twilio Documentation](https://www.twilio.com/docs)
- 📚 [LiveKit Documentation](https://docs.livekit.io)
- 📚 [OpenAI API Documentation](https://platform.openai.com/docs)
- 📚 [Deepgram Documentation](https://developers.deepgram.com)
- 📚 [Cartesia Documentation](https://docs.cartesia.ai)
- 🐛 [Report Issues](https://github.com/klogins-hash/call-and-text-me-maybe/issues)

---

## Security Checklist

Before deploying to production:

- [ ] Never commit `.env` file (it should be in `.gitignore`)
- [ ] Use strong, unique API keys
- [ ] Enable rate limiting on your endpoints
- [ ] Use HTTPS for all production URLs
- [ ] Implement request validation and sanitization
- [ ] Add authentication to sensitive endpoints
- [ ] Monitor API usage and costs
- [ ] Set up alerts for unusual activity
- [ ] Keep dependencies updated: `npm audit fix`
- [ ] Review Twilio/LiveKit audit logs regularly

---

Made with ❤️ for seamless AI agent communication
