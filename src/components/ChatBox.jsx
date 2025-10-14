import { useState, useRef, useEffect } from "react";

/**
 * ChatBox Component
 * Handles user input, displays message history, and allows replaying bot messages
 */
function ChatBox({
  messages,
  inputText,
  onInputChange,
  onSend,
  onReplay,
  isSpeaking,
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isSpeaking) {
      onSend(inputText);
    }
  };

  /**
   * Handle Enter key press (without shift for send)
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chatbox-container">
      {/* Message History */}
      <div className="messages-list">
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>👋 Welcome! Ask me anything to see the avatar come to life.</p>
            <p className="hint">Try: "Hello! How are you today?"</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.from === "user" ? "user-message" : "bot-message"
            }`}
          >
            <div className="message-bubble">
              <div className="message-text">{msg.text}</div>

              {/* Replay button for bot messages */}
              {msg.from === "bot" && (
                <button
                  className="replay-button"
                  onClick={() => onReplay(msg)}
                  disabled={isSpeaking}
                  title="Replay this message"
                  aria-label="Replay message"
                >
                  🔄
                </button>
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="message-input"
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSpeaking}
          aria-label="Message input"
        />
        <button
          type="submit"
          className="send-button"
          disabled={!inputText.trim() || isSpeaking}
          aria-label="Send message"
        >
          {isSpeaking ? "🔊" : "📤"}
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
