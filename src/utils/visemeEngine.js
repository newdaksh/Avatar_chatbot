/**
 * Viseme Engine
 * Generates a timeline of mouth shapes (visemes) synchronized to speech
 * Uses advanced phonetic analysis for human-like lip sync
 */

import { buildAdvancedTimeline } from "./phoneticAnalyzer.js";

/**
 * Viseme mapping table - Enhanced for realistic lip-sync
 * Maps characters and phoneme patterns to visual mouth shapes
 *
 * Viseme types:
 * - closed: Lips closed (p, b, m, w)
 * - small: Small mouth opening (t, d, s, z, th, sh, ch)
 * - mid: Medium opening (k, g, n, ng, r, l, j)
 * - open: Wide opening (vowels: a, o, u)
 * - wide: Wide stretched (e, i sounds)
 */
const VISEME_MAP = {
  // Closed mouth (bilabial) - lips together
  p: "closed",
  b: "closed",
  m: "closed",
  w: "closed",

  // Small opening (dental/alveolar) - tongue/teeth sounds
  t: "small",
  d: "small",
  s: "small",
  z: "small",
  th: "small",
  sh: "small",
  ch: "small",
  c: "small",

  // Medium opening (velar/liquid) - back of mouth/tongue
  k: "mid",
  g: "mid",
  n: "mid",
  ng: "mid",
  r: "mid",
  l: "mid",
  j: "mid",
  h: "mid",
  f: "mid",
  v: "mid",
  x: "mid",

  // Open mouth (open vowels) - jaw drops
  a: "open",
  o: "open",
  u: "open",
  aa: "open",
  ah: "open",
  aw: "open",
  oo: "open",
  uh: "open",

  // Wide mouth (front vowels) - stretched lips
  e: "wide",
  i: "wide",
  ee: "wide",
  ii: "wide",
  ey: "wide",

  // Special cases
  " ": "closed", // Space/pause - return to rest
  ",": "closed",
  ".": "closed",
  "!": "open",
  "?": "mid",
  "-": "closed",
};

/**
 * Build a timeline of visemes for animation with realistic timing
 * Uses advanced phonetic analysis for human-like lip sync
 * @param {string} text - Text to be spoken
 * @param {number} audioDurationMs - Total duration of audio in milliseconds
 * @param {number} wordsPerMinute - Speaking rate for estimation (default: 160)
 * @returns {Array<{startMs: number, endMs: number, viseme: string}>} - Timeline array
 */
export function buildTimeline(text, audioDurationMs, wordsPerMinute = 160) {
  // Use advanced phonetic analyzer for much better human-like lip sync
  return buildAdvancedTimeline(text, audioDurationMs);
}

/**
 * Add subtle transition frames between different visemes for smoother animation
 * @param {Array} timeline - Original timeline
 * @returns {Array} - Enhanced timeline with transitions
 */
function addTransitionFrames(timeline) {
  const enhanced = [];

  for (let i = 0; i < timeline.length; i++) {
    const current = timeline[i];
    const next = timeline[i + 1];

    enhanced.push(current);

    // Add micro-transition if visemes are very different and duration allows
    if (
      next &&
      current.viseme !== next.viseme &&
      current.endMs - current.startMs > 100
    ) {
      const transitionDuration = Math.min(
        30,
        (current.endMs - current.startMs) * 0.15
      );

      // Adjust current frame to end slightly earlier
      current.endMs -= transitionDuration;

      // Add a brief transition frame
      enhanced.push({
        startMs: current.endMs,
        endMs: current.endMs + transitionDuration,
        viseme: getTransitionViseme(current.viseme, next.viseme),
      });
    }
  }

  return enhanced;
}

/**
 * Get an intermediate viseme for smooth transitions
 * @param {string} from - Starting viseme
 * @param {string} to - Ending viseme
 * @returns {string} - Transition viseme
 */
function getTransitionViseme(from, to) {
  // Transition through neutral states
  if (
    (from === "closed" && to === "open") ||
    (from === "open" && to === "closed")
  ) {
    return "mid";
  }
  if (
    (from === "closed" && to === "wide") ||
    (from === "wide" && to === "closed")
  ) {
    return "small";
  }
  if (
    (from === "open" && to === "wide") ||
    (from === "wide" && to === "open")
  ) {
    return "mid";
  }
  // Default: use the target viseme
  return to;
}

/**
 * Tokenize text into phoneme-like units
 * Simple character-based approach with some digraph handling
 * @param {string} text - Input text
 * @returns {Array<string>} - Array of tokens
 */
function tokenizeText(text) {
  const tokens = [];
  const cleaned = text.toLowerCase().trim();

  let i = 0;
  while (i < cleaned.length) {
    // Check for digraphs (two-character combinations)
    if (i < cleaned.length - 1) {
      const digraph = cleaned.substring(i, i + 2);
      if (VISEME_MAP[digraph]) {
        tokens.push(digraph);
        i += 2;
        continue;
      }
    }

    // Single character
    const char = cleaned[i];

    // Group consecutive vowels
    if (isVowel(char)) {
      let vowelGroup = char;
      let j = i + 1;
      while (j < cleaned.length && isVowel(cleaned[j])) {
        vowelGroup += cleaned[j];
        j++;
      }
      tokens.push(vowelGroup);
      i = j;
    }
    // Keep consonants and spaces
    else if (/[a-z\s,.!?]/.test(char)) {
      tokens.push(char);
      i++;
    }
    // Skip other characters
    else {
      i++;
    }
  }

  return tokens;
}

/**
 * Map a token to a viseme type
 * @param {string} token - Sound token
 * @returns {string} - Viseme type
 */
function mapTokenToViseme(token) {
  // Direct mapping
  if (VISEME_MAP[token]) {
    return VISEME_MAP[token];
  }

  // Check if token contains vowels (vowel groups)
  if (token.length > 1 && Array.from(token).some((c) => isVowel(c))) {
    return "open";
  }

  // Default for single characters
  const firstChar = token[0];
  if (VISEME_MAP[firstChar]) {
    return VISEME_MAP[firstChar];
  }

  // Fallback
  return "mid";
}

/**
 * Check if character is a vowel
 * @param {string} char - Single character
 * @returns {boolean}
 */
function isVowel(char) {
  return /[aeiou]/.test(char);
}

/**
 * Estimate speaking duration from text (alternative calculation)
 * @param {string} text - Text to estimate
 * @param {number} wordsPerMinute - Speaking rate
 * @returns {number} - Estimated duration in milliseconds
 */
export function estimateDuration(text, wordsPerMinute = 160) {
  const words = text.trim().split(/\s+/).length;
  const durationSeconds = (words / wordsPerMinute) * 60;
  return durationSeconds * 1000; // Convert to ms
}
