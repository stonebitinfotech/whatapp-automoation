# 🚀 How to Start/Run the WhatsApp Bot

## Quick Start Steps

### 1. **Make sure dependencies are installed**
```bash
npm install
```

### 2. **Set up your API keys** (Optional but recommended)
Edit the `.env` file and add at least ONE free API key:

**Option 1: Groq API (FREE - Recommended)**
- Get key from: https://console.groq.com/keys
- Add to `.env`: `GROQ_API_KEY=your_key_here`

**Option 2: Google Gemini API (FREE)**
- Get key from: https://makersuite.google.com/app/apikey
- Add to `.env`: `GEMINI_API_KEY=your_key_here`

**Note:** The bot works even without API keys using keyword fallback!

### 3. **Start the bot**
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### 4. **Scan QR Code**
- A QR code will appear in your terminal
- Open WhatsApp on your phone
- Go to **Settings** → **Linked Devices**
- Tap **"Link a Device"**
- Scan the QR code from your terminal

### 5. **Bot is Running!**
Once authenticated, you'll see:
```
✅ Authentication successful!
✅ WhatsApp client is ready!
🤖 AI Assistant is active and listening for messages...
```

The bot will now automatically respond to incoming WhatsApp messages!

---

## 📱 How to Test

1. Send a message to your WhatsApp number from another phone
2. Send: **"Hello! I Need Help. Can you help me?"**
3. The bot will show the interactive menu
4. Select options to test the menu system

---

## 🛑 How to Stop the Bot

Press `Ctrl + C` in the terminal to stop the bot gracefully.

---

## 🔄 Keep Bot Running 24/7

### Option 1: Keep Terminal Open
- Just keep your terminal/command prompt window open
- The bot will run as long as the terminal is open

### Option 2: Run in Background (Windows)
```powershell
Start-Process node -ArgumentList "index.js" -WindowStyle Hidden
```

### Option 3: Use PM2 (Recommended for Production)
```bash
# Install PM2 globally
npm install -g pm2

# Start bot with PM2
pm2 start index.js --name whatsapp-bot

# Make it start on system reboot
pm2 startup
pm2 save

# View logs
pm2 logs whatsapp-bot

# Stop bot
pm2 stop whatsapp-bot
```

### Option 4: Run as Windows Service
Use tools like:
- **NSSM** (Non-Sucking Service Manager)
- **node-windows** package

---

## ⚠️ Important Notes

1. **Keep Terminal Open**: The bot needs the terminal window to stay open
2. **Internet Required**: WhatsApp Web needs internet connection
3. **Phone Must Stay Connected**: Keep your phone connected to internet
4. **Session Persists**: Once authenticated, you don't need to scan QR again (unless you delete the `auth/` folder)

---

## 🐧 Linux Server Setup

### Installing Required Dependencies

If you're running on a Linux server and getting Puppeteer/Chromium errors, you need to install system dependencies:

**For Debian/Ubuntu:**
```bash
# Make the script executable
chmod +x install-linux-deps.sh

# Run the installation script
./install-linux-deps.sh
```

**Or install manually (Debian/Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils
```

**For CentOS/RHEL/Fedora:**
```bash
# Fedora
sudo dnf install -y alsa-lib atk cups-libs gtk3 libXcomposite libXcursor libXdamage libXext libXi libXrandr libXScrnSaver libXtst pango

# CentOS/RHEL
sudo yum install -y alsa-lib atk cups-libs gtk3 libXcomposite libXcursor libXdamage libXext libXi libXrandr libXScrnSaver libXtst pango
```

### Common Linux Errors

**Error: `libatk-1.0.so.0: cannot open shared object file`**
- Solution: Run `./install-linux-deps.sh` or install dependencies manually (see above)

**Error: `Failed to launch the browser process`**
- Solution: Install all required system dependencies
- Make sure you're running on a system with a display server (or use headless mode)

**Error: `No usable sandbox`**
- Solution: The Puppeteer config already includes `--no-sandbox` flag, which should handle this

---

## 🐛 Troubleshooting

### Bot not starting?
- Check if Node.js is installed: `node --version`
- Make sure all dependencies are installed: `npm install`
- **On Linux:** Install system dependencies (see Linux Server Setup above)
- Check for errors in terminal

### QR Code not appearing?
- Make sure terminal supports QR codes
- Try Windows Terminal or PowerShell
- Check internet connection

### Bot not responding?
- Check console for error messages
- Verify API keys in `.env` file
- Make sure WhatsApp session is active

### Puppeteer/Chromium errors on Linux?
- Run `./install-linux-deps.sh` to install required system libraries
- Check the error message for missing library names
- Ensure you have sufficient disk space and memory

### Want to restart?
- Stop bot (Ctrl+C)
- Delete `auth/` folder (if needed)
- Start again: `npm start`

---

## 📞 Need Help?

Check the console logs for detailed error messages. The bot logs everything it does!


