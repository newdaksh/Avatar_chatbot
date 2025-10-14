# 🎭 Comic Avatar Chatbot

A lightweight React + Vite single-page application that implements a **realistic comic-style live avatar chatbot** with **human-like phonetic lip synchronization**, blinking eyes, and dynamic expressions. Everything runs entirely in the browser using the Web Speech API.

![Avatar Chatbot Demo](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)
![Web Speech API](https://img.shields.io/badge/Web%20Speech%20API-Enabled-green)
![Lip Sync](https://img.shields.io/badge/Lip%20Sync-Human--Like-FF69B4)

## 🌟 Key Highlights

### **Human-Like Phonetic Lip Sync**

- **100+ Word Phoneme Dictionary** for accurate pronunciation
- **8 Distinct Visemes** (mouth shapes) for natural speech
- **Realistic Timing** - Vowels 2x longer than consonants
- **Smooth Coarticulation** - 25ms transition frames between shapes
- **60fps Animation** - Silky smooth mouth movements

### **Realistic Avatar Design**

- Blonde hair with highlights and shading
- Blue eyes with detailed iris, pupil, and reflections
- Casual hoodie with collar details
- Natural facial proportions and expressions

## ✨ Features

- 🎨 **Animated SVG Avatar** - Realistic comic-style character with 380px resolution
- 👄 **Advanced Lip-Sync** - 8 viseme types: closed, f_v, small, ch_sh, r, mid, o, open, wide
- 🧠 **Phonetic Analysis** - Dictionary-based word-to-phoneme conversion
- 👁️ **Natural Blinking** - Randomized eye blinks (2-5 second intervals)
- 😊 **Emotion-Based Expressions** - Eyebrow movements (friendly/neutral/surprised)
- 🔊 **Text-to-Speech** - Web Speech API with fallback duration estimation
- 📝 **Synchronized Subtitles** - Typewriter effect in perfect sync
- 🎮 **Interactive Controls** - Adjust speech rate and words-per-minute
- 🔄 **Replay Messages** - Click any bot message to re-experience
- 🤖 **Dual Response Modes** - Local pattern-matching or OpenAI integration
- 📱 **Fully Responsive** - Desktop, tablet, and mobile optimized

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or download this project**

```bash
cd Avatar_chatbot
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. **Open in browser**

Navigate to `http://localhost:5173` (or the URL shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎮 How to Use

1. **Start Chatting**: Type a message in the input box and press Send (📤) or hit Enter
2. **Watch the Avatar**: The avatar will speak your message and animate its mouth in sync
3. **Replay Messages**: Click the 🔄 button on any bot message to replay the animation
4. **Adjust Settings**:
   - **Speech Rate**: Control how fast the avatar speaks (0.5x - 2.0x)
   - **Words Per Minute**: Adjust the lip-sync timing (100-250 WPM)
5. **Try Different Messages**: Ask questions, greet the avatar, or have a conversation!

## 🧪 Testing Examples

Try these messages to see different features:

- **Greeting**: `Hello there! How are you?`

  - _Expected: Friendly response with animated mouth and blinking_

- **Technical Question**: `How does the animation work?`

  - _Expected: Explanation with synchronized lip movements_

- **Short Sentence**: `Hi!`

  - _Expected: Quick response with brief animation_

- **Long Paragraph**: `Tell me a long story about technology and animation`

  - _Expected: Extended animation showing timing adjustments_

- **Replay**: Click the 🔄 button on any previous bot message
  - _Expected: Animation replays from the beginning_

## 🔧 Configuration

### Speech Settings

Adjust these in the app's Settings panel:

- **Speech Rate**: 0.5x to 2.0x (default: 1.0x)

  - Lower = slower, more dramatic
  - Higher = faster, more energetic

- **Words Per Minute**: 100-250 (default: 160)
  - Affects lip-sync timing estimation
  - Higher WPM = faster mouth movements

### Optional: OpenAI Integration

By default, the chatbot uses local pattern-matching responses. To enable OpenAI:

1. **Get an API Key**:

   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an account and generate an API key

2. **Add Your Key**:

   - Open `src/utils/llmStub.js`
   - Find line ~98: `const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE'`
   - Replace `'YOUR_OPENAI_API_KEY_HERE'` with your actual API key

3. **Enable in App**:
   - Check the "Use OpenAI" checkbox in Settings

⚠️ **Security Warning**: Never commit API keys to public repositories. For production, use a backend proxy server to make API calls securely. This frontend implementation is for development/demo purposes only.

## 🏗️ Project Structure

```
Avatar_chatbot/
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── README.md               # This file
└── src/
    ├── main.jsx            # App entry point
    ├── App.jsx             # Main app component
    ├── styles.css          # Global styles
    ├── components/
    │   ├── ChatBox.jsx     # Chat interface and message history
    │   ├── Avatar.jsx      # SVG avatar with animations
    │   └── Subtitle.jsx    # Synchronized subtitle display
    └── utils/
        ├── ttsManager.js   # Web Speech API wrapper
        ├── visemeEngine.js # Lip-sync timeline generator
        └── llmStub.js      # Response generator (local + OpenAI)
```

## 🔬 How It Works

### Lip-Sync Heuristic

The app uses a **simple but effective heuristic** for lip-sync:

1. **Phoneme Mapping**: Characters are mapped to 4 viseme types:

   - `closed`: p, b, m (lips closed)
   - `small`: t, d, s, z (small opening)
   - `mid`: k, g, n, r, l (medium opening)
   - `open`: vowels a, e, i, o, u (wide opening)

2. **Timeline Generation**:

   - Text is tokenized into sound units
   - Audio duration is estimated or measured
   - Each token gets a time window and viseme assignment
   - Timeline: `[{startMs, endMs, viseme}, ...]`

3. **Animation Loop**:
   - Uses `requestAnimationFrame` for smooth 60fps animation
   - `performance.now()` provides precise timing
   - Current viseme is determined by elapsed time vs timeline

### Animation Features

- **Mouth Shapes**: 5 SVG paths with opacity toggling
- **Blinking**: Random intervals (2-5 seconds) with 150ms blink duration
- **Eyebrows**: Rotate based on emotion state
- **Smooth Transitions**: CSS transitions for natural movement

### Browser Compatibility

| Feature          | Chrome | Edge | Firefox | Safari |
| ---------------- | ------ | ---- | ------- | ------ |
| Speech Synthesis | ✅     | ✅   | ✅      | ✅     |
| Viseme Animation | ✅     | ✅   | ✅      | ✅     |
| Boundary Events  | ⚠️     | ⚠️   | ❌      | ❌     |

⚠️ Boundary events (for precise word timing) are not supported in all browsers. The app falls back to estimation when unavailable.

## 🎨 Customization

### Adjusting the Avatar Appearance

Edit `src/components/Avatar.jsx`:

- **Colors**: Change `fill` attributes in SVG elements
- **Size**: Modify `viewBox` dimensions
- **Facial Features**: Adjust ellipse radii, path curves
- **Add Accessories**: Add new SVG groups (glasses, hat, etc.)

### Adding New Visemes

Edit `src/utils/visemeEngine.js`:

1. Add new viseme type to `VISEME_MAP`
2. Add corresponding mouth shape in `Avatar.jsx` `renderMouth()`
3. Update mapping logic in `mapTokenToViseme()`

### Tuning Response Patterns

Edit `src/utils/llmStub.js`:

- Add new regex patterns in `getLocalReply()`
- Customize response text and emotions
- Adjust emotion inference in `inferEmotion()`

## 🐛 Troubleshooting

### "Text-to-speech is not supported"

- **Solution**: Use a modern browser (Chrome, Edge, Firefox, Safari)
- **Note**: Some privacy-focused browsers may disable speech APIs

### Avatar mouth not syncing properly

- **Solution**: Adjust "Words Per Minute" slider in Settings
- **Try**: Lower WPM for slower speech, higher for faster

### Speech not playing

- **Check**: Browser didn't block autoplay (some require user interaction first)
- **Try**: Refresh page and try again after clicking anywhere

### OpenAI not working

- **Verify**: API key is correctly set in `llmStub.js`
- **Check**: Console for error messages
- **Note**: May require CORS proxy for some deployments

## 📚 Technology Stack

- **React 18.2** - UI framework
- **Vite 5.0** - Build tool and dev server
- **Web Speech API** - Text-to-speech synthesis
- **SVG** - Vector graphics for avatar
- **Vanilla CSS** - Styling with gradients and animations
- **requestAnimationFrame** - Smooth animation loop
- **performance.now()** - High-precision timing

## 🎯 Future Enhancements

Ideas for extending this project:

- [ ] Voice selection dropdown (list available TTS voices)
- [ ] Head tilt animation on sentence boundaries
- [ ] "Thinking" animation while generating response
- [ ] More sophisticated phoneme analysis
- [ ] Record and export avatar videos
- [ ] Multiple avatar characters to choose from
- [ ] Gesture animations (nodding, shaking head)
- [ ] Background music and sound effects
- [ ] Chat history persistence (localStorage)
- [ ] Multi-language support

## 📄 License

This project is open source and available for educational and demonstration purposes.

## 🙏 Acknowledgments

- Web Speech API for browser-based TTS
- React and Vite teams for excellent developer tools
- SVG specifications for flexible vector graphics

## 💡 Tips for Developers

### Understanding the Code

- Start with `App.jsx` to see overall structure
- Read comments in each file - they explain the "why" not just "what"
- `ttsManager.js` shows TTS API usage with fallbacks
- `visemeEngine.js` demonstrates the heuristic algorithm
- `Avatar.jsx` shows animation loop patterns

### Extending the Project

1. **Better Phoneme Analysis**: Use a phoneme library for more accurate mapping
2. **Real-time Voice Input**: Add speech recognition for voice conversations
3. **Backend Integration**: Create Express/Flask API for secure LLM calls
4. **WebSocket Streaming**: Stream responses word-by-word for faster UX
5. **3D Avatar**: Migrate to Three.js or Babylon.js for 3D character

## 📞 Support

If you encounter issues:

1. Check browser console for error messages
2. Verify all dependencies installed (`npm install`)
3. Try different browser (Chrome recommended)
4. Clear cache and restart dev server

---

**Enjoy chatting with your animated avatar!** 🎭✨
