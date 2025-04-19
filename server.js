const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), {
    headers: {
      'Content-Type': 'text/html'
    }
  });
});

// Static chatbot responses
const RESPONSES = {
  greetings: [
    "I'm John Wick, Max's personal assistant. He's currently in training. How can I help?",
    "John Wick speaking. Max is unavailable right now. What do you need?",
    "Max's assistant here. He's busy with boxing prep. State your business."
  ],
  contact: [
    "Max accepts contacts only through:\n📞 +19898841911 (urgent calls)\n📸 @max_private (DMs)",
    "Direct access to Max:\n• Phone: +19898841911\n• Instagram: @max_private\nNo third-party contacts.",
    "For Max's eyes only:\nCall: +19898841911\nDM: @max_private\nExpect delayed responses."
  ],
  profession: [
    "Max is a pro boxer training 6 days/week. No interviews without appointment.",
    "Professional boxing is Max's focus. Contact for sponsorship: +19898841911",
    "Max's fight schedule is confidential. Media inquiries to @max_private"
  ],
  soccer: [
    "Max plays competitive soccer Tues/Thurs. No spectator requests.",
    "Soccer is Max's cross-training. Not accepting team offers currently.",
    "Football inquiries: Contact @max_private with 'SOCCER' in subject."
  ],
  personal: [
    "Max is 25, from India, USA-based. No personal questions answered.",
    "Personal info restricted. Professional inquiries only.",
    "Max's private life is private. Contact for business: +19898841911"
  ],
  default: [
    "Message logged. Max responds to:\n📞 +19898841911 (calls)\n📸 @max_private (verified DMs)",
    "Noted. Use official channels:\nPhone: +19898841911\nIG: @max_private",
    "This channel is for screening. Contact directly for responses."
  ]
};

app.post('/chat', (req, res) => {
  const msg = req.body.message.toLowerCase();
  let response;

  if (/hi|hello|hey|greetings/i.test(msg)) {
    response = RESPONSES.greetings[Math.floor(Math.random() * RESPONSES.greetings.length)];
  }
  else if (/contact|talk|reach|number|call|dm|whatsapp|instagram/i.test(msg)) {
    response = RESPONSES.contact[Math.floor(Math.random() * RESPONSES.contact.length)];
  }
  else if (/box|fight|profession|career|match/i.test(msg)) {
    response = RESPONSES.profession[Math.floor(Math.random() * RESPONSES.profession.length)];
  }
  else if (/soccer|football|play|game|team/i.test(msg)) {
    response = RESPONSES.soccer[Math.floor(Math.random() * RESPONSES.soccer.length)];
  }
  else if (/age|old|single|where|from|live|hometown/i.test(msg)) {
    response = RESPONSES.personal[Math.floor(Math.random() * RESPONSES.personal.length)];
  }
  else {
    response = RESPONSES.default[Math.floor(Math.random() * RESPONSES.default.length)];
  }

  res.json({ 
    response,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
