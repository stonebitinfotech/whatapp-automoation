# 🐧 Linux Server Deployment Guide

## Quick Fix for Puppeteer/Chromium Errors

If you're seeing errors like:
```
Error: Failed to launch the browser process!
libatk-1.0.so.0: cannot open shared object file: No such file or directory
```

Follow these steps:

### Step 1: Install System Dependencies

**For Ubuntu/Debian servers:**
```bash
chmod +x install-linux-deps.sh
./install-linux-deps.sh
```

**Or manually:**
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
```

**For CentOS/RHEL/Fedora:**
```bash
# Fedora
sudo dnf install -y alsa-lib atk cups-libs gtk3 libXcomposite libXcursor libXdamage libXext libXi libXrandr libXScrnSaver libXtst pango

# CentOS/RHEL
sudo yum install -y alsa-lib atk cups-libs gtk3 libXcomposite libXcursor libXdamage libXext libXi libXrandr libXScrnSaver libXtst pango
```

### Step 2: Verify Installation

```bash
# Check if Node.js is installed
node --version

# Install npm dependencies
npm install

# Test the application
npm start
```

### Step 3: Deploy with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start index.js --name whatsapp-automation

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown by the command above

# View logs
pm2 logs whatsapp-automation

# Monitor
pm2 monit
```

## Common Issues and Solutions

### Issue 1: Missing Library Errors
**Error:** `libatk-1.0.so.0: cannot open shared object file`

**Solution:** Run the installation script or install dependencies manually (see Step 1)

### Issue 2: Permission Denied
**Error:** Permission errors when running scripts

**Solution:**
```bash
chmod +x install-linux-deps.sh
```

### Issue 3: Insufficient Memory
**Error:** Application crashes or runs slowly

**Solution:**
- Ensure server has at least 1GB RAM
- Consider using swap space if needed
- Monitor with `pm2 monit`

### Issue 4: Port Already in Use
**Error:** Port conflicts

**Solution:** Check what's using the port and stop it, or configure the app to use a different port

## Server Requirements

- **OS:** Linux (Ubuntu 18.04+, Debian 10+, CentOS 7+)
- **Node.js:** v14.0.0 or higher
- **RAM:** Minimum 1GB (2GB+ recommended)
- **Disk Space:** At least 500MB free
- **Internet:** Stable connection required

## Environment Variables

Create a `.env` file in the project root:

```env
# Optional: OpenAI API Key
OPENAI_API_KEY=your_key_here

# Optional: Groq API Key (Free alternative)
GROQ_API_KEY=your_key_here

# Optional: Google Gemini API Key (Free alternative)
GEMINI_API_KEY=your_key_here
```

## Monitoring and Maintenance

### View Logs
```bash
# PM2 logs
pm2 logs whatsapp-automation

# Or view specific log file
tail -f logs/whatsapp-automation-error.log
```

### Restart Application
```bash
pm2 restart whatsapp-automation
```

### Stop Application
```bash
pm2 stop whatsapp-automation
```

### Update Application
```bash
# Pull latest changes
git pull

# Install new dependencies (if any)
npm install

# Restart application
pm2 restart whatsapp-automation
```

## Security Notes

1. **Firewall:** Ensure only necessary ports are open
2. **User Permissions:** Run the application as a non-root user
3. **API Keys:** Never commit `.env` file to git
4. **Updates:** Keep system packages and Node.js updated

## Need Help?

Check the main `START_GUIDE.md` for more detailed information about the application.

