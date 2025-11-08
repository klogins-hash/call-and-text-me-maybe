#!/bin/bash

# Exoscale Deployment Script for Call and Text Me Maybe
# This script deploys the application to Exoscale using their CLI

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Call and Text Me Maybe - Exoscale Deployment${NC}"
echo "=================================================="

# Check if exo CLI is installed
if ! command -v exo &> /dev/null; then
    echo -e "${RED}❌ Exoscale CLI not found. Please install it first:${NC}"
    echo "   https://github.com/exoscale/cli"
    exit 1
fi

# Configuration
ENVIRONMENT=${1:-production}
APP_NAME="call-and-text-me-maybe"
DOCKER_IMAGE="${APP_NAME}:latest"
INSTANCE_TYPE="medium"
ZONE="ch-dk-2" # Change to your preferred zone

echo -e "${YELLOW}Configuration:${NC}"
echo "  Environment: $ENVIRONMENT"
echo "  App Name: $APP_NAME"
echo "  Instance Type: $INSTANCE_TYPE"
echo "  Zone: $ZONE"
echo ""

# Step 1: Build Docker image
echo -e "${YELLOW}📦 Step 1: Building Docker image...${NC}"
docker build -t $DOCKER_IMAGE .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

# Step 2: Create Exoscale compute instance
echo ""
echo -e "${YELLOW}📱 Step 2: Creating Exoscale instance...${NC}"
echo "   Run this manually or use the Exoscale web console:"
echo ""
echo "   exo compute instance create \\
          --template 'Ubuntu 22.04 LTS' \\
          --instance-type $INSTANCE_TYPE \\
          --zone $ZONE \\
          --enable-public-ipv4 \\
          --security-group default \\
          --name $APP_NAME"
echo ""

# Step 3: Instructions for manual deployment
echo -e "${YELLOW}🔧 Step 3: Deploy to Instance${NC}"
echo ""
echo "After creating the instance, SSH into it and run:"
echo ""
echo "   # Install Docker on the instance"
echo "   sudo apt-get update"
echo "   sudo apt-get install -y docker.io docker-compose"
echo "   sudo usermod -aG docker \$USER"
echo ""
echo "   # Clone the repository"
echo "   git clone https://github.com/klogins-hash/call-and-text-me-maybe.git"
echo "   cd call-and-text-me-maybe"
echo ""
echo "   # Create .env file with your credentials"
echo "   nano .env"
echo ""
echo "   # Start the application"
echo "   docker-compose up -d"
echo ""

# Step 4: Configure firewall
echo -e "${YELLOW}🔒 Step 4: Configure Firewall Rules${NC}"
echo ""
echo "Allow inbound traffic on port 3000 (HTTP):"
echo ""
echo "   exo firewall rule add \\
          --security-group default \\
          --protocol TCP \\
          --port 3000 \\
          --cidr 0.0.0.0/0"
echo ""

# Step 5: Domain setup
echo -e "${YELLOW}🌐 Step 5: Configure Domain${NC}"
echo ""
echo "Point your domain to the instance's public IP address:"
echo ""
echo "   1. Get the instance's public IP:"
echo "      exo compute instance list"
echo ""
echo "   2. Update your domain's DNS records to point to this IP"
echo ""
echo "   3. Update Twilio webhooks to use your domain:"
echo "      - https://yourdomain.com/twilio-voice"
echo "      - https://yourdomain.com/twilio-sms"
echo ""

# Step 6: SSL Certificate
echo -e "${YELLOW}🔐 Step 6: Install SSL Certificate${NC}"
echo ""
echo "Install Let's Encrypt SSL certificate:"
echo ""
echo "   sudo apt-get install -y certbot python3-certbot-nginx"
echo "   sudo certbot certonly --standalone -d yourdomain.com"
echo ""
echo "Update your application to use HTTPS in a reverse proxy (nginx recommended)"
echo ""

# Summary
echo "=================================================="
echo -e "${GREEN}📋 Deployment Summary${NC}"
echo ""
echo "✅ Docker image built"
echo "⏳ Instance creation (manual)"
echo "⏳ Application deployment (manual)"
echo "⏳ Firewall configuration (manual)"
echo ""
echo "For more information:"
echo "  - Exoscale CLI: https://github.com/exoscale/cli"
echo "  - Exoscale Docs: https://community.exoscale.com"
echo ""
echo -e "${GREEN}🎉 Ready to deploy!${NC}"
