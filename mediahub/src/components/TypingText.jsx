import React, { useState, useEffect } from 'react';

/**
 * Component that simulates a typing effect for a given string.
 * It is now configured to loop the animation with a delay.
 * * @param {string} text - The full text to be typed out.
 * @param {number} typingSpeed - Delay in milliseconds between each character (higher = slower).
 * @param {number} repeatDelay - Delay in milliseconds before the typing restarts.
 */
const TypingText = ({ text, typingSpeed = 100, repeatDelay = 5000 }) => {
  // index tracks how many characters have been "typed"
  const [index, setIndex] = useState(0);
  // isTypingStarted ensures the typing starts only once on initial load
  const [isTypingStarted, setIsTypingStarted] = useState(false);

  // --- Effect 1: Handles the Typing Animation ---
  useEffect(() => {
    // Only proceed if we haven't finished typing the current text
    if (index < text.length) {
      const timer = setTimeout(() => {
        setIndex(index + 1); 
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    }
    
    // Once typing is finished, set the flag
    if (index === text.length && !isTypingStarted) {
        setIsTypingStarted(true);
    }
    
  }, [index, text, typingSpeed, isTypingStarted]); 

  // --- Effect 2: Handles the Repeat Loop (Every 5 seconds) ---
  useEffect(() => {
    let loopTimer;

    // Check if typing is finished and has been seen once
    if (isTypingStarted && index === text.length) {
        loopTimer = setTimeout(() => {
            // Reset the index to 0 to start the typing over
            setIndex(0); 
            setIsTypingStarted(false); // Reset the flag
        }, repeatDelay);
    }

    return () => clearTimeout(loopTimer);
  }, [isTypingStarted, index, text.length, repeatDelay]);


  const displayedText = text.substring(0, index);
  const isTypingFinished = index >= text.length;

  return (
    <span className="inline-block relative">
      <span className="text-amber-500">{displayedText}</span>
      
      {/* Blinking Cursor: Show while typing OR briefly during the pause */}
      <span 
        className={`inline-block w-1 md:w-2 h-full ml-1 bg-amber-500 align-text-top 
                    transition-opacity duration-300 transform translate-y-0.5 
                    ${isTypingFinished ? 'animate-pulse' : 'opacity-100'}`}
      >
        &nbsp;
      </span>
    </span>
  );
};

export default TypingText;