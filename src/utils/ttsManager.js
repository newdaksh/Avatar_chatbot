/**
 * TTS Manager
 * Handles text-to-speech using the Web Speech API (speechSynthesis)
 * Provides estimation fallback when boundary events are not available
 */

let currentUtterance = null;

/**
 * Speak text using Web Speech API
 * @param {string} text - Text to speak
 * @param {Object} opts - Options for speech
 * @param {number} opts.rate - Speech rate (0.1 to 10, default 1)
 * @param {string} opts.voiceName - Specific voice name (optional)
 * @returns {Promise<{audioDuration: number}>} - Resolves with audio duration in seconds
 */
export function speak(text, opts = {}) {
  return new Promise((resolve, reject) => {
    // Check if speechSynthesis is available
    if (!window.speechSynthesis) {
      reject(new Error("speechSynthesis not supported"));
      return;
    }

    // Stop any ongoing speech first
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      console.log('🛑 Stopping previous speech...');
      window.speechSynthesis.cancel();
      // Give it time to fully stop
      setTimeout(() => startSpeech(), 100);
    } else {
      startSpeech();
    }

    function startSpeech() {
      // Create utterance
      currentUtterance = new SpeechSynthesisUtterance(text);

      // Apply options
      currentUtterance.rate = opts.rate || 1.0;
      currentUtterance.pitch = opts.pitch || 1.0;
      currentUtterance.volume = opts.volume || 1.0;

      // Set voice if specified
      if (opts.voiceName) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find((v) => v.name === opts.voiceName);
        if (selectedVoice) {
          currentUtterance.voice = selectedVoice;
        }
      }

      // Track actual start time
      let actualStartTime = null;
      let actualEndTime = null;
      let resolved = false;

      // Event: Speech started
      currentUtterance.onstart = () => {
        actualStartTime = performance.now();
        console.log("🎤 Speech started");
      };

      // Event: Speech ended successfully
      currentUtterance.onend = () => {
        if (resolved) return;
        resolved = true;
        
        actualEndTime = performance.now();

        // Calculate actual duration if we have timestamps
        let audioDuration;
        if (actualStartTime && actualEndTime) {
          audioDuration = (actualEndTime - actualStartTime) / 1000; // Convert to seconds
        } else {
          // Fallback: estimate duration based on word count
          audioDuration = estimateDuration(text, opts.rate || 1.0);
        }

        console.log(`✅ Speech ended. Duration: ${audioDuration.toFixed(2)}s`);
        resolve({ audioDuration });
      };

      // Event: Speech error - handle gracefully
      currentUtterance.onerror = (event) => {
        if (resolved) return;
        resolved = true;
        
        console.warn(`⚠️ Speech error: ${event.error}`);
        
        // If interrupted, that's expected - still resolve with estimated duration
        if (event.error === 'interrupted' || event.error === 'canceled') {
          const estimatedDuration = estimateDuration(text, opts.rate || 1.0);
          console.log(`Using estimated duration: ${estimatedDuration.toFixed(2)}s`);
          resolve({ audioDuration: estimatedDuration });
        } else {
          // For other errors, reject
          reject(new Error(`Speech synthesis error: ${event.error}`));
        }
      };

      // Optional: Boundary events (not all browsers support this reliably)
      currentUtterance.onboundary = (event) => {
        // Removed verbose logging to reduce console spam
      };

      // Start speech
      console.log('🎬 Starting speech synthesis...');
      window.speechSynthesis.speak(currentUtterance);

      // Fallback timeout: if speech doesn't fire onend within reasonable time
      const estimatedDuration = estimateDuration(text, opts.rate || 1.0);
      const timeoutMs = (estimatedDuration + 5) * 1000; // Add 5 second buffer

      setTimeout(() => {
        if (!resolved && window.speechSynthesis.speaking) {
          console.warn("⏱️ Speech timeout - forcing stop");
          resolved = true;
          stop();
          resolve({ audioDuration: estimatedDuration });
        }
      }, timeoutMs);
    }
  });
}

/**
 * Stop current speech
 */
export function stop() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

/**
 * Estimate speech duration based on word count
 * Fallback method when actual timing is not available
 * @param {string} text - Text to estimate
 * @param {number} rate - Speech rate multiplier
 * @returns {number} - Estimated duration in seconds
 */
function estimateDuration(text, rate = 1.0) {
  // Average speaking rate: 150-160 words per minute
  const baseWPM = 160;
  const adjustedWPM = baseWPM * rate;

  // Count words (split by whitespace)
  const words = text.trim().split(/\s+/).length;

  // Calculate duration in seconds
  const durationSeconds = (words / adjustedWPM) * 60;

  // Add small buffer for pauses and punctuation
  const buffered = durationSeconds * 1.1;

  return Math.max(buffered, 0.5); // Minimum 0.5 seconds
}

/**
 * Get available voices
 * @returns {Array} - Array of available voice objects
 */
export function getVoices() {
  if (!window.speechSynthesis) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

/**
 * Load voices (some browsers require this to be called after page load)
 * @returns {Promise<Array>} - Promise that resolves with available voices
 */
export function loadVoices() {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve([]);
      return;
    }

    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };
  });
}
