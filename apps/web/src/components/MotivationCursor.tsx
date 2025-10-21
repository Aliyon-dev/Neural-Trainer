import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

const motivationalMessages = [
  "You've got this! 💪",
  "Every workout counts! 🏃‍♂️",
  "Progress, not perfection! ✨",
  "Your future self will thank you! 🙏",
  "Small steps, big changes! 🌟",
  "You're stronger than you think! 💪",
  "Consistency is key! 🔑",
  "Believe in yourself! 🌈",
  "Every rep matters! 🏋️‍♀️",
  "You're doing amazing! 🎉"
];

interface MotivationCursorProps {
  className?: string;
}

export function MotivationCursor({ className }: MotivationCursorProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handleMouseEnter = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setCurrentMessage(randomMessage);
      setShowMessage(true);
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
        setIsSpinning(false);
      }, 3000);
    }
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 cursor-pointer transition-all duration-300 hover:scale-110",
          isSpinning && "animate-spin",
          className
        )}
        onMouseEnter={handleMouseEnter}
        style={{
          animation: isSpinning ? 'spin 1s linear infinite' : 'none',
        }}
      >
        <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-white text-sm font-bold">💪</span>
        </div>
      </div>
      
      {showMessage && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap animate-pulse">
          {currentMessage}
        </div>
      )}
    </div>
  );
}
