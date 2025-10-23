# Ollama Integration Guide

This chatbot now supports **Ollama** for intelligent responses using local LLMs!

## 🚀 Quick Start

### 1. Install Ollama

Download and install Ollama from: **https://ollama.ai**

- **Windows**: Download the installer
- **macOS**: `brew install ollama` or download from website
- **Linux**: `curl -fsSL https://ollama.ai/install.sh | sh`

### 2. Start Ollama Service

Open a terminal and run:

```bash
ollama serve
```

This starts the Ollama API server at `http://localhost:11434`

### 3. Pull a Model

In another terminal, pull a model (recommended: llama2):

```bash
ollama pull llama2
```

**Other recommended models:**
- `ollama pull llama2` - General purpose (7B parameters)
- `ollama pull mistral` - Fast and efficient (7B)
- `ollama pull codellama` - Code-focused
- `ollama pull llama3` - Latest Llama model (if available)
- `ollama pull phi` - Small and fast (2.7B)

### 4. Use in the Chatbot

1. Make sure Ollama is running (`ollama serve`)
2. Open the chatbot in your browser
3. **Check the "Use Ollama" checkbox** in the Settings panel
4. Start chatting!

## 🔧 Configuration

### Change the Model

Edit `src/utils/llmStub.js` and modify the model name:

```javascript
body: JSON.stringify({
  model: "mistral", // Change this to your preferred model
  prompt: `...`,
  stream: false,
}),
```

### Available Models

List all downloaded models:
```bash
ollama list
```

### Model Performance

- **llama2** (7B): Best balance of quality and speed
- **mistral** (7B): Faster, great quality
- **phi** (2.7B): Very fast, good for quick responses
- **codellama** (7B): Best for technical/coding questions

## 🎯 How It Works

1. When you send a message, the chatbot checks the "Use Ollama" setting
2. If enabled, it sends your message to `http://localhost:11434/api/generate`
3. Ollama processes the message using the selected model
4. The response is received and spoken by the avatar
5. If Ollama fails, it automatically falls back to local pattern-matching responses

## 🔀 Response Options

The chatbot supports three modes:

1. **Ollama** (default, checked): Uses local LLM via Ollama
2. **OpenAI**: Uses OpenAI API (requires API key)
3. **Local**: Simple pattern-matching responses

Only one mode can be active at a time.

## 📝 Customization

### Adjust Response Length

Edit the prompt in `src/utils/llmStub.js`:

```javascript
prompt: `You are a friendly, helpful chatbot avatar. Keep responses very brief (1 sentence max) and engaging.

User: ${userText}
Assistant:`,
```

### Adjust Temperature/Creativity

Add parameters to the request:

```javascript
body: JSON.stringify({
  model: "llama2",
  prompt: `...`,
  stream: false,
  options: {
    temperature: 0.7,  // 0.0 = deterministic, 1.0 = creative
    top_p: 0.9,
    top_k: 40,
  }
}),
```

## 🐛 Troubleshooting

### "Ollama API call failed"

**Check if Ollama is running:**
```bash
curl http://localhost:11434/api/generate -d '{"model":"llama2","prompt":"Hi"}'
```

**Start Ollama if not running:**
```bash
ollama serve
```

### Slow Responses

- Use a smaller model like `phi` or `mistral`
- Reduce response length in the prompt
- Check your CPU/GPU usage

### Model Not Found

**Pull the model first:**
```bash
ollama pull llama2
```

**Or change to a model you have:**
```bash
ollama list  # See what you have
```

Then update `llmStub.js` with the model name.

## 🎨 Benefits of Ollama

✅ **Privacy**: All processing happens locally  
✅ **Free**: No API costs  
✅ **Offline**: Works without internet  
✅ **Customizable**: Full control over models and parameters  
✅ **Fast**: Optimized for local inference  

## 📚 Resources

- **Ollama Website**: https://ollama.ai
- **Model Library**: https://ollama.ai/library
- **Documentation**: https://github.com/ollama/ollama
- **Discord**: https://discord.gg/ollama

---

**Enjoy your AI-powered avatar chatbot! 🎭🤖**
