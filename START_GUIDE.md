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

## 🐛 Troubleshooting

### Bot not starting?
- Check if Node.js is installed: `node --version`
- Make sure all dependencies are installed: `npm install`
- Check for errors in terminal

### QR Code not appearing?
- Make sure terminal supports QR codes
- Try Windows Terminal or PowerShell
- Check internet connection

### Bot not responding?
- Check console for error messages
- Verify API keys in `.env` file
- Make sure WhatsApp session is active

### Want to restart?
- Stop bot (Ctrl+C)
- Delete `auth/` folder (if needed)
- Start again: `npm start`

---

## 📞 Need Help?

Check the console logs for detailed error messages. The bot logs everything it does!


