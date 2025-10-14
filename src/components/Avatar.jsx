import { useState, useEffect, useRef } from "react";

/**
 * Avatar Component
 * Renders an SVG comic-style avatar with animated mouth (lip-sync), blinking eyes, and emotion-based eyebrows
 */
function Avatar({ timeline, isSpeaking, emotion, onAnimationEnd }) {
  const [currentViseme, setCurrentViseme] = useState("closed");
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyebrowAngle, setEyebrowAngle] = useState(0);

  const animationFrameRef = useRef(null);
  const blinkIntervalRef = useRef(null);
  const animationStartTimeRef = useRef(null);

  /**
   * Main animation loop using requestAnimationFrame
   * Updates mouth shape based on timeline with smooth transitions
   */
  useEffect(() => {
    if (!isSpeaking || timeline.length === 0) {
      setCurrentViseme("closed");
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    // Start animation
    animationStartTimeRef.current = performance.now();

    const animate = () => {
      const elapsed = performance.now() - animationStartTimeRef.current;

      // Find current viseme in timeline
      const currentFrame = timeline.find(
        (frame) => elapsed >= frame.startMs && elapsed < frame.endMs
      );

      if (currentFrame) {
        // Only update if viseme changed (reduces unnecessary re-renders)
        setCurrentViseme((prev) => {
          if (prev !== currentFrame.viseme) {
            return currentFrame.viseme;
          }
          return prev;
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      } else if (elapsed >= timeline[timeline.length - 1]?.endMs) {
        // Animation complete - return to rest position
        setCurrentViseme("closed");
        if (onAnimationEnd) {
          onAnimationEnd();
        }
      } else {
        // Continue animation (handles gaps in timeline)
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timeline, isSpeaking, onAnimationEnd]);

  /**
   * Blinking animation
   * Triggers random natural blinks every 2-5 seconds
   */
  useEffect(() => {
    const scheduleNextBlink = () => {
      const delay = 2000 + Math.random() * 3000; // 2-5 seconds
      blinkIntervalRef.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 150); // Blink duration: 150ms
      }, delay);
    };

    scheduleNextBlink();

    // Cleanup
    return () => {
      if (blinkIntervalRef.current) {
        clearTimeout(blinkIntervalRef.current);
      }
    };
  }, []);

  /**
   * Eyebrow emotion changes
   * Adjust eyebrow angle based on emotion
   */
  useEffect(() => {
    switch (emotion) {
      case "friendly":
        setEyebrowAngle(0); // Neutral, slightly raised
        break;
      case "surprised":
        setEyebrowAngle(-5); // Raised
        break;
      case "neutral":
      default:
        setEyebrowAngle(0);
        break;
    }
  }, [emotion]);

  /**
   * Render mouth shape based on current viseme
   * Returns JSX for human-like realistic mouth animations with proper phonetic shapes
   */
  const renderMouth = () => {
    const mouthShapes = {
      closed: (
        <g
          id="mouth_closed"
          opacity={currentViseme === "closed" ? 1 : 0}
          style={{ transition: "opacity 0.06s ease-out" }}
        >
          {/* Closed smile - lips together (P, B, M, W) */}
          <path
            d="M 130 195 Q 150 198 170 195"
            stroke="#D4866B"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Subtle lip line */}
          <path
            d="M 135 195 Q 150 197 165 195"
            stroke="#C97A60"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ),
      f_v: (
        <g
          id="mouth_f_v"
          opacity={currentViseme === "f_v" ? 1 : 0}
          style={{ transition: "opacity 0.06s ease-out" }}
        >
          {/* F/V sounds - teeth on lower lip */}
          <ellipse cx="150" cy="198" rx="11" ry="7" fill="#8B4B4B" />
          <ellipse cx="150" cy="197" rx="10" ry="5" fill="#6B3535" />
          {/* Teeth showing on upper lip */}
          <rect
            x="142"
            y="191"
            width="16"
            height="4"
            fill="#FFFFFF"
            opacity="0.9"
            rx="1"
          />
          {/* Upper lip */}
          <path d="M 139 190 Q 150 188 161 190" fill="#E89A7E" />
          {/* Lower lip tucked under teeth */}
          <path d="M 139 202 Q 150 203 161 202" fill="#D4866B" />
        </g>
      ),
      small: (
        <g
          id="mouth_small"
          opacity={currentViseme === "small" ? 1 : 0}
          style={{ transition: "opacity 0.06s ease-out" }}
        >
          {/* Small opening - for dental/alveolar sounds (T, D, S, Z, TH) */}
          <ellipse cx="150" cy="197" rx="10" ry="8" fill="#8B4B4B" />
          <ellipse cx="150" cy="196" rx="9" ry="6" fill="#6B3535" />
          {/* Upper lip */}
          <path d="M 140 193 Q 150 191 160 193" fill="#E89A7E" />
          {/* Lower lip */}
          <path d="M 140 201 Q 150 203 160 201" fill="#D4866B" />
        </g>
      ),
      ch_sh: (
        <g
          id="mouth_ch_sh"
          opacity={currentViseme === "ch_sh" ? 1 : 0}
          style={{ transition: "opacity 0.06s ease-out" }}
        >
          {/* CH/SH sounds - lips pushed forward slightly */}
          <ellipse cx="150" cy="197" rx="9" ry="10" fill="#8B4B4B" />
          <ellipse cx="150" cy="196" rx="8" ry="8" fill="#6B3535" />
          {/* Upper lip pushed forward */}
          <path d="M 141 192 Q 150 190 159 192" fill="#E89A7E" />
          {/* Lower lip pushed forward */}
          <path d="M 141 202 Q 150 204 159 202" fill="#D4866B" />
        </g>
      ),
      r: (
        <g
          id="mouth_r"
          opacity={currentViseme === "r" ? 1 : 0}
          style={{ transition: "opacity 0.06s ease-out" }}
        >
          {/* R sound - lips slightly rounded, forward */}
          <ellipse cx="150" cy="197" rx="11" ry="11" fill="#8B4B4B" />
          <ellipse cx="150" cy="196" rx="10" ry="9" fill="#6B3535" />
          {/* Rounded lips */}
          <path d="M 139 193 Q 150 191 161 193" fill="#E89A7E" />
          <path d="M 139 201 Q 150 203 161 201" fill="#D4866B" />
        </g>
      ),
      mid: (
        <g
          id="mouth_mid"
          opacity={currentViseme === "mid" ? 1 : 0}
          style={{ transition: "opacity 0.06s ease-out" }}
        >
          {/* Medium opening - for velar consonants (K, G, N, H) */}
          <ellipse cx="150" cy="198" rx="12" ry="12" fill="#8B4B4B" />
          <ellipse cx="150" cy="197" rx="11" ry="10" fill="#6B3535" />
          {/* Teeth hint */}
          <rect
            x="145"
            y="192"
            width="10"
            height="4"
            fill="#FFFFFF"
            opacity="0.6"
            rx="1"
          />
          {/* Upper lip */}
          <path d="M 138 191 Q 150 189 162 191" fill="#E89A7E" />
          {/* Lower lip */}
          <path d="M 138 205 Q 150 207 162 205" fill="#D4866B" />
        </g>
      ),
      o: (
        <g
          id="mouth_o"
          opacity={currentViseme === "o" ? 1 : 0}
          style={{ transition: "opacity 0.06s ease-out" }}
        >
          {/* O/OW sounds - rounded lips, smaller opening */}
          <ellipse cx="150" cy="199" rx="12" ry="14" fill="#8B4B4B" />
          <ellipse cx="150" cy="198" rx="11" ry="12" fill="#6B3535" />
          {/* Rounded upper lip */}
          <path d="M 138 193 Q 150 191 162 193" fill="#E89A7E" />
          {/* Rounded lower lip */}
          <path d="M 138 205 Q 150 207 162 205" fill="#D4866B" />
        </g>
      ),
      open: (
        <g
          id="mouth_open"
          opacity={currentViseme === "open" ? 1 : 0}
          style={{ transition: "opacity 0.06s ease-out" }}
        >
          {/* Wide jaw drop - for back vowels (AA, AH, AW) */}
          <ellipse cx="150" cy="200" rx="15" ry="18" fill="#8B4B4B" />
          <ellipse cx="150" cy="198" rx="14" ry="16" fill="#6B3535" />
          {/* Teeth */}
          <rect
            x="140"
            y="190"
            width="20"
            height="6"
            fill="#FFFFFF"
            opacity="0.8"
            rx="2"
          />
          <rect
            x="140"
            y="204"
            width="20"
            height="5"
            fill="#FFFFFF"
            opacity="0.7"
            rx="1"
          />
          {/* Tongue hint */}
          <ellipse
            cx="150"
            cy="205"
            rx="10"
            ry="6"
            fill="#D45D5D"
            opacity="0.6"
          />
          {/* Upper lip */}
          <path d="M 135 188 Q 150 186 165 188" fill="#E89A7E" />
          {/* Lower lip */}
          <path d="M 135 212 Q 150 215 165 212" fill="#D4866B" />
        </g>
      ),
      wide: (
        <g
          id="mouth_wide"
          opacity={currentViseme === "wide" ? 1 : 0}
          style={{ transition: "opacity 0.06s ease-out" }}
        >
          {/* Wide smile - for front vowels (EE, IH, EY) */}
          <ellipse cx="150" cy="197" rx="18" ry="10" fill="#8B4B4B" />
          <ellipse cx="150" cy="196" rx="17" ry="8" fill="#6B3535" />
          {/* Teeth showing */}
          <rect
            x="135"
            y="192"
            width="30"
            height="5"
            fill="#FFFFFF"
            opacity="0.9"
            rx="2"
          />
          {/* Upper lip stretched */}
          <path d="M 132 190 Q 150 188 168 190" fill="#E89A7E" />
          {/* Lower lip stretched */}
          <path d="M 132 204 Q 150 205 168 204" fill="#D4866B" />
        </g>
      ),
    };

    return <g id="mouth-group">{Object.values(mouthShapes)}</g>;
  };

  return (
    <svg
      viewBox="0 0 300 400"
      className="avatar-svg"
      role="img"
      aria-label="Animated comic avatar"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background circle */}
      <circle cx="150" cy="150" r="140" fill="#F0F0F0" opacity="0.3" />

      {/* Neck */}
      <ellipse cx="150" cy="280" rx="35" ry="45" fill="#FFCBA4" />
      <ellipse cx="150" cy="280" rx="32" ry="42" fill="#FFD8B4" />

      {/* Shoulders - Hoodie */}
      <ellipse cx="150" cy="360" rx="100" ry="50" fill="#5A7C99" />
      <ellipse cx="150" cy="345" rx="95" ry="45" fill="#4A6B87" />

      {/* Hoodie collar */}
      <path d="M 80 320 Q 85 300 95 295 L 105 330 Z" fill="#7BA5C1" />
      <path d="M 220 320 Q 215 300 205 295 L 195 330 Z" fill="#7BA5C1" />
      <path
        d="M 105 295 Q 150 285 195 295 L 195 330 Q 150 320 105 330 Z"
        fill="#8BB5D1"
      />

      {/* Head base */}
      <ellipse cx="150" cy="150" rx="75" ry="85" fill="#FFCBA4" />
      <ellipse cx="150" cy="150" rx="73" ry="83" fill="#FFD8B4" />

      {/* Ears */}
      <ellipse cx="85" cy="160" rx="18" ry="25" fill="#FFCBA4" />
      <ellipse cx="88" cy="162" rx="10" ry="15" fill="#FFB894" />
      <ellipse cx="215" cy="160" rx="18" ry="25" fill="#FFCBA4" />
      <ellipse cx="212" cy="162" rx="10" ry="15" fill="#FFB894" />

      {/* Hair - Styled blonde hair */}
      {/* Back hair */}
      <ellipse cx="150" cy="90" rx="80" ry="55" fill="#F4D49C" />

      {/* Hair strands - left side */}
      <path d="M 80 100 Q 70 120 75 145" fill="#F4D49C" />
      <path d="M 75 95 Q 65 115 68 140" fill="#F9E4B7" />

      {/* Hair strands - right side */}
      <path d="M 220 100 Q 230 120 225 145" fill="#F4D49C" />
      <path d="M 225 95 Q 235 115 232 140" fill="#F9E4B7" />

      {/* Front hair - bangs */}
      <path
        d="M 100 80 Q 110 65 120 70 Q 125 75 130 68 Q 135 65 140 70 Q 145 65 150 68 Q 155 65 160 70 Q 165 75 170 68 Q 175 65 180 70 Q 190 65 200 80"
        fill="#F9E4B7"
      />
      <path d="M 105 85 Q 115 100 110 115" fill="#F4D49C" />
      <path d="M 130 75 Q 135 95 132 110" fill="#F9E4B7" />
      <path d="M 150 70 Q 150 90 148 108" fill="#F4D49C" />
      <path d="M 170 75 Q 165 95 168 110" fill="#F9E4B7" />
      <path d="M 195 85 Q 185 100 190 115" fill="#F4D49C" />

      {/* Hair highlights */}
      <ellipse cx="130" cy="80" rx="15" ry="8" fill="#FFF4D9" opacity="0.6" />
      <ellipse cx="175" cy="85" rx="12" ry="7" fill="#FFF4D9" opacity="0.6" />

      {/* Eyebrows */}
      <path
        d="M 105 125 Q 120 120 135 122"
        stroke="#B8956A"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        transform={`rotate(${eyebrowAngle} 120 123)`}
        style={{ transition: "transform 0.3s ease" }}
      />
      <path
        d="M 165 122 Q 180 120 195 125"
        stroke="#B8956A"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        transform={`rotate(${-eyebrowAngle} 180 123)`}
        style={{ transition: "transform 0.3s ease" }}
      />

      {/* Eyes */}
      <g id="left-eye">
        {/* Eye white */}
        <ellipse
          cx="120"
          cy="145"
          rx="16"
          ry={isBlinking ? 2 : 18}
          fill="#FFFFFF"
          style={{ transition: "ry 0.1s ease" }}
        />
        {!isBlinking && (
          <>
            {/* Iris */}
            <circle cx="120" cy="147" r="10" fill="#4A90E2" />
            {/* Pupil */}
            <circle cx="120" cy="147" r="5" fill="#1A1A1A" />
            {/* Light reflection */}
            <circle cx="123" cy="143" r="3" fill="#FFFFFF" opacity="0.8" />
          </>
        )}
        {/* Upper eyelid shadow */}
        {!isBlinking && (
          <ellipse
            cx="120"
            cy="135"
            rx="16"
            ry="8"
            fill="#000"
            opacity="0.05"
          />
        )}
      </g>

      <g id="right-eye">
        {/* Eye white */}
        <ellipse
          cx="180"
          cy="145"
          rx="16"
          ry={isBlinking ? 2 : 18}
          fill="#FFFFFF"
          style={{ transition: "ry 0.1s ease" }}
        />
        {!isBlinking && (
          <>
            {/* Iris */}
            <circle cx="180" cy="147" r="10" fill="#4A90E2" />
            {/* Pupil */}
            <circle cx="180" cy="147" r="5" fill="#1A1A1A" />
            {/* Light reflection */}
            <circle cx="183" cy="143" r="3" fill="#FFFFFF" opacity="0.8" />
          </>
        )}
        {/* Upper eyelid shadow */}
        {!isBlinking && (
          <ellipse
            cx="180"
            cy="135"
            rx="16"
            ry="8"
            fill="#000"
            opacity="0.05"
          />
        )}
      </g>

      {/* Nose */}
      <ellipse cx="150" cy="170" rx="8" ry="12" fill="#FFBB94" opacity="0.4" />
      <path
        d="M 150 165 Q 145 175 148 180"
        stroke="#E6A578"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="145" cy="178" rx="3" ry="4" fill="#E6A578" opacity="0.5" />
      <ellipse cx="155" cy="178" rx="3" ry="4" fill="#E6A578" opacity="0.5" />

      {/* Cheek blush */}
      <ellipse cx="100" cy="165" rx="20" ry="12" fill="#FFB6C1" opacity="0.3" />
      <ellipse cx="200" cy="165" rx="20" ry="12" fill="#FFB6C1" opacity="0.3" />

      {/* Mouth - Realistic animated shapes */}
      {renderMouth()}

      {/* Chin shadow */}
      <ellipse cx="150" cy="215" rx="35" ry="15" fill="#000" opacity="0.03" />
    </svg>
  );
}

export default Avatar;
