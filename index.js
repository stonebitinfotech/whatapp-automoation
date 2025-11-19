const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
require('dotenv').config();

// Initialize OpenAI (optional - only if key is provided)
let openai = null;
const openaiKey = process.env.OPENAI_API_KEY;
if (openaiKey && 
    openaiKey !== 'your_openai_api_key_here' && 
    !openaiKey.endsWith('_here') &&
    openaiKey.startsWith('sk-')) {
  const OpenAI = require('openai');
  openai = new OpenAI({ apiKey: openaiKey });
}

// Store user menu states (in production, use a database)
const userMenuStates = new Map();

// Contact information
const CONTACT_PHONE = '+919426514470';
const CONTACT_EMAIL = 'contact@stonebitinfotech.com';

// Function to append AI disclaimer to all responses
function addAIDisclaimer(text) {
  return `${text}\n\n_*Note: This chat is AI generated*_`;
}

// Main menu categories
const mainMenu = {
  '1': {
    title: '1️⃣ How to Use the App / How to Play',
    subMenu: {
      '1': { title: 'How to register?', response: `📝 *How to Register*

To register on Alpha Lions Esport:

1. Visit our website or open the app
2. Click on "Sign Up" or "Register"
3. Fill in your details:
   - Full Name
   - Email Address
   - Phone Number
   - Create Password
4. Verify your email/phone via OTP
5. Complete your profile setup
6. Add your Game ID

Your account will be activated within 24 hours. You'll receive your Login ID and Password via email/SMS.

Need help? Type "menu" to go back or select option 2 to talk with an agent.` },
      '2': { title: 'How to join tournaments?', response: `🏆 *How to Join Tournaments*

Steps to join tournaments:

1. Log in to your account
2. Go to "Tournaments" section
3. Browse available tournaments
4. Click on a tournament to see details
5. Click "Join" or "Register"
6. Pay entry fee (if applicable)
7. Wait for tournament start time
8. Check your match schedule

Tournament schedules are updated regularly. Check the leaderboard to see your ranking!

Type "menu" to go back or select option 2 for agent support.` },
      '3': { title: 'How to submit match results?', response: `📊 *How to Submit Match Results*

To submit your match results:

1. After completing your match, go to "My Matches"
2. Find your completed match
3. Click "Submit Result"
4. Enter the match score/result
5. Upload screenshot (if required)
6. Click "Submit"

Important:
- Submit results within the time limit
- Screenshots must be clear and valid
- Results are verified by our team
- Disputes can be raised within 24 hours

Type "menu" to go back or contact support for help.` },
      '4': { title: 'How to check leaderboard?', response: `🏅 *How to Check Leaderboard*

To view the leaderboard:

1. Go to "Leaderboard" section
2. Select the tournament/event
3. View rankings:
   - Overall rankings
   - Your position
   - Points and stats
4. Filter by:
   - Tournament
   - Date range
   - Game type

Leaderboards update in real-time. Check regularly to track your progress!

Type "menu" to go back.` },
      '5': { title: 'How to add game ID?', response: `🎮 *How to Add Game ID*

To add your Game ID:

1. Log in to your account
2. Go to "Profile" or "Settings"
3. Click "Add Game ID" or "Game Accounts"
4. Select your game (e.g., PUBG, Free Fire, etc.)
5. Enter your Game ID/Username
6. Verify your Game ID (if required)
7. Save changes

You can add multiple Game IDs for different games. Make sure your Game ID is correct to avoid issues during matches.

Type "menu" to go back.` },
      '6': { title: 'How to update profile details?', response: `👤 *How to Update Profile Details*

To update your profile:

1. Log in to your account
2. Go to "Profile" or "My Account"
3. Click "Edit Profile"
4. Update any information:
   - Name
   - Email
   - Phone Number
   - Profile Picture
   - Game IDs
   - Payment Methods
5. Click "Save Changes"

Some changes may require verification. Your updated information will be saved immediately.

Type "menu" to go back.` }
    }
  },
  '2': {
    title: '2️⃣ Talk With Support Agent',
    subMenu: {
      '1': { title: 'Need to talk with a live agent', response: `👤 *Connecting to Live Agent*

We're connecting you with a live support agent. Please wait while we transfer your request.

An agent will respond to you shortly. In the meantime, you can:
- Email: ${CONTACT_EMAIL}
- Phone: ${CONTACT_PHONE}

Your request has been logged. Thank you for your patience! 🙏

Type "menu" to go back.` },
      '2': { title: 'Need help with account issues', response: `🔐 *Account Issues Support*

For account-related issues, our agent will help you with:
- Account activation
- Login problems
- Profile updates
- Security concerns
- Account verification

Please provide:
- Your registered email/phone
- Account username/ID
- Description of the issue

An agent will contact you shortly to resolve your account issue.

Type "menu" to go back.` },
      '3': { title: 'Need help with tournament issues', response: `🏆 *Tournament Issues Support*

Our agent will assist you with:
- Tournament registration
- Match scheduling
- Result disputes
- Prize distribution
- Tournament rules

Please provide:
- Tournament name
- Match ID (if applicable)
- Issue description

An agent will review your case and get back to you soon.

Type "menu" to go back.` },
      '4': { title: 'Need support for technical problems', response: `🔧 *Technical Support*

For technical issues, our team will help with:
- App not working
- Payment gateway issues
- Game connectivity
- Performance problems
- Bug reports

Please provide:
- Device type (Android/iOS)
- App version
- Screenshots (if possible)
- Error messages

Our technical team will investigate and resolve the issue.

Type "menu" to go back.` },
      '5': { title: 'Need urgent help / priority support', response: `⚡ *Priority Support*

Your request has been marked as URGENT and prioritized!

A senior agent will contact you immediately. For urgent matters:
- Call: ${CONTACT_PHONE}
- Email: ${CONTACT_EMAIL}

Please provide:
- Your account details
- Nature of urgency
- Contact number

We'll resolve your issue as quickly as possible.

Type "menu" to go back.` }
    }
  },
  '3': {
    title: '3️⃣ Withdrawal Not Received',
    subMenu: {
      '1': { title: 'Withdrawal pending', response: `⏳ *Withdrawal Pending*

Your withdrawal is currently being processed. Here's what you need to know:

*Processing Time:*
- UPI: 2-4 hours
- Bank Transfer: 24-48 hours
- Wallet: 1-2 hours

*Check Status:*
1. Go to "My Transactions"
2. Find your withdrawal request
3. Check the status

If it's been longer than the processing time, please contact support with your transaction ID.

Type "menu" to go back.` },
      '2': { title: 'Withdrawal failed', response: `❌ *Withdrawal Failed*

If your withdrawal failed, possible reasons:
- Incorrect account details
- Insufficient balance
- Account verification pending
- Technical error

*What to do:*
1. Check your account balance
2. Verify your payment details
3. Ensure account is verified
4. Try again or contact support

Please provide your transaction ID for investigation.

Type "menu" to go back.` },
      '3': { title: 'Withdrawal stuck in processing', response: `🔄 *Withdrawal Stuck*

If your withdrawal is stuck:

*Check:*
1. Transaction status in "My Transactions"
2. Processing time (may take up to 48 hours)
3. Your payment method details

*Contact Support:*
- Transaction ID
- Withdrawal amount
- Date of request
- Payment method

Our team will investigate and process your withdrawal immediately.

Type "menu" to go back.` },
      '4': { title: 'Withdrawal amount not credited', response: `💰 *Amount Not Credited*

If amount is not credited to your account:

*Verify:*
1. Check your bank/UPI account
2. Verify transaction status
3. Check for any refunds

*Provide to Support:*
- Transaction ID
- Withdrawal amount
- Account details used
- Date of withdrawal

We'll verify and credit the amount to your account within 24 hours.

Type "menu" to go back.` },
      '5': { title: 'UPI ID related issue', response: `📱 *UPI ID Issue*

For UPI-related withdrawal issues:

*Common Issues:*
- UPI ID not verified
- Incorrect UPI ID format
- UPI ID not linked to account

*Solution:*
1. Go to "Payment Methods"
2. Verify your UPI ID
3. Update if incorrect
4. Try withdrawal again

If issue persists, contact support with your UPI ID for manual verification.

Type "menu" to go back.` },
      '6': { title: 'Bank transfer delay', response: `🏦 *Bank Transfer Delay*

Bank transfers may take longer:

*Normal Processing:*
- 24-48 hours (working days)
- May take longer on weekends/holidays

*If Delayed:*
1. Check bank account (including spam)
2. Verify bank details are correct
3. Contact your bank
4. Provide transaction ID to support

Our team will track your transaction and ensure it's processed.

Type "menu" to go back.` }
    }
  },
  '4': {
    title: '4️⃣ ID / Password Not Received',
    subMenu: {
      '1': { title: 'Login ID not received', response: `🆔 *Login ID Not Received*

If you haven't received your Login ID:

*Check:*
1. Email inbox (including spam/junk)
2. SMS messages
3. Wait 24 hours after registration

*Get Login ID:*
1. Go to "Forgot Login ID"
2. Enter registered email/phone
3. Check email/SMS for Login ID

Or contact support with:
- Registered email/phone
- Registration date
- Full name

We'll send your Login ID immediately.

Type "menu" to go back.` },
      '2': { title: 'Password not received', response: `🔑 *Password Not Received*

If you haven't received your password:

*Check:*
1. Email inbox (including spam)
2. SMS messages
3. Wait 24 hours after registration

*Reset Password:*
1. Go to "Forgot Password"
2. Enter Login ID
3. Request OTP
4. Set new password

Or contact support to reset your password manually.

Type "menu" to go back.` },
      '3': { title: 'Forgot password', response: `🔐 *Forgot Password*

To reset your password:

*Steps:*
1. Go to "Forgot Password"
2. Enter your Login ID
3. Select verification method (Email/SMS)
4. Enter OTP received
5. Create new password
6. Confirm new password

*Security Tips:*
- Use strong password
- Don't share with anyone
- Change regularly

If OTP not received, contact support.

Type "menu" to go back.` },
      '4': { title: 'OTP not coming', response: `📲 *OTP Not Received*

If OTP is not coming:

*Check:*
1. Phone number is correct
2. Network connection
3. Wait 2-3 minutes
4. Check spam messages

*Try:*
1. Request OTP again
2. Use email OTP instead
3. Verify phone number

*Contact Support:*
- Login ID
- Registered phone number
- Issue description

We'll verify and send OTP manually.

Type "menu" to go back.` },
      '5': { title: 'Verification email/SMS not received', response: `✉️ *Verification Not Received*

If verification email/SMS not received:

*Check:*
1. Email inbox (spam/junk folder)
2. SMS messages
3. Correct email/phone number
4. Wait 5-10 minutes

*Resend:*
1. Go to "Resend Verification"
2. Enter email/phone
3. Click "Resend"

*Contact Support:*
- Registered email/phone
- Registration date
- Full name

We'll verify and activate your account manually.

Type "menu" to go back.` },
      '6': { title: 'Account not activated', response: `⏸️ *Account Not Activated*

If your account is not activated:

*Check:*
1. Verification email/SMS clicked
2. Profile completed
3. 24 hours passed since registration

*Activate:*
1. Check email for activation link
2. Click activation link
3. Complete profile setup

*Contact Support:*
- Registered email/phone
- Registration date
- Full name

We'll activate your account immediately.

Type "menu" to go back.` }
    }
  },
  '5': {
    title: '5️⃣ Match Result Issues',
    subMenu: {
      '1': { title: 'Wrong result submitted', response: `❌ *Wrong Result Submitted*

If wrong result was submitted:

*Report Issue:*
1. Go to "My Matches"
2. Find the match
3. Click "Report Issue"
4. Select "Wrong Result"
5. Provide correct result
6. Upload proof/screenshot

*Dispute Process:*
- Review within 24 hours
- Both players contacted
- Decision based on evidence
- Result updated accordingly

Contact support with match ID for faster resolution.

Type "menu" to go back.` },
      '2': { title: 'Opponent cheating', response: `🚫 *Opponent Cheating*

To report cheating:

*Report:*
1. Go to match details
2. Click "Report Cheating"
3. Select violation type
4. Upload evidence:
   - Screenshots
   - Video recordings
   - Match details
5. Submit report

*Our Action:*
- Investigation within 48 hours
- Opponent contacted
- Account suspension if proven
- Match result adjusted

We take cheating seriously. Provide strong evidence.

Type "menu" to go back.` },
      '3': { title: 'Match not starting', response: `⏸️ *Match Not Starting*

If match is not starting:

*Check:*
1. Match start time
2. Both players ready
3. Game ID correct
4. Network connection

*Solutions:*
1. Refresh match page
2. Check opponent status
3. Contact opponent
4. Report to support

*Contact Support:*
- Match ID
- Tournament name
- Issue description

We'll reschedule or resolve the issue.

Type "menu" to go back.` },
      '4': { title: 'Match cancelled or delayed', response: `⏰ *Match Cancelled/Delayed*

If match is cancelled or delayed:

*Reasons:*
- Technical issues
- Opponent no-show
- Tournament rescheduling
- System maintenance

*What Happens:*
- Match rescheduled
- Refund (if applicable)
- Points adjusted
- Notification sent

*Check:*
1. "My Matches" for updates
2. Tournament announcements
3. Email notifications

Contact support for match rescheduling.

Type "menu" to go back.` }
    }
  },
  '6': {
    title: '6️⃣ Payment / Top-up Issues',
    subMenu: {
      '1': { title: 'Payment successful but coins not added', response: `💳 *Coins Not Added*

If payment succeeded but coins not added:

*Check:*
1. Transaction status
2. Account balance
3. Wait 5-10 minutes
4. Refresh app

*Report:*
1. Go to "My Transactions"
2. Find payment transaction
3. Click "Report Issue"
4. Provide transaction ID

*We'll:*
- Verify payment
- Add coins manually
- Update within 24 hours

Contact support with transaction ID for immediate resolution.

Type "menu" to go back.` },
      '2': { title: 'Double payment', response: `💰 *Double Payment*

If charged twice:

*Check:*
1. "My Transactions"
2. Bank statement
3. Payment gateway

*Report:*
- Transaction IDs (both)
- Payment amount
- Payment method
- Date/time

*Refund:*
- Verified within 48 hours
- Refunded to original method
- Confirmation sent

We'll process refund immediately after verification.

Type "menu" to go back.` },
      '3': { title: 'Payment deducted but order failed', response: `❌ *Payment Deducted, Order Failed*

If payment deducted but order failed:

*Check:*
1. Transaction status
2. Order status
3. Account balance

*Report:*
- Transaction ID
- Order ID
- Payment amount
- Error message

*Resolution:*
- Refund processed (if order failed)
- Order retried (if possible)
- Coins added (if successful)

Refund processed within 24-48 hours.

Type "menu" to go back.` }
    }
  },
  '7': {
    title: '7️⃣ App Issues',
    subMenu: {
      '1': { title: 'App not opening', response: `📱 *App Not Opening*

If app is not opening:

*Try:*
1. Restart your device
2. Clear app cache
3. Update app to latest version
4. Reinstall app
5. Check device storage

*Check:*
- Internet connection
- Device compatibility
- App permissions

*Contact Support:*
- Device model
- OS version
- App version
- Error message

We'll help resolve the issue.

Type "menu" to go back.` },
      '2': { title: 'App crashing', response: `💥 *App Crashing*

If app keeps crashing:

*Try:*
1. Force stop app
2. Clear app data
3. Update app
4. Restart device
5. Reinstall app

*Report:*
- When it crashes
- What you were doing
- Device details
- Screenshots (if possible)

*We'll:*
- Investigate issue
- Fix in next update
- Provide workaround

Update app to latest version for fixes.

Type "menu" to go back.` },
      '3': { title: 'Notification not coming', response: `🔔 *Notifications Not Coming*

If notifications not received:

*Check:*
1. App notification settings
2. Device notification settings
3. Do Not Disturb mode
4. App installed properly

*Enable:*
1. Go to App Settings
2. Enable notifications
3. Allow all notification types
4. Check device settings

*Contact Support:*
- Device model
- Notification type missing

We'll help enable notifications.

Type "menu" to go back.` },
      '4': { title: 'Slow performance', response: `🐌 *Slow Performance*

If app is slow:

*Optimize:*
1. Clear app cache
2. Close other apps
3. Free up device storage
4. Update app
5. Restart device

*Check:*
- Internet speed
- Device RAM
- Background apps

*Report:*
- Device details
- Performance issues
- When it happens

We'll optimize app performance in updates.

Type "menu" to go back.` }
    }
  }
};

// Function to show main menu
function getMainMenu() {
  return addAIDisclaimer(`👋 *Hello! How can we help you today?*

Please select a category by typing the number:

*1️⃣* - How to Use the App / How to Play
*2️⃣* - Talk With Support Agent
*3️⃣* - Withdrawal Not Received
*4️⃣* - ID / Password Not Received
*5️⃣* - Match Result Issues
*6️⃣* - Payment / Top-up Issues
*7️⃣* - App Issues

*Type the number (1-7) to select a category*`);
}

// Function to show sub-menu
function getSubMenu(category) {
  const categoryData = mainMenu[category];
  if (!categoryData || !categoryData.subMenu) return null;
  
  let menu = `*${categoryData.title}*\n\nPlease select an option:\n\n`;
  
  Object.keys(categoryData.subMenu).forEach(key => {
    menu += `*${key}* - ${categoryData.subMenu[key].title}\n`;
  });
  
  menu += `\n*Type the number to select an option*\n*Type "back" to go to main menu*`;
  
  return addAIDisclaimer(menu);
}

// Function to handle menu selection
function handleMenuSelection(userMessage, senderNumber) {
  const message = userMessage.trim().toLowerCase();
  const currentState = userMenuStates.get(senderNumber) || 'main';
  
  // Handle "back" or "menu" to return to main menu
  if (message === 'back' || message === 'menu' || message === 'main') {
    userMenuStates.set(senderNumber, 'main');
    return { type: 'menu', content: getMainMenu() };
  }
  
  // If user is in main menu, show sub-menu
  if (currentState === 'main') {
    if (message >= '1' && message <= '7') {
      userMenuStates.set(senderNumber, `sub_${message}`);
      const subMenu = getSubMenu(message);
      if (subMenu) {
        return { type: 'menu', content: subMenu };
      }
    }
  }
  
  // If user is in sub-menu, show response
  if (currentState.startsWith('sub_')) {
    const category = currentState.split('_')[1];
    const categoryData = mainMenu[category];
    
    if (categoryData && categoryData.subMenu && categoryData.subMenu[message]) {
      userMenuStates.set(senderNumber, 'main'); // Reset to main after showing response
      return { 
        type: 'response', 
        content: addAIDisclaimer(categoryData.subMenu[message].response)
      };
    }
  }
  
  return null;
}

// Check if message is a help request
function isHelpRequest(message) {
  const lowerMessage = message.toLowerCase().trim();
  const helpKeywords = [
    'hello',
    'hi',
    'help',
    'need help',
    'can you help',
    'i need help',
    'support',
    'assistance'
  ];
  
  // Check for exact patterns like "Hello! I Need Help. Can you help me?"
  if ((lowerMessage.includes('hello') || lowerMessage.includes('hi')) && 
      (lowerMessage.includes('help') || lowerMessage.includes('need'))) {
    return true;
  }
  
  // Check for "can you help" pattern
  if (lowerMessage.includes('can you help') || lowerMessage.includes('can u help')) {
    return true;
  }
  
  // Check for standalone help requests
  if (lowerMessage === 'help' || lowerMessage === 'i need help' || lowerMessage === 'need help') {
    return true;
  }
  
  // Check for help keywords (but not if it's just a menu number)
  if (!/^\d+$/.test(lowerMessage)) {
    for (const keyword of helpKeywords) {
      if (lowerMessage.includes(keyword)) {
        return true;
      }
    }
  }
  
  return false;
}

// Initialize WhatsApp Client
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './auth'
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  }
});

// Generate QR Code for authentication
client.on('qr', (qr) => {
  console.log('📱 Scan this QR code with WhatsApp to authenticate:');
  qrcode.generate(qr, { small: true });
});

// When client is ready
client.on('ready', () => {
  // Client ready
});

// When authentication is successful
client.on('authenticated', () => {
  console.log('✅ Authentication successful!');
});

// When authentication fails
client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
});

// Handle incoming messages
client.on('message', async (message) => {
  try {
    const contact = await message.getContact();
    const chat = await message.getChat();
    
    // Ignore messages from groups (optional - remove if you want group support)
    if (chat.isGroup) {
      return;
    }

    // Ignore your own messages
    if (message.fromMe) {
      return;
    }

    const userMessage = message.body;
    const senderName = contact.pushname || contact.number;
    const senderNumber = contact.number;

    // Check if it's a help request and show main menu
    if (isHelpRequest(userMessage)) {
      userMenuStates.set(senderNumber, 'main');
      await message.reply(getMainMenu());
      return;
    }

    // Check if user is selecting a menu option
    const menuResponse = handleMenuSelection(userMessage, senderNumber);
    if (menuResponse) {
      await message.reply(menuResponse.content);
      return;
    }

    // Generate AI response with fallback chain
    const aiResponse = await generateAIResponse(userMessage, senderName);

    // Send response with AI disclaimer
    await message.reply(addAIDisclaimer(aiResponse));

  } catch (error) {
    console.error('❌ Error handling message:', error);
    
    // Send error message to user
    try {
      await message.reply(addAIDisclaimer(`Sorry, I encountered an error. Please try again later or contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`));
    } catch (replyError) {
      console.error('❌ Error sending error message:', replyError);
    }
  }
});

// AI Response Generation Function with Fallback Chain
async function generateAIResponse(userMessage, senderName) {
  const systemPrompt = `You are a helpful customer support assistant for Alpha Lions Esport, a professional esports organization. 
Your role is to:
- Provide fast and friendly customer support
- Answer questions about tournaments, teams, players, and events
- Help with registration, schedules, and general inquiries
- Be professional, concise, and helpful
- If you don't know something, politely direct them to contact support

Contact Information:
- Email: ${CONTACT_EMAIL}
- Phone: ${CONTACT_PHONE}

Keep responses brief (2-3 sentences max) and conversational, as this is WhatsApp messaging.`;

  // Try OpenAI first (if configured)
  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Customer message: ${userMessage}` }
        ],
        max_tokens: 150,
        temperature: 0.7
      });
      const response = completion.choices[0].message.content.trim();
      return response;
    } catch (error) {
      // Try next option
    }
  }

  // Try Groq API (FREE - Very Fast)
  try {
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && groqKey !== 'your_groq_api_key_here') {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.choices[0].message.content.trim();
    }
  } catch (error) {
    // Try next option
  }

  // Try Hugging Face Inference API (FREE - No key needed)
  try {
    const prompt = `${systemPrompt}\n\nCustomer: ${userMessage}\nAssistant:`;
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          return_full_text: false
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    if (response.data && response.data[0] && response.data[0].generated_text) {
      return response.data[0].generated_text.trim();
    }
  } catch (error) {
    // Try alternative Hugging Face model if first fails
    try {
      const prompt = `${systemPrompt}\n\nCustomer: ${userMessage}\nAssistant:`;
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/google/flan-t5-base',
        {
          inputs: prompt,
          parameters: {
            max_length: 150
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );
      
      if (response.data && response.data[0] && response.data[0].generated_text) {
        return response.data[0].generated_text.trim();
      }
    } catch (error2) {
      // Try next option
    }
  }

  // Try Google Gemini API (FREE tier available)
  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `${systemPrompt}\n\nCustomer message: ${userMessage}\n\nProvide a helpful response:`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    }
  } catch (error) {
    // Use keyword fallback
  }

  // Final fallback: Keyword-based responses
  return generateFallbackResponse(userMessage);
}

// Fallback response generator (keyword-based)
function generateFallbackResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Greeting responses
  if (message.match(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
    return 'Hello! 👋 Welcome to Alpha Lions Esport. How can I assist you today?';
  }
  
  // Tournament inquiries
  if (message.match(/\b(tournament|tourney|competition|event|match|game)\b/)) {
    return `Thanks for your interest in our tournaments! For tournament details, schedules, and registration, please contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`;
  }
  
  // Registration inquiries
  if (message.match(/\b(register|sign up|join|participate|entry|apply)\b/)) {
    return `To register for our tournaments or events, please contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}. We'd be happy to help you get started!`;
  }
  
  // Schedule/time inquiries
  if (message.match(/\b(schedule|time|when|date|timing|start|begin)\b/)) {
    return `For the latest schedules and event timings, please contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}. For specific details, feel free to ask!`;
  }
  
  // Team/player inquiries
  if (message.match(/\b(team|player|roster|squad|member)\b/)) {
    return `Thanks for your interest in Alpha Lions Esport! For information about our teams and players, contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`;
  }
  
  // Help/support inquiries
  if (message.match(/\b(help|support|assist|problem|issue|question)\b/)) {
    return `I'm here to help! For direct support, contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}. Please let me know what you need assistance with.`;
  }
  
  // Thank you responses
  if (message.match(/\b(thank|thanks|appreciate|grateful)\b/)) {
    return 'You\'re welcome! 😊 If you need anything else, feel free to ask.';
  }
  
  // Default fallback
  const defaultResponses = [
    `Thank you for contacting Alpha Lions Esport! For direct support, contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}. How can I help you today?`,
    `Hello! Thanks for reaching out. I'm here to assist you with any questions about Alpha Lions Esport. For direct support, contact ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
    `Hi! Welcome to Alpha Lions Esport. What would you like to know? For direct support, contact ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Handle disconnection
client.on('disconnected', (reason) => {
  // Client disconnected, will attempt to reconnect
});

// Initialize client
client.initialize();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await client.destroy();
  process.exit(0);
});
