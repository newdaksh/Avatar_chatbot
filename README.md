# 🎭 Avatar Chatbot - Realistic 3D AI Conversation Assistant

A cutting-edge web application featuring a **realistic 3D animated avatar** with **real-time lip-sync**, powered by AI language models and advanced speech synthesis. Watch the avatar come to life as it speaks with perfectly synchronized facial animations!

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.180.0-000000?logo=three.js)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [How It Works](#-how-it-works)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

This project creates an immersive conversational AI experience with a photorealistic 3D human avatar that:
- **Speaks naturally** using browser's text-to-speech capabilities
- **Lip-syncs perfectly** to every word using phonetic analysis and morph target animation
- **Responds intelligently** via GROQ (fast cloud AI) or OpenAI integration
- **Animates realistically** with idle behaviors like blinking and breathing
- **Runs entirely in the browser** with no backend required (except for AI models)

Perfect for virtual assistants, educational tools, customer service bots, accessibility applications, and interactive storytelling.

---

## ✨ Features

### 🎨 Visual & Animation
- **3D Realistic Avatar**: High-quality 3D human head model with professional lighting
- **Real-time Lip Sync**: Advanced phonetic-based viseme engine for accurate mouth movements
- **Morph Target Animation**: Smooth facial animations using blend shapes
- **Idle Behaviors**: Natural blinking, subtle head movements, and breathing animations
- **Fallback 2D Mode**: Option to use simpler 2D avatar for lower-spec devices

### 🤖 AI & Conversation
- **GROQ Integration**: Fast cloud AI model support with high performance inference
- **OpenAI Support**: Optional integration with GPT models
- **Emotion Detection**: Responses include emotional context for appropriate facial expressions
- **Pattern Matching Fallback**: Works offline with pre-programmed responses

### 🎤 Speech & Audio
- **Web Speech API**: Native browser text-to-speech (no external APIs)
- **Voice Customization**: Adjustable speech rate and voice selection
- **Real-time Subtitles**: Synchronized captions while avatar speaks
- **Audio-driven Animation**: Mouth movements perfectly timed with speech

### 🛠️ Technical
- **React Architecture**: Modern component-based UI
- **Three.js Rendering**: High-performance 3D graphics
- **Vite Build System**: Lightning-fast development and optimized builds
- **MediaPipe Integration**: Advanced facial tracking capabilities (extensible)
- **Responsive Design**: Works on desktop and mobile devices

---

## 🚀 Tech Stack

### Core Framework & Libraries

#### **React (v18.2.0)**
- **Why**: Component-based architecture for maintainable UI code
- **Usage**: Manages application state, handles user interactions, and coordinates between chat, avatar, and speech systems
- **Key Features**: Hooks for state management, effect synchronization, and lifecycle handling

#### **Three.js (v0.180.0)**
- **Why**: Industry-standard WebGL library for 3D graphics
- **Usage**: Renders the 3D avatar head, manages scene/camera/lighting, and animates morph targets
- **Key Features**: 
  - GLTFLoader for 3D model loading
  - Morph target animation for facial expressions
  - Real-time rendering loop
  - Professional lighting setup (ambient + key light)

#### **Vite (v5.0.8)**
- **Why**: Next-generation frontend build tool - 10-100x faster than Webpack
- **Usage**: Development server with instant HMR, optimized production builds
- **Benefits**: 
  - Lightning-fast cold starts
  - Instant hot module replacement
  - Optimized bundle splitting
  - Native ES modules support

### Speech & Animation

#### **Web Speech API (speechSynthesis)**
- **Why**: Native browser API - no external dependencies or API costs
- **Usage**: Converts text to natural speech audio
- **Support**: Works in Chrome, Edge, Safari, and modern browsers
- **Features**: Multiple voices, adjustable rate/pitch/volume

#### **MediaPipe Face Mesh (v0.4)**
- **Why**: Google's state-of-the-art facial landmark detection
- **Usage**: Provides facial tracking infrastructure (extensible for future features)
- **Capabilities**: 468-point facial landmark detection

### Custom Engines

#### **Viseme Engine** (`src/utils/visemeEngine.js`)
- **Purpose**: Converts text to timed mouth shape animations
- **How**: Analyzes phonemes and creates timeline of visemes (visual phonemes)
- **Accuracy**: Maps 40+ phoneme patterns to 5 mouth shapes (closed, small, mid, open, wide)

#### **Phonetic Analyzer** (`src/utils/phoneticAnalyzer.js`)
- **Purpose**: Advanced text-to-phoneme conversion
- **How**: Uses linguistic rules to break words into individual speech sounds
- **Output**: Precise timing data for realistic lip-sync

#### **TTS Manager** (`src/utils/ttsManager.js`)
- **Purpose**: Wrapper for Web Speech API with enhanced control
- **Features**: 
  - Promise-based async speech
  - Automatic cancellation of previous speech
  - Duration estimation
  - Event handling for speech start/end

#### **LLM Stub** (`src/utils/llmStub.js`)
- **Purpose**: Unified interface for multiple AI backends
- **Supports**: 
  - **GROQ** (default): Fast cloud AI models via API
  - **OpenAI**: GPT-3.5/4 integration
  - **Fallback**: Pattern-matching for offline use
- **Returns**: Response text + detected emotion

---

## 🏗️ Architecture

### Application Flow

```
User Input → LLM Processing → Text Response → Speech Synthesis
                                    ↓
                              Phonetic Analysis
                                    ↓
                              Viseme Timeline
                                    ↓
                          3D Avatar Animation
                                    ↓
                         Synchronized Lip Sync
```

### Component Hierarchy

```
App.jsx (Main Controller)
├── ChatBox.jsx (User Interface)
│   ├── Message History
│   ├── Input Field
│   └── Configuration Controls
├── Avatar3D.jsx (3D Rendering)
│   ├── Three.js Scene
│   ├── GLTF Model Loader
│   ├── Morph Target Controller
│   └── Animation Loop
├── Subtitle.jsx (Caption Display)
└── ModelSetupGuide.jsx (Help Documentation)
```

### Data Flow

1. **User types message** → ChatBox captures input
2. **Message sent to LLM** → GROQ/OpenAI/Local processing
3. **Response generated** → Text + Emotion returned
4. **Phonetic analysis** → Text broken into phonemes with timing
5. **Viseme timeline created** → Mouth shapes mapped to timestamps
6. **Speech synthesis starts** → Browser TTS begins speaking
7. **Animation syncs** → Avatar morphs follow timeline
8. **Cleanup** → Reset state when speech ends

---

## 📦 Prerequisites

### Required Software

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Check: `node --version`

2. **npm** (comes with Node.js)
   - Check: `npm --version`

3. **Modern Web Browser**
   - Chrome 77+ (recommended)
   - Edge 79+
   - Safari 14.1+
   - Firefox 92+ (limited speech support)

### Optional (for AI features)

4. **GROQ API Key** (for fast cloud AI - recommended)
   - Sign up: https://console.groq.com/
   - Get API key from the dashboard
   - Fast inference with llama3, mixtral, and other models

5. **OpenAI API Key** (for GPT integration)
   - Sign up: https://platform.openai.com/
   - Add to code or environment variables

### 3D Model

6. **3D Avatar Model** (head.glb)
   - Place in: `public/models/head.glb`
   - See [Model Setup Guide](#3d-model-setup) below

---

## 🔧 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/newdaksh/Avatar_chatbot.git
cd Avatar_chatbot
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- React & React DOM (UI framework)
- Three.js (3D graphics)
- MediaPipe libraries (facial tracking)
- Vite & plugins (build tools)

### Step 3: Set Up 3D Model

You have three options:

#### Option A: Quick Setup with PowerShell Script (Windows)

```powershell
npm run setup-model
```

Follow the interactive menu to:
1. Create a custom avatar with ReadyPlayerMe (recommended)
2. Download a sample model for testing
3. Get detailed setup instructions

#### Option B: Manual Setup with ReadyPlayerMe (5 minutes)

1. Visit https://readyplayer.me/
2. Create a realistic human avatar (customize as desired)
3. Click "Download for Developers"
4. Select **GLB** format
5. Save as `public/models/head.glb`

**Important**: Ensure the model has:
- **Morph targets/blend shapes** for facial animation
- Properly named morphs: `mouthOpen`, `mouthSmile`, `eyeBlinkLeft`, `eyeBlinkRight`
- Head-only (full body not needed)

#### Option C: Use Other 3D Sources

See `public/models/README.md` for detailed guides on:
- Mixamo
- Sketchfab
- MakeHuman
- Custom Blender models

### Step 4: Set Up GROQ API (Optional but Recommended)

1. Visit https://console.groq.com/ and create an account
2. Get your API key from the dashboard
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Add your GROQ API key to the `.env` file:
   ```
   VITE_GROQ_API_KEY=your_actual_groq_api_key_here
   ```

---

## 🎮 Usage

### Development Mode

```bash
npm run dev
```

- Opens at http://localhost:5173
- Hot module replacement (instant updates)
- React DevTools enabled
- Console logging for debugging

### Build for Production

```bash
npm run build
```

- Creates optimized bundle in `dist/`
- Minified code
- Code splitting
- Asset optimization

### Preview Production Build

```bash
npm run preview
```

- Tests the production build locally
- Serves from `dist/`

---

## 📁 Project Structure

```
Avatar_chatbot/
├── public/                      # Static assets (served as-is)
│   └── models/
│       ├── head.glb            # 3D avatar model (you add this)
│       └── README.md           # Model setup guide
│
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── Avatar.jsx         # 2D avatar fallback
│   │   ├── Avatar3D.jsx       # 3D avatar renderer (main)
│   │   ├── ChatBox.jsx        # Chat interface & controls
│   │   ├── ModelSetupGuide.jsx # In-app help modal
│   │   └── Subtitle.jsx       # Speech captions
│   │
│   ├── utils/                 # Core logic modules
│   │   ├── llmStub.js        # AI integration (GROQ/OpenAI)
│   │   ├── phoneticAnalyzer.js # Text-to-phoneme conversion
│   │   ├── ttsManager.js     # Speech synthesis wrapper
│   │   └── visemeEngine.js   # Lip-sync timeline generator
│   │
│   ├── App.jsx               # Main application controller
│   ├── main.jsx              # React entry point
│   └── styles.css            # Global styles
│
├── index.html                # HTML entry point
├── package.json              # Dependencies & scripts
├── vite.config.js            # Vite configuration
├── setup-model.ps1           # Model setup helper (Windows)
├── VISUAL_GUIDE.md           # Visual documentation
└── README.md                 # This file
```

### Key Files Explained

- **`App.jsx`**: Orchestrates the entire application - manages state, coordinates components, handles message flow
- **`Avatar3D.jsx`**: The heart of the 3D rendering - loads model, controls morph targets, runs animation loop
- **`visemeEngine.js`**: Converts text to timed mouth shapes - critical for lip-sync accuracy
- **`llmStub.js`**: Abstracts AI backends - easy to switch between GROQ/OpenAI/local responses
- **`ttsManager.js`**: Manages speech synthesis - handles browser API quirks and timing

---

## ⚙️ Configuration

### In-App Settings

The chat interface provides these controls:

1. **Voice Rate**: Speech speed (0.5x to 2.0x)
2. **Words Per Minute**: Affects lip-sync timing (80-200 WPM)
3. **AI Backend**:
   - Use GROQ (fast cloud AI, requires API key in .env)
   - Use OpenAI (requires API key)
   - Use local responses (offline)
4. **Avatar Mode**:
   - 3D Realistic Avatar (requires head.glb)
   - 2D Avatar (fallback)

### Code Configuration

#### Enable OpenAI

In `src/utils/llmStub.js`:

```javascript
const OPENAI_API_KEY = 'your-api-key-here'; // Line 91
const OPENAI_MODEL = 'gpt-4'; // or 'gpt-3.5-turbo'
```

Then toggle "Use OpenAI" in the UI.

#### Customize GROQ Settings

In `src/utils/llmStub.js`:

```javascript
// Change the model in getGroqReply function:
model: "llama3-8b-8192", // or 'mixtral-8x7b-32768', 'gemma-7b-it', etc.
```

Available GROQ models:
- `llama3-8b-8192` (fast, 8K context)
- `llama3-70b-8192` (more capable, 8K context) 
- `mixtral-8x7b-32768` (32K context)
- `gemma-7b-it` (Google's model)

#### Adjust Animation Settings

In `src/components/Avatar3D.jsx`:

```javascript
// Line ~170-180 (approximate)
const SMOOTH_FACTOR = 0.15; // Lower = smoother but slower response
const ANIMATION_SCALE = 0.6; // Reduce exaggerated movements
```

#### Change Voice

In `src/App.jsx`, modify the `speakAndAnimate` function:

```javascript
await ttsManager.speak(reply.text, {
  rate: voiceRate,
  voiceName: 'Google US English', // Specify voice name
  pitch: 1.0,
  volume: 1.0
});
```

Get available voices:
```javascript
const voices = window.speechSynthesis.getVoices();
console.log(voices.map(v => v.name));
```

---

## 🔬 How It Works

### 1. Text-to-Speech Pipeline

```javascript
User Input → LLM → Response Text
                      ↓
              [TTS Manager]
                      ↓
        Web Speech API (speechSynthesis)
                      ↓
              Browser Speaks
```

- Uses browser's native speech engine
- No external API calls (privacy-friendly)
- Supports 50+ languages and voices

### 2. Lip-Sync Animation System

#### Phonetic Analysis
```javascript
"Hello world" → ["HH", "AH", "L", "OW", "W", "ER", "L", "D"]
```

#### Viseme Mapping
```javascript
Phonemes → Visual Mouth Shapes
"HH" → mid
"AH" → open
"L" → mid
"OW" → open
```

#### Timeline Generation
```javascript
[
  { time: 0,    viseme: "mid",   weight: 0.8 },
  { time: 150,  viseme: "open",  weight: 1.0 },
  { time: 300,  viseme: "mid",   weight: 0.7 },
  ...
]
```

#### Real-time Animation
```javascript
// Animation loop (60 FPS)
function animate() {
  const currentTime = Date.now() - startTime;
  const frame = timeline.find(f => f.time <= currentTime);
  
  // Apply morph targets
  mesh.morphTargetInfluences[mouthOpenIndex] = frame.weight;
  
  requestAnimationFrame(animate);
}
```

### 3. Morph Target System

3D models use **morph targets** (blend shapes) for facial animation:

```javascript
Neutral Face (base)
  + 50% mouthOpen
  + 30% mouthSmile
  + 100% eyeBlinkLeft
  ___________________
  = Animated Frame
```

Each morph target has a weight (0.0 to 1.0) that blends the shape.

### 4. AI Integration

#### GROQ Flow
```
User Message → HTTP POST to api.groq.com
                      ↓
              GROQ processes with fast inference
                      ↓
              Returns JSON response
                      ↓
              Extract message content
```

#### OpenAI Flow
```
User Message → HTTP POST to api.openai.com
                      ↓
              GPT model processes
                      ↓
              Returns JSON response
                      ↓
              Extract message content
```

### 5. State Management

React hooks manage complex state:

```javascript
// Speech state
const [isSpeaking, setIsSpeaking] = useState(false);
const [lastTimeline, setLastTimeline] = useState([]);

// Sync state to refs for animation loop access
const isSpeakingRef = useRef(isSpeaking);
useEffect(() => {
  isSpeakingRef.current = isSpeaking;
}, [isSpeaking]);
```

This solves the "stale closure" problem in animation loops.

---

## 🐛 Troubleshooting

### Model Issues

**Problem**: "Failed to load model" error

**Solutions**:
1. Verify `public/models/head.glb` exists
2. Check file is valid GLB format
3. Try opening in https://gltf-viewer.donmccurdy.com/
4. Run `npm run setup-model` for guided setup

**Problem**: Avatar loads but doesn't animate

**Solutions**:
1. Check browser console for morph target errors
2. Verify model has morph targets: `window.__listMorphs()`
3. Ensure morph names match: `mouthOpen`, `mouthSmile`, `eyeBlinkLeft`, `eyeBlinkRight`
4. Try a ReadyPlayerMe model (guaranteed compatibility)

### Speech Issues

**Problem**: No speech output

**Solutions**:
1. Check browser supports Web Speech API (Chrome/Edge/Safari)
2. Verify system volume is up
3. Try different voice in settings
4. Check browser console for errors
5. Test: `window.speechSynthesis.speak(new SpeechSynthesisUtterance("test"))`

**Problem**: Speech but no lip movement

**Solutions**:
1. Check `isSpeaking` state updates
2. Verify timeline is generated: `console.log(timeline)`
3. Ensure morph targets are being updated
4. Test manually: `window.__testMouthOpen(1.0)`

### AI Issues

**Problem**: Ollama not responding

**Solutions**:
1. Check Ollama is running: `ollama list`
2. Start Ollama service (Windows: run Ollama app)
3. Verify model is pulled: `ollama pull llama2`
4. Test API: `curl http://localhost:11434/api/generate -d '{"model":"llama2","prompt":"Hi"}'`
5. Check CORS (should work on localhost)

**Problem**: OpenAI errors

**Solutions**:
1. Verify API key is correct
2. Check internet connection
3. Confirm API key has credits
4. Review rate limits
5. Check console for specific error codes

### Performance Issues

**Problem**: Laggy animations

**Solutions**:
1. Reduce model polygon count
2. Lower morph target count
3. Adjust `SMOOTH_FACTOR` in Avatar3D.jsx
4. Use 2D avatar mode on low-spec devices
5. Close other browser tabs

**Problem**: High memory usage

**Solutions**:
1. Limit message history (clear old messages)
2. Stop speech before starting new
3. Dispose Three.js resources properly
4. Use production build (`npm run build`)

### Development Issues

**Problem**: Vite dev server won't start

**Solutions**:
1. Delete `node_modules` and reinstall: `npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check port 5173 isn't in use
4. Update Node.js to latest LTS

**Problem**: Hot reload not working

**Solutions**:
1. Check file is saved
2. Restart dev server
3. Clear browser cache
4. Disable browser extensions

---

## 🤝 Contributing

Contributions are welcome! Here's how:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update README if adding features
- Test on multiple browsers
- Keep commits atomic and descriptive

### Ideas for Contribution

- Additional language support for phonetic analysis
- More facial expressions/emotions
- Gesture animations (nodding, shaking head)
- Voice cloning integration
- Multiplayer/multi-avatar support
- AR/VR mode
- Accessibility improvements
- Performance optimizations

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Daksh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Three.js** - Amazing 3D graphics library
- **React** - UI framework excellence
- **Vite** - Blazing fast build tool
- **MediaPipe** - Google's facial tracking technology
- **Ollama** - Making local AI accessible
- **ReadyPlayerMe** - Easy 3D avatar creation
- **Web Speech API** - Browser-native TTS

---

## 📞 Support

- **Issues**: https://github.com/newdaksh/Avatar_chatbot/issues
- **Discussions**: https://github.com/newdaksh/Avatar_chatbot/discussions
- **Email**: daksh@example.com (update with your email)

---

## 🗺️ Roadmap

### Coming Soon
- [ ] Multiple avatar models selection
- [ ] Custom voice training
- [ ] Emotion wheel for manual expression control
- [ ] Save/load conversation history
- [ ] Export conversations as text/audio

### Future Plans
- [ ] Real-time video chat mode
- [ ] Lip-sync from audio files
- [ ] Full body animations
- [ ] VR headset support
- [ ] Mobile app (React Native)

---

## 📊 Project Stats

- **Languages**: JavaScript (90%), CSS (8%), HTML (2%)
- **Components**: 6 React components
- **Utilities**: 4 core engines
- **Dependencies**: 6 main libraries
- **Lines of Code**: ~2,500
- **Development Time**: 2 weeks
- **Browser Support**: Chrome 77+, Edge 79+, Safari 14.1+

---

## 🎯 Use Cases

- **Virtual Assistants**: Customer service, personal assistants
- **Education**: Interactive tutors, language learning
- **Healthcare**: Patient interaction, therapy bots
- **Entertainment**: Interactive storytelling, games
- **Accessibility**: Screen reader alternatives, communication aids
- **Marketing**: Brand ambassadors, product demos
- **Training**: Simulations, onboarding assistants

---

## 🔐 Privacy & Security

- **Local-First**: Ollama runs entirely on your machine
- **No Data Collection**: No analytics or tracking
- **Open Source**: Fully transparent code
- **Optional Cloud**: OpenAI integration is opt-in only
- **Browser Sandboxed**: All processing in browser security context

---

## 💡 Tips & Best Practices

### Performance
- Use production build for deployment
- Optimize 3D model (< 10MB, < 50k polygons)
- Limit morph targets to essential ones
- Cache responses for common queries

### Quality
- Use high-quality voice (test different browsers)
- Adjust WPM to match speech rate
- Fine-tune smooth factor for your model
- Add custom responses for your domain

### Development
- Use React DevTools for debugging state
- Enable verbose logging in dev mode
- Test on target browsers early
- Profile with Chrome DevTools

---

**Made with ❤️ by [Daksh](https://github.com/newdaksh)**

*Give this project a ⭐️ if you found it helpful!*
