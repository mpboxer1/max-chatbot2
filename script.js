
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const chatArea = document.getElementById('chat-area');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const musicControl = document.getElementById('music-control');
  const themeSong = document.getElementById('theme-song');
  
  // Auto-resize textarea
  userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = `${this.scrollHeight}px`;
  });

  // Send message function
  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message with timestamp
    addMessage('user', message);
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Show typing indicator
    const typingIndicator = addTypingIndicator();
    
    try {
      // Get bot response
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      removeTypingIndicator(typingIndicator);
      addMessage('bot', data.response);
      
    } catch (error) {
      removeTypingIndicator(typingIndicator);
      addMessage('bot', "I'm having trouble connecting to Max...");
      console.error('Error:', error);
    }
  }

  // Add message to chat
  function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-msg`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageDiv.innerHTML = `
      <span class="message-time">${time}</span>
      <span class="message-content">${text}</span>
    `;
    
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  // Add typing indicator
  function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatArea.appendChild(typingDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    return typingDiv;
  }

  // Remove typing indicator
  function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }

  // Music control
  musicControl.addEventListener('click', () => {
    if (themeSong.paused) {
      themeSong.play()
        .then(() => {
          musicControl.innerHTML = '<span id="pause-icon">❚❚</span><span>Pause Theme</span>';
        })
        .catch(error => {
          console.error('Audio playback failed:', error);
        });
    } else {
      themeSong.pause();
      musicControl.innerHTML = '<span id="play-icon">▶</span><span>Play Theme</span>';
    }
  });

  // Send message on Enter (but allow Shift+Enter for new lines)
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Send button click
  sendButton.addEventListener('click', sendMessage);

  // Focus input field when page loads
  userInput.focus();
});
