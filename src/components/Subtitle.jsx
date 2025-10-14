import { useState, useEffect, useRef } from "react";

/**
 * Subtitle Component
 * Displays text with a typewriter effect synchronized to speech duration
 */
function Subtitle({ text, duration, isActive }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Reset when new text arrives
    if (!text || !isActive) {
      setDisplayedText("");
      setCurrentIndex(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Calculate delay between characters for typewriter effect
    // Duration is in milliseconds, divide by text length for character timing
    const charDelay = duration > 0 ? duration / text.length : 50;

    // Start typewriter effect
    setDisplayedText("");
    setCurrentIndex(0);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex <= text.length) {
          setDisplayedText(text.substring(0, nextIndex));
          return nextIndex;
        } else {
          // Finished typing
          clearInterval(intervalRef.current);
          return prevIndex;
        }
      });
    }, charDelay);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, duration, isActive]);

  if (!isActive || !text) {
    return null;
  }

  return (
    <div className="subtitle-box">
      <p className="subtitle-text">
        {displayedText}
        {currentIndex < text.length && <span className="cursor">|</span>}
      </p>
    </div>
  );
}

export default Subtitle;
