/**
 * LLM Stub
 * Provides chatbot responses using Ollama, local logic, or optional OpenAI integration
 * Default: Ollama API (http://localhost:11434/api/generate)
 * Fallback: Simple pattern-matching and canned responses
 * Optional: OpenAI ChatCompletion API
 */

/**
 * Get a reply to user input
 * @param {string} userText - User's message
 * @param {boolean} useOpenAI - Whether to use OpenAI API (requires API key)
 * @param {boolean} useOllama - Whether to use Ollama API (default: true)
 * @returns {Promise<{text: string, emotion: string}>} - Reply with text and emotion
 */
export async function getReply(userText, useOpenAI = false, useOllama = true) {
  if (useOpenAI) {
    return await getOpenAIReply(userText);
  } else if (useOllama) {
    return await getOllamaReply(userText);
  } else {
    return getLocalReply(userText);
  }
}

/**
 * Local reply generator using pattern matching
 * @param {string} userText - User's message
 * @returns {Promise<{text: string, emotion: string}>} - Reply object
 */
async function getLocalReply(userText) {
  const input = userText.toLowerCase().trim();

  // Greeting patterns
  if (
    /^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/.test(
      input
    )
  ) {
    return {
      text: "Hello there! I'm so happy to chat with you today! How can I help you?",
      emotion: "friendly",
    };
  }

  // How are you patterns
  if (/how are you|how're you|how do you do/.test(input)) {
    return {
      text: "I'm doing wonderfully, thank you for asking! I'm an animated avatar, so I'm always ready to chat and help out. What can I do for you?",
      emotion: "friendly",
    };
  }

  // What can you do
  if (/what can you do|what do you do|your purpose|help me/.test(input)) {
    return {
      text: "I'm a demonstration of live avatar animation with lip-sync! I can chat with you and animate my mouth, eyes, and expressions in real-time. Ask me anything!",
      emotion: "friendly",
    };
  }

  // Name patterns
  if (/what is your name|who are you|your name/.test(input)) {
    return {
      text: "I'm Comic Avatar, a friendly chatbot with animated expressions! I use the Web Speech API to talk and synchronize my lip movements. Nice to meet you!",
      emotion: "friendly",
    };
  }

  // Thank you patterns
  if (/thank you|thanks|thx|appreciate/.test(input)) {
    return {
      text: "You're very welcome! I'm always here if you need anything else. Feel free to ask me more questions!",
      emotion: "friendly",
    };
  }

  // Goodbye patterns
  if (/^(bye|goodbye|see you|farewell|exit|quit)/.test(input)) {
    return {
      text: "Goodbye! It was wonderful chatting with you. Come back anytime!",
      emotion: "friendly",
    };
  }

  // Question about avatar
  if (/avatar|animation|mouth|lips|eyes|blink/.test(input)) {
    return {
      text: "Great question! My animation uses a heuristic viseme engine that maps speech sounds to mouth shapes. I also blink naturally and change my eyebrows based on emotion. Pretty cool, right?",
      emotion: "friendly",
    };
  }

  // Technical questions
  if (/how does|how do|explain|tell me about/.test(input)) {
    return {
      text: "I'd love to explain! This system uses React and the Web Speech API. It estimates speech timing and creates a timeline of mouth shapes that sync with the audio. It's all done in your browser!",
      emotion: "friendly",
    };
  }

  // Joke request
  if (/joke|funny|laugh|humor/.test(input)) {
    return {
      text: "Why did the JavaScript developer go broke? Because they used up all their cache! Haha, I hope that made you smile!",
      emotion: "friendly",
    };
  }

  // Surprise/exclamation patterns
  if (/wow|amazing|incredible|awesome|cool/.test(input)) {
    return {
      text: "I know, right?! Technology is amazing! I'm excited to be here demonstrating real-time avatar animation!",
      emotion: "surprised",
    };
  }

  // Default response - echo with elaboration
  return {
    text: `You asked: "${userText}". That's an interesting question! While I'm a simple demo chatbot, I can tell you that I'm here to demonstrate lip-sync animation. My mouth movements are synchronized to my speech using a viseme timeline. Pretty neat, isn't it?`,
    emotion: "neutral",
  };
}

/**
 * Ollama API integration (default)
 * Connects to local Ollama instance for LLM responses
 * 
 * INSTRUCTIONS:
 * 1. Make sure Ollama is installed and running (https://ollama.ai)
 * 2. Pull a model: `ollama pull llama2` (or any model you prefer)
 * 3. The service should be running at http://localhost:11434
 * 
 * @param {string} userText - User's message
 * @returns {Promise<{text: string, emotion: string}>} - Reply object
 */
async function getOllamaReply(userText) {
  const OLLAMA_API_URL = "http://localhost:11434/api/generate";
  
  try {
    console.log("🤖 Calling Ollama API...");
    
    const response = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-oss:120b-cloud", // Change this to your preferred model
        prompt: `You are a friendly, helpful chatbot avatar. Keep responses concise (2-3 sentences) and engaging. Be enthusiastic and warm.

User: ${userText}
Assistant:`,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.warn(`Ollama API error: ${response.status}. Falling back to local replies.`);
      return getLocalReply(userText);
    }

    const data = await response.json();
    const replyText = data.response.trim();

    console.log("✅ Ollama response received:", replyText);

    // Infer emotion from reply content
    const emotion = inferEmotion(replyText);

    return {
      text: replyText,
      emotion: emotion,
    };
  } catch (error) {
    console.error("Ollama API call failed:", error);
    console.log("💡 Make sure Ollama is running: ollama serve");
    // Fallback to local reply on error
    return getLocalReply(userText);
  }
}

/**
 * OpenAI API integration (optional)
 * IMPORTANT: To use this, you need to add your OpenAI API key
 *
 * INSTRUCTIONS:
 * 1. Get an API key from https://platform.openai.com/api-keys
 * 2. Replace 'YOUR_OPENAI_API_KEY_HERE' below with your actual key
 * 3. Enable "Use OpenAI" checkbox in the app
 *
 * SECURITY NOTE:
 * For production, NEVER expose API keys in frontend code.
 * Use a backend proxy server to make API calls securely.
 * This is for demonstration/development only.
 */
async function getOpenAIReply(userText) {
  // ⚠️ REPLACE THIS WITH YOUR ACTUAL API KEY ⚠️
  const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE";

  // Check if API key is set
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE") {
    console.warn(
      "OpenAI API key not configured. Falling back to local replies."
    );
    return getLocalReply(userText);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a friendly, helpful chatbot avatar. Keep responses concise (2-3 sentences) and engaging. Be enthusiastic and warm.",
          },
          {
            role: "user",
            content: userText,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.choices[0].message.content.trim();

    // Infer emotion from reply content
    const emotion = inferEmotion(replyText);

    return {
      text: replyText,
      emotion: emotion,
    };
  } catch (error) {
    console.error("OpenAI API call failed:", error);
    // Fallback to local reply on error
    return getLocalReply(userText);
  }
}

/**
 * Infer emotion from text content
 * Simple heuristic based on keywords and punctuation
 * @param {string} text - Text to analyze
 * @returns {string} - Emotion tag: 'friendly', 'neutral', or 'surprised'
 */
function inferEmotion(text) {
  const lower = text.toLowerCase();

  // Check for excitement/surprise indicators
  if (
    /!+/.test(text) ||
    /wow|amazing|incredible|exciting|awesome/.test(lower)
  ) {
    return "surprised";
  }

  // Check for friendly indicators
  if (/:\)|😊|happy|glad|love|great|wonderful|nice/.test(lower)) {
    return "friendly";
  }

  // Default neutral
  return "neutral";
}
