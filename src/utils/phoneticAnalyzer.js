/**
 * Advanced Phonetic Analyzer for Human-Like Lip Sync
 * Uses sophisticated phoneme mapping and word-based analysis
 */

/**
 * Comprehensive phoneme to viseme mapping
 * Based on actual speech production mechanics
 */
const PHONEME_TO_VISEME = {
  // Bilabial (lips together): P, B, M, W
  P: "closed",
  B: "closed",
  M: "closed",
  W: "closed",

  // Labiodental (teeth on lip): F, V
  F: "f_v",
  V: "f_v",

  // Dental/Alveolar (tongue/teeth): TH, T, D, S, Z, N, L
  TH: "small",
  T: "small",
  D: "small",
  S: "small",
  Z: "small",
  N: "small",
  L: "mid",

  // Post-alveolar: SH, CH, J, ZH
  SH: "ch_sh",
  CH: "ch_sh",
  J: "ch_sh",
  ZH: "ch_sh",

  // Velar (back of mouth): K, G, NG
  K: "mid",
  G: "mid",
  NG: "mid",

  // Glottal: H, R
  H: "mid",
  R: "r",

  // Front vowels (wide/smile): EE, IH, EY, AE
  EE: "wide",
  IH: "wide",
  EY: "wide",
  AE: "wide",
  EH: "wide",

  // Central vowels: UH, ER
  UH: "mid",
  ER: "r",
  AH: "mid",

  // Back vowels (round/open): AA, AO, OW, UW, UH
  AA: "open",
  AO: "open",
  AW: "open",
  OW: "o",
  OY: "open",
  UW: "o",

  // Diphthongs
  AY: "wide",
  EY: "wide",
  OY: "open",
  AW: "open",
  OW: "o",
};

/**
 * Word to phoneme dictionary (common words for better accuracy)
 */
const WORD_PHONEMES = {
  // Common words
  hello: ["HH", "EH", "L", "OW"],
  hi: ["HH", "AY"],
  hey: ["HH", "EY"],
  how: ["HH", "AW"],
  are: ["AA", "R"],
  you: ["Y", "UW"],
  i: ["AY"],
  am: ["AE", "M"],
  the: ["DH", "UH"],
  a: ["AH"],
  is: ["IH", "Z"],
  it: ["IH", "T"],
  to: ["T", "UW"],
  and: ["AE", "N", "D"],
  that: ["DH", "AE", "T"],
  this: ["DH", "IH", "S"],
  what: ["W", "AH", "T"],
  where: ["W", "EH", "R"],
  when: ["W", "EH", "N"],
  who: ["HH", "UW"],
  why: ["W", "AY"],
  can: ["K", "AE", "N"],
  could: ["K", "UH", "D"],
  would: ["W", "UH", "D"],
  should: ["SH", "UH", "D"],
  will: ["W", "IH", "L"],
  yes: ["Y", "EH", "S"],
  no: ["N", "OW"],
  not: ["N", "AH", "T"],
  have: ["HH", "AE", "V"],
  has: ["HH", "AE", "Z"],
  had: ["HH", "AE", "D"],
  do: ["D", "UW"],
  does: ["D", "UH", "Z"],
  did: ["D", "IH", "D"],
  good: ["G", "UH", "D"],
  great: ["G", "R", "EY", "T"],
  nice: ["N", "AY", "S"],
  thanks: ["TH", "AE", "NG", "K", "S"],
  thank: ["TH", "AE", "NG", "K"],
  please: ["P", "L", "EE", "Z"],
  sorry: ["S", "AO", "R", "IY"],
  welcome: ["W", "EH", "L", "K", "AH", "M"],
  today: ["T", "UH", "D", "EY"],
  time: ["T", "AY", "M"],
  day: ["D", "EY"],
  work: ["W", "ER", "K"],
  help: ["HH", "EH", "L", "P"],
  make: ["M", "EY", "K"],
  know: ["N", "OW"],
  think: ["TH", "IH", "NG", "K"],
  see: ["S", "EE"],
  look: ["L", "UH", "K"],
  come: ["K", "AH", "M"],
  go: ["G", "OW"],
  get: ["G", "EH", "T"],
  say: ["S", "EY"],
  tell: ["T", "EH", "L"],
  ask: ["AE", "S", "K"],
  find: ["F", "AY", "N", "D"],
  give: ["G", "IH", "V"],
  use: ["Y", "UW", "Z"],
  want: ["W", "AO", "N", "T"],
  need: ["N", "EE", "D"],
  try: ["T", "R", "AY"],
  feel: ["F", "EE", "L"],
  become: ["B", "IH", "K", "AH", "M"],
  leave: ["L", "EE", "V"],
  put: ["P", "UH", "T"],
};

/**
 * Convert text to phonemes using dictionary + fallback rules
 * @param {string} word - Single word to convert
 * @returns {Array<string>} - Array of phonemes
 */
function wordToPhonemes(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");

  // Check dictionary first
  if (WORD_PHONEMES[clean]) {
    return WORD_PHONEMES[clean];
  }

  // Fallback: letter-to-phoneme rules
  return letterToPhonemes(clean);
}

/**
 * Fallback letter-to-phoneme conversion
 * @param {string} word - Word to convert
 * @returns {Array<string>} - Array of phonemes
 */
function letterToPhonemes(word) {
  const phonemes = [];
  let i = 0;

  while (i < word.length) {
    const char = word[i];
    const next = word[i + 1];
    const prev = word[i - 1];

    // Digraphs and special combinations
    if (char + next === "th") {
      phonemes.push("TH");
      i += 2;
    } else if (char + next === "sh") {
      phonemes.push("SH");
      i += 2;
    } else if (char + next === "ch") {
      phonemes.push("CH");
      i += 2;
    } else if (char + next === "ph") {
      phonemes.push("F");
      i += 2;
    } else if (char + next === "ng") {
      phonemes.push("NG");
      i += 2;
    } else if (char + next === "oo") {
      phonemes.push("UW");
      i += 2;
    } else if (char + next === "ee") {
      phonemes.push("EE");
      i += 2;
    } else if (char + next === "ea") {
      phonemes.push("EE");
      i += 2;
    } else if (char + next === "ou") {
      phonemes.push("AW");
      i += 2;
    } else if (char + next === "ow") {
      phonemes.push("AW");
      i += 2;
    } else if (char + next === "ay") {
      phonemes.push("EY");
      i += 2;
    } else if (char + next === "ai") {
      phonemes.push("EY");
      i += 2;
    } else if (char + next === "oy") {
      phonemes.push("OY");
      i += 2;
    } else if (char + next === "oi") {
      phonemes.push("OY");
      i += 2;
    }
    // Single letters
    else {
      switch (char) {
        case "a":
          phonemes.push(next === "r" ? "AA" : "AE");
          break;
        case "e":
          phonemes.push(i === word.length - 1 ? "" : "EH");
          break;
        case "i":
          phonemes.push("IH");
          break;
        case "o":
          phonemes.push("AO");
          break;
        case "u":
          phonemes.push("UH");
          break;
        case "y":
          phonemes.push(i === 0 ? "Y" : "IY");
          break;
        case "b":
          phonemes.push("B");
          break;
        case "c":
          phonemes.push(next === "h" ? "" : "K");
          break;
        case "d":
          phonemes.push("D");
          break;
        case "f":
          phonemes.push("F");
          break;
        case "g":
          phonemes.push("G");
          break;
        case "h":
          phonemes.push("HH");
          break;
        case "j":
          phonemes.push("J");
          break;
        case "k":
          phonemes.push("K");
          break;
        case "l":
          phonemes.push("L");
          break;
        case "m":
          phonemes.push("M");
          break;
        case "n":
          phonemes.push("N");
          break;
        case "p":
          phonemes.push("P");
          break;
        case "q":
          phonemes.push("K");
          break;
        case "r":
          phonemes.push("R");
          break;
        case "s":
          phonemes.push("S");
          break;
        case "t":
          phonemes.push("T");
          break;
        case "v":
          phonemes.push("V");
          break;
        case "w":
          phonemes.push("W");
          break;
        case "x":
          phonemes.push("K");
          phonemes.push("S");
          break;
        case "z":
          phonemes.push("Z");
          break;
      }
      i++;
    }
  }

  return phonemes.filter((p) => p !== "");
}

/**
 * Convert phoneme to viseme
 * @param {string} phoneme - Phoneme code
 * @returns {string} - Viseme type
 */
function phonemeToViseme(phoneme) {
  return PHONEME_TO_VISEME[phoneme] || "mid";
}

/**
 * Build advanced timeline with proper phonetic analysis
 * @param {string} text - Text to be spoken
 * @param {number} audioDurationMs - Total duration in milliseconds
 * @returns {Array} - Timeline with viseme frames
 */
export function buildAdvancedTimeline(text, audioDurationMs) {
  if (!text || audioDurationMs <= 0) {
    return [{ startMs: 0, endMs: audioDurationMs, viseme: "closed" }];
  }

  // Split into words and punctuation
  const tokens = text.match(/[\w']+|[.,!?;:-]/g) || [];
  const allPhonemes = [];

  // Convert each word to phonemes
  for (const token of tokens) {
    if (/^[.,!?;:-]$/.test(token)) {
      // Punctuation: add pause
      allPhonemes.push({ phoneme: "PAUSE", viseme: "closed", duration: 0.25 });
    } else {
      const phonemes = wordToPhonemes(token);
      for (const phoneme of phonemes) {
        const viseme = phonemeToViseme(phoneme);
        allPhonemes.push({ phoneme, viseme, duration: 1.0 });
      }
      // Add small pause between words
      allPhonemes.push({ phoneme: "SPACE", viseme: "closed", duration: 0.15 });
    }
  }

  if (allPhonemes.length === 0) {
    return [{ startMs: 0, endMs: audioDurationMs, viseme: "closed" }];
  }

  // Adjust durations based on phoneme type
  let totalWeight = 0;
  for (const item of allPhonemes) {
    const viseme = item.viseme;

    // Vowels are longer
    if (viseme === "open" || viseme === "wide" || viseme === "o") {
      item.duration = 2.0;
    }
    // Consonants are shorter
    else if (viseme === "closed") {
      item.duration = 0.5;
    } else if (viseme === "small" || viseme === "f_v") {
      item.duration = 0.6;
    } else if (viseme === "ch_sh") {
      item.duration = 0.8;
    } else {
      item.duration = 0.9;
    }

    totalWeight += item.duration;
  }

  // Build timeline
  const timeline = [];
  let currentTime = 0;
  const timeScale = audioDurationMs / totalWeight;

  for (let i = 0; i < allPhonemes.length; i++) {
    const item = allPhonemes[i];
    const duration = item.duration * timeScale;
    const startMs = currentTime;
    const endMs = Math.min(currentTime + duration, audioDurationMs);

    timeline.push({
      startMs: Math.round(startMs),
      endMs: Math.round(endMs),
      viseme: item.viseme,
      phoneme: item.phoneme,
    });

    currentTime = endMs;
  }

  // Ensure full coverage
  if (timeline.length > 0) {
    timeline[timeline.length - 1].endMs = audioDurationMs;
  }

  // Add smooth transitions
  return smoothTimeline(timeline);
}

/**
 * Smooth timeline with micro-transitions for natural movement
 * @param {Array} timeline - Original timeline
 * @returns {Array} - Smoothed timeline
 */
function smoothTimeline(timeline) {
  const smoothed = [];

  for (let i = 0; i < timeline.length; i++) {
    const current = timeline[i];
    const next = timeline[i + 1];

    smoothed.push(current);

    // Add transition if visemes are very different
    if (next && current.viseme !== next.viseme) {
      const frameDuration = current.endMs - current.startMs;

      // Only add transition for frames longer than 80ms
      if (frameDuration > 80) {
        const transitionMs = Math.min(25, frameDuration * 0.2);

        // Shorten current frame
        current.endMs -= transitionMs;

        // Add transition frame
        const transitionViseme = getTransition(current.viseme, next.viseme);
        if (transitionViseme !== next.viseme) {
          smoothed.push({
            startMs: current.endMs,
            endMs: current.endMs + transitionMs,
            viseme: transitionViseme,
            phoneme: "TRANSITION",
          });
        }
      }
    }
  }

  return smoothed;
}

/**
 * Get intermediate viseme for smooth transitions
 * @param {string} from - Current viseme
 * @param {string} to - Next viseme
 * @returns {string} - Transition viseme
 */
function getTransition(from, to) {
  // Closed to open vowels: go through mid
  if (
    (from === "closed" && (to === "open" || to === "wide" || to === "o")) ||
    ((from === "open" || from === "wide" || from === "o") && to === "closed")
  ) {
    return "mid";
  }

  // Small to wide: go through mid
  if (
    (from === "small" && to === "wide") ||
    (from === "wide" && to === "small")
  ) {
    return "mid";
  }

  // F/V to other shapes
  if (from === "f_v" || to === "f_v") {
    return "small";
  }

  // Direct transition for similar shapes
  return to;
}

export { wordToPhonemes, phonemeToViseme };
