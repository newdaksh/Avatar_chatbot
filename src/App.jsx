import { useState, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import Avatar from "./components/Avatar";
import Avatar3D from "./components/Avatar3D";
import Subtitle from "./components/Subtitle";
import ModelSetupGuide from "./components/ModelSetupGuide";
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
  const [useGroq, setUseGroq] = useState(true); // Use GROQ by default
  const [use3DAvatar, setUse3DAvatar] = useState(true); // Toggle between 2D and 3D avatar
  const [showSetupGuide, setShowSetupGuide] = useState(false);

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

    // Debug: Log the current settings
    console.log("🔍 Debug - useOpenAI:", useOpenAI, "useGroq:", useGroq);

    // Get bot reply
    const botReply = await llmStub.getReply(text, useOpenAI, useGroq);
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

    // First, estimate the duration and build timeline BEFORE starting speech
    const estimatedDurationMs = (reply.text.split(' ').length / wordsPerMinute) * 60 * 1000;
    const timeline = visemeEngine.buildTimeline(
      reply.text,
      estimatedDurationMs,
      wordsPerMinute
    );

    console.log('📊 Timeline created (pre-speech):', {
      text: reply.text,
      estimatedDuration: estimatedDurationMs,
      frames: timeline.length,
      firstFrames: timeline.slice(0, 3)
    });

    // Set timeline FIRST, then set isSpeaking
    setLastTimeline(timeline);
    setSubtitleDuration(estimatedDurationMs);
    setCurrentEmotion(reply.emotion);
    setCurrentSubtitle(reply.text);
    
    // Small delay to ensure state is updated before animation starts
    await new Promise(resolve => setTimeout(resolve, 50));
    
    setIsSpeaking(true);

    try {
      // Start speech synthesis (this happens AFTER timeline is set)
      const speechResult = await ttsManager.speak(reply.text, {
        rate: voiceRate,
        voiceName: null, // Use default voice
      });

      console.log('🎵 Speech completed. Actual duration:', speechResult.audioDuration);
    } catch (error) {
      console.error("❌ Speech error:", error);
      // Don't show alert for common errors, just log them
      if (error.message && !error.message.includes('interrupted')) {
        console.warn('⚠️ Non-critical speech error, continuing...');
      }
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
                  checked={useGroq}
                  onChange={(e) => {
                    setUseGroq(e.target.checked);
                    // Disable OpenAI when enabling GROQ
                    if (e.target.checked) setUseOpenAI(false);
                  }}
                />
                Use GROQ (fast cloud LLM - requires API key in .env) 
                {useGroq ? " ✅" : " ❌"}
              </label>
              <div style={{fontSize: "12px", color: "#666", marginTop: "5px"}}>
                API Key: {import.meta.env.VITE_GROQ_API_KEY ? "✅ Found" : "❌ Missing"}
              </div>
            </div>

            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={useOpenAI}
                  onChange={(e) => {
                    setUseOpenAI(e.target.checked);
                    // Disable GROQ when enabling OpenAI
                    if (e.target.checked) setUseGroq(false);
                  }}
                />
                Use OpenAI (requires API key in llmStub.js)
              </label>
            </div>

            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={use3DAvatar}
                  onChange={(e) => setUse3DAvatar(e.target.checked)}
                />
                Use 3D Realistic Avatar (MediaPipe + Three.js)
              </label>
            </div>

            {use3DAvatar && (
              <div className="info-box" style={{ marginTop: '10px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.9em' }}>
                  📦 Need to setup a 3D model?
                </p>
                <button
                  onClick={() => setShowSetupGuide(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9em'
                  }}
                >
                  Open Setup Guide
                </button>
              </div>
            )}

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
            {use3DAvatar ? (
              <Avatar3D
                timeline={lastTimeline}
                isSpeaking={isSpeaking}
                onModelLoaded={(morphs) => console.log('3D Avatar ready with morphs:', morphs)}
              />
            ) : (
              <Avatar
                timeline={lastTimeline}
                isSpeaking={isSpeaking}
                emotion={currentEmotion}
                onAnimationEnd={handleAnimationEnd}
              />
            )}
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

      {/* Model Setup Guide Modal */}
      {showSetupGuide && (
        <ModelSetupGuide onClose={() => setShowSetupGuide(false)} />
      )}
    </div>
  );
}

export default App;
