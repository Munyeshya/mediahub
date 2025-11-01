import React, { useState, useEffect } from 'react';

/**
 * Component that simulates a typing effect for a given string.
 * @param {string} text - The full text to be typed out.
 * @param {number} typingSpeed - Delay in milliseconds between each character (default: 75).
 */
const TypingText = ({ text, typingSpeed = 75 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingFinished, setIsTypingFinished] = useState(false);

  useEffect(() => {
    let i = 0;
    
    // Only start typing if the component is mounted
    const timer = setInterval(() => {
        // If we've reached the end of the text, stop the interval and mark as finished
        if (i >= text.length) {
            clearInterval(timer);
            setIsTypingFinished(true); 
            return;
        }

        // Append the next character to the displayed text
        setDisplayedText(prev => prev + text[i]);
        i++;
    }, typingSpeed);
    
    // Cleanup function to stop the timer when the component unmounts
    return () => clearInterval(timer);
    
  }, [text, typingSpeed]); // Dependencies

  return (
    <span className="inline-block relative">
      <span className="text-amber-500">{displayedText}</span>
      
      {/* Blinking Cursor: Hide completely when typing is finished */}
      <span 
        className={`inline-block w-1 md:w-2 h-full ml-1 bg-amber-500 align-text-top 
                    transition-opacity duration-300 transform translate-y-0.5 
                    ${isTypingFinished ? 'opacity-0' : 'animate-pulse'}`}
      >
        &nbsp;
      </span>
    </span>
  );
};

export default TypingText;