// src/components/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Bot configuration
const BOT_NAME = "ChatBot";
const BOT_DELAY = 1000; // 1 second delay

const botResponses = {
  greetings: {
    patterns: ["hi", "hello", "hey", "howdy"],
    responses: [
      "Hi there! How can I help you today?",
      "Hello! Nice to meet you!",
      "Hey! How are you doing?",
      "Welcome! How can I assist you?",
    ],
  },
  general: [
    "That's interesting! Tell me more.",
    "I understand. Please continue.",
    "Thanks for sharing!",
    "How can I help you further?",
    "I'm here to assist you!",
  ],
};

function Chat({ user, setUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Get bot response based on message content
  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    // Check for greetings
    if (
      botResponses.greetings.patterns.some((pattern) =>
        lowerMessage.includes(pattern)
      )
    ) {
      const responses = botResponses.greetings.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Return general response
    return botResponses.general[
      Math.floor(Math.random() * botResponses.general.length)
    ];
  };

  // Create a bot message
  const createBotMessage = (text) => ({
    id: Date.now().toString(),
    text,
    user: BOT_NAME,
    timestamp: new Date().toLocaleTimeString(),
  });

  // Handle sending messages
  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        text: newMessage,
        user: user.username,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");

      // Add bot response after delay
      setTimeout(() => {
        const botResponse = createBotMessage(getBotResponse(newMessage));
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      }, BOT_DELAY);
    }
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room</h2>
        <div className="user-info">
          <span>Welcome, {user.username}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.user === user.username ? "sent" : "received"
            }`}
          >
            <div className="message-content">
              <span className="message-user">{message.user}</span>
              <p>{message.text}</p>
              <span className="message-time">{message.timestamp}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="message-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
