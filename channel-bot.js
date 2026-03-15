/**
 * Dhurandhar 2 Telegram Channel Auto-Post Bot
 * 
 * This bot automatically posts content about the movie "Dhurandhar 2"
 * to a specified Telegram channel at scheduled times.
 * Each post includes a link to the main movie search bot.
 * 
 * Deploy on Render with Node.js environment.
 */

// ==================== DEPENDENCIES ====================
const { Telegraf } = require('telegraf');
const express = require('express');
const cron = require('node-cron');
require('dotenv').config(); // Optional, for local .env file

// ==================== CONFIGURATION ====================
// Load from environment variables (set these on Render)
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME || '@Dhurandhar2_MovieHD'; // Your channel
const MAIN_BOT_USERNAME = process.env.MAIN_BOT_USERNAME || '@BestMovieSearchHubBot'; // Your movie bot

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing! Set it in environment variables.');
  process.exit(1);
}

// ==================== EXPRESS SERVER FOR RENDER ====================
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('✅ Dhurandhar 2 Channel Bot is running!'));
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(PORT, () => {
  console.log(`🚀 Express server listening on port ${PORT}`);
});

// ==================== TELEGRAM BOT INIT ====================
const bot = new Telegraf(BOT_TOKEN);

// ==================== POST CONTENT LIBRARY ====================
/**
 * Array of post objects. Each object can have:
 * - type: 'text' (more types like 'photo' can be added later)
 * - content: the message text (Markdown supported)
 */
const POSTS = [
  {
    type: 'text',
    content: `🔥 **Dhurandhar 2 – The Revenge** 🔥

🎬 **Starring:** Ranveer Singh, Sanjay Dutt, Arjun Rampal, R Madhavan, Akshaye Khanna
📅 **Release:** 19 March 2026
🌍 **Languages:** Hindi, Tamil, Telugu, Kannada, Malayalam

👇 **Full Movie Download:**
👉 ${MAIN_BOT_USERNAME}

#Dhurandhar2 #RanveerSingh #Bollywood`
  },
  {
    type: 'text',
    content: `⚡ **FA9LA Moment** ⚡

*"ये सिर्फ गुस्सा नहीं, इंसाफ है!"*

The dialogue that shook the theatres!

📥 Get the full movie here:
👉 ${MAIN_BOT_USERNAME}

#Dhurandhar2 #Dialogue #RanveerSingh`
  },
  {
    type: 'text',
    content: `💰 **Box Office Update** 💰

🇮🇳 **India:** ₹80 crore (Day 1)
🌎 **Worldwide:** ₹150 crore+

🚀 Biggest opening of the year!

Watch now:
👉 ${MAIN_BOT_USERNAME}

#Dhurandhar2 #BoxOffice #Blockbuster`
  },
  {
    type: 'text',
    content: `🌟 **Star Cast** 🌟

⭐ Ranveer Singh
⭐ Sanjay Dutt
⭐ Arjun Rampal
⭐ R Madhavan
⭐ Akshaye Khanna

🔥 All stars in one epic film!
📥 Download: ${MAIN_BOT_USERNAME}

#Dhurandhar2 #StarCast #Bollywood`
  },
  {
    type: 'text',
    content: `⏰ **Movie Details**

🎥 **Runtime:** 4 hours (235 minutes)
🌍 **Languages:** Hindi, Tamil, Telugu, Kannada, Malayalam
🎬 **Director:** Abhinav Singh Kashyap
💰 **Budget:** ₹400 crore+

Watch in your preferred language:
👉 ${MAIN_BOT_USERNAME}

#Dhurandhar2 #Details #MovieInfo`
  },
  {
    type: 'text',
    content: `💥 **Action Spectacle** 💥

Ranveer Singh performs death-defying stunts!
50-foot jump, 100-car explosion.

Experience the action:
📥 ${MAIN_BOT_USERNAME}

#Dhurandhar2 #Action #RanveerSingh`
  },
  {
    type: 'text',
    content: `⭐ **Audience Reviews** ⭐

*"Dhurandhar 2 blew my mind! 5/5"*
*"Ranveer's best performance ever"*
*"Action, drama, emotion – everything"*

Add your review after watching:
👉 ${MAIN_BOT_USERNAME}

#Dhurandhar2 #Reviews #MustWatch`
  },
  {
    type: 'text',
    content: `🏆 **Record Breaker** 🏆

✅ Highest opening day of 2026
✅ ₹32 crore+ advance bookings
✅ Released in 5 languages

Be part of history:
📥 ${MAIN_BOT_USERNAME}

#Dhurandhar2 #Records #Blockbuster`
  },
  {
    type: 'text',
    content: `🎉 **Fan Craze** 🎉

Theatres packed, social media trending!
Dhurandhar 2 is a phenomenon.

Join the craze:
📥 ${MAIN_BOT_USERNAME}

#Dhurandhar2 #FanCraze #Viral`
  },
  {
    type: 'text',
    content: `📥 **Download Dhurandhar 2 Full Movie** 📥

✅ HD Quality – 1080p, 720p
✅ Hindi + 4 other languages
✅ Fast download speed

👇 Download now:
👉 ${MAIN_BOT_USERNAME}

#Dhurandhar2 #Download #HDMovie`
  }
];

// ==================== UPDATED FUNCTION WITH BUTTONS ====================
async function sendRandomPost() {
  try {
    // Pick a random post from the library
    const randomIndex = Math.floor(Math.random() * POSTS.length);
    const post = POSTS[randomIndex];
    
    console.log(`📤 Sending post #${randomIndex + 1} at ${new Date().toLocaleString()}`);
    
    // Text post with inline button
    if (post.type === 'text') {
      await bot.telegram.sendMessage(CHANNEL_USERNAME, post.content, {
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
        reply_markup: {
          inline_keyboard: [
            [{ text: '📥 Download Now', url: `https://t.me/${MAIN_BOT_USERNAME.replace('@', '')}` }]
          ]
        }
      });
      console.log('✅ Post sent successfully with button!');
    }
    // Future: add support for photo, video, etc.
    
  } catch (error) {
    console.error('❌ Failed to send post:', error.message);
    if (error.response) {
      console.error('Telegram API response:', error.response);
    }
  }
}

// ==================== SCHEDULED POSTS ====================
/**
 * Cron schedule format: minute hour day month day-of-week
 * Examples:
 *   '0 9 * * *'    – 9:00 AM daily
 *   '0 13 * * *'   – 1:00 PM daily
 *   '0 17 * * *'   – 5:00 PM daily
 *   '0 20 * * *'   – 8:00 PM daily
 *   '0 23 * * *'   – 11:00 PM daily
 */

// Morning post
cron.schedule('0 9 * * *', () => {
  console.log('⏰ Scheduled: 9:00 AM');
  sendRandomPost();
});

// Afternoon post
cron.schedule('0 13 * * *', () => {
  console.log('⏰ Scheduled: 1:00 PM');
  sendRandomPost();
});

// Evening post
cron.schedule('0 17 * * *', () => {
  console.log('⏰ Scheduled: 5:00 PM');
  sendRandomPost();
});

// Night post
cron.schedule('0 20 * * *', () => {
  console.log('⏰ Scheduled: 8:00 PM');
  sendRandomPost();
});

// Late night post (optional)
cron.schedule('0 23 * * *', () => {
  console.log('⏰ Scheduled: 11:00 PM');
  sendRandomPost();
});

// ==================== STARTUP ====================
bot.launch().then(() => {
  console.log('🤖 Dhurandhar 2 Channel Bot started!');
  console.log(`📢 Channel: ${CHANNEL_USERNAME}`);
  console.log('⏰ Scheduled posts at: 9AM, 1PM, 5PM, 8PM, 11PM daily');
  
  // FORCE IMMEDIATE POST (Remove after testing)
  setTimeout(() => {
    console.log('🚨 FORCE POST - Testing NOW!');
    sendRandomPost();
  }, 5000); // 5 seconds after start
  
  // Test post 1 minute after startup
  setTimeout(() => {
    console.log('🧪 Sending test post...');
    sendRandomPost();
  }, 60000);
  
}).catch((err) => {
  console.error('❌ Bot failed to start:', err);
});

// Graceful stop handlers
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
