import { useState, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import Avatar from "./components/Avatar";
import Subtitle from "./components/Subtitle";
import * as ttsManager from "./utils/ttsManager";
import * as visemeEngine from "./utils/visemeEngine";
import * as llmStub from "./utils/llmStub";

function App() {
  // State management
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastTimeline, setLastTimeline] = useState([]);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [subtitleDuration, setSubtitleDuration] = useState(0);

  // Configuration state
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [wordsPerMinute, setWordsPerMinute] = useState(160);
  const [useOpenAI, setUseOpenAI] = useState(false);

  // Check for speechSynthesis support
  const [ttsSupported, setTtsSupported] = useState(true);

  useEffect(() => {
    if (!window.speechSynthesis) {
      setTtsSupported(false);
      console.warn("Web Speech API not supported in this browser");
    }
  }, []);

  /**
   * Handle sending a message
   * @param {string} text - User's input text
   */
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message to chat
    const userMessage = { from: "user", text, emotion: "neutral" };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Get bot reply
    const botReply = await llmStub.getReply(text, useOpenAI);
    const botMessage = {
      from: "bot",
      text: botReply.text,
      emotion: botReply.emotion,
    };
    setMessages((prev) => [...prev, botMessage]);

    // Trigger speech and animation
    await speakAndAnimate(botReply);
  };

  /**
   * Speak text and animate avatar
   * @param {Object} reply - Reply object with text and emotion
   */
  const speakAndAnimate = async (reply) => {
    if (!ttsSupported) {
      alert(
        "Text-to-speech is not supported in your browser. Please try Chrome, Edge, or Safari."
      );
      return;
    }

    setIsSpeaking(true);
    setCurrentEmotion(reply.emotion);
    setCurrentSubtitle(reply.text);

    try {
      // Start speech synthesis
      const speechResult = await ttsManager.speak(reply.text, {
        rate: voiceRate,
        voiceName: null, // Use default voice
      });

      // Build viseme timeline based on actual or estimated duration
      const audioDurationMs = speechResult.audioDuration * 1000;
      const timeline = visemeEngine.buildTimeline(
        reply.text,
        audioDurationMs,
        wordsPerMinute
      );

      setLastTimeline(timeline);
      setSubtitleDuration(audioDurationMs);
    } catch (error) {
      console.error("Speech error:", error);
      alert("Speech synthesis failed. Please try again.");
    } finally {
      // Cleanup after speech ends
      setTimeout(() => {
        setIsSpeaking(false);
        setCurrentSubtitle("");
      }, 500);
    }
  };

  /**
   * Replay the last bot message
   * @param {Object} message - Message to replay
   */
  const handleReplayMessage = async (message) => {
    if (isSpeaking) {
      ttsManager.stop();
    }
    await speakAndAnimate(message);
  };

  /**
   * Handle animation end from Avatar component
   */
  const handleAnimationEnd = () => {
    setIsSpeaking(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎭 Comic Avatar Chatbot</h1>
        <p>Chat with an animated avatar powered by Web Speech API</p>
      </header>

      <div className="main-content">
        {/* Left Column: Chat Interface */}
        <div className="chat-column">
          <ChatBox
            messages={messages}
            inputText={inputText}
            onInputChange={setInputText}
            onSend={handleSendMessage}
            onReplay={handleReplayMessage}
            isSpeaking={isSpeaking}
          />

          {/* Configuration Controls */}
          <div className="controls-panel">
            <h3>Settings</h3>

            <div className="control-group">
              <label htmlFor="voice-rate">
                Speech Rate: {voiceRate.toFixed(1)}x
              </label>
              <input
                id="voice-rate"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={voiceRate}
                onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label htmlFor="wpm">Words Per Minute: {wordsPerMinute}</label>
              <input
                id="wpm"
                type="range"
                min="100"
                max="250"
                step="10"
                value={wordsPerMinute}
                onChange={(e) => setWordsPerMinute(parseInt(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={useOpenAI}
                  onChange={(e) => setUseOpenAI(e.target.checked)}
                />
                Use OpenAI (requires API key in llmStub.js)
              </label>
            </div>

            {!ttsSupported && (
              <div className="warning-box">
                ⚠️ Text-to-speech is not supported in your browser.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Avatar and Subtitles */}
        <div className="avatar-column">
          <div className="avatar-container">
            <Avatar
              timeline={lastTimeline}
              isSpeaking={isSpeaking}
              emotion={currentEmotion}
              onAnimationEnd={handleAnimationEnd}
            />
          </div>

          <div className="subtitle-container">
            <Subtitle
              text={currentSubtitle}
              duration={subtitleDuration}
              isActive={isSpeaking}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
