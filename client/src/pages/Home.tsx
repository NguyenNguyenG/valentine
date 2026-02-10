/**
 * Romantic Maximalism Design Philosophy:
 * - Emotional abundance with rich, layered visuals
 * - Playful elegance balancing sophistication with whimsy
 * - Tactile depth using soft shadows, gradients, and blur
 * - Joyful motion with bouncy, celebratory animations
 * 
 * Color Palette: Dusty rose (#E8B4B8), warm coral (#FF6B7A), creamy ivory (#FFF8F0)
 * Typography: Playfair Display (display) + Quicksand (body)
 */

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 200, y: 0 }); // Start offset from Yes button
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [noHoverCount, setNoHoverCount] = useState(0);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const lastMoveTime = useRef(0);
  const [initialized, setInitialized] = useState(false);

  // Initialize No button position on mount
  useEffect(() => {
    if (!initialized && buttonsContainerRef.current && noButtonRef.current && yesButtonRef.current) {
      const container = buttonsContainerRef.current.getBoundingClientRect();
      const noButton = noButtonRef.current.getBoundingClientRect();
      const yesButton = yesButtonRef.current.getBoundingClientRect();
      
      // Calculate a safe initial position (to the right of Yes button with spacing)
      const yesButtonRelativeRight = yesButton.right - container.left;
      const initialX = Math.min(yesButtonRelativeRight + 20, container.width - noButton.width);
      const initialY = 0;
      
      setNoButtonPosition({ x: initialX, y: initialY });
      setInitialized(true);
    }
  }, [initialized]);

  // Handle "No" button evasion
  const handleNoHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent rapid re-triggering (cooldown of 500ms)
    const now = Date.now();
    if (now - lastMoveTime.current < 500 || isMoving) return;

    if (!buttonsContainerRef.current || !noButtonRef.current) return;

    const container = buttonsContainerRef.current.getBoundingClientRect();
    const button = noButtonRef.current.getBoundingClientRect();

    // Get cursor position relative to container
    const cursorX = e.clientX - container.left;
    const cursorY = e.clientY - container.top;

    lastMoveTime.current = now;
    setIsMoving(true);
    setNoHoverCount(prev => prev + 1); // Increment hover count
    moveButtonAwayFromPoint(cursorX, cursorY, container, button);
    
    // Re-enable after transition completes
    setTimeout(() => setIsMoving(false), 300);
  };

  // Handle touch events
  const handleNoTouch = (e: React.TouchEvent<HTMLButtonElement>) => {
    // Prevent rapid re-triggering
    const now = Date.now();
    if (now - lastMoveTime.current < 500 || isMoving) return;

    if (!buttonsContainerRef.current || !noButtonRef.current) return;

    const container = buttonsContainerRef.current.getBoundingClientRect();
    const button = noButtonRef.current.getBoundingClientRect();

    // Get touch position relative to container
    const touch = e.touches[0];
    const cursorX = touch.clientX - container.left;
    const cursorY = touch.clientY - container.top;

    lastMoveTime.current = now;
    setIsMoving(true);
    setNoHoverCount(prev => prev + 1); // Increment hover count
    moveButtonAwayFromPoint(cursorX, cursorY, container, button);
    
    // Re-enable after transition completes
    setTimeout(() => setIsMoving(false), 300);
  };

  // Move button away from a specific point
  const moveButtonAwayFromPoint = (
    cursorX: number,
    cursorY: number,
    container: DOMRect,
    button: DOMRect
  ) => {
    // Calculate safe boundaries
    const maxX = container.width - button.width;
    const maxY = container.height - button.height;
    
    const minDistanceFromCursor = 150; // Minimum distance from cursor
    const minDistanceFromYes = 120; // Minimum distance from Yes button
    let newX, newY;
    let attempts = 0;
    
    // Get Yes button position if it exists
    const yesButton = yesButtonRef.current?.getBoundingClientRect();
    const yesButtonCenterX = yesButton ? (yesButton.left - container.left + yesButton.width / 2) : -1000;
    const yesButtonCenterY = yesButton ? (yesButton.top - container.top + yesButton.height / 2) : -1000;
    
    // Keep trying until we find a position far enough from both cursor and Yes button
    do {
      newX = Math.random() * maxX;
      newY = Math.random() * maxY;
      
      // Calculate distance from cursor to new button center
      const buttonCenterX = newX + button.width / 2;
      const buttonCenterY = newY + button.height / 2;
      const distanceFromCursor = Math.sqrt(
        Math.pow(buttonCenterX - cursorX, 2) + 
        Math.pow(buttonCenterY - cursorY, 2)
      );
      
      // Calculate distance from Yes button to new button center
      const distanceFromYes = Math.sqrt(
        Math.pow(buttonCenterX - yesButtonCenterX, 2) + 
        Math.pow(buttonCenterY - yesButtonCenterY, 2)
      );
      
      // If far enough from both or tried too many times, use this position
      if ((distanceFromCursor > minDistanceFromCursor && distanceFromYes > minDistanceFromYes) || attempts > 20) {
        break;
      }
      attempts++;
    } while (true);

    setNoButtonPosition({ x: newX, y: newY });
  };

  // Handle "Yes" button click
  const handleYesClick = () => {
    setAccepted(true);
    setShowConfetti(true);

    // Create confetti effect
    createConfetti();
  };

  // Confetti animation
  const createConfetti = () => {
    const confettiContainer = document.getElementById("confetti-container");
    if (!confettiContainer) return;

    // Create multiple confetti elements
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti-piece";
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
      
      // Random shapes (hearts, circles, sparkles)
      const shapes = ["❤️", "💕", "✨", "💖", "🌟"];
      confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      
      confettiContainer.appendChild(confetti);

      // Remove after animation
      setTimeout(() => confetti.remove(), 4000);
    }
  };

  return (
    <div 
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/Oj2E92x2ND9evM3iqpYeAA/sandbox/PY7jDcCfw6UcYcW0FnozG5-img-1_1770708374000_na1fn_aGVyby1iYWNrZ3JvdW5k.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvT2oyRTkyeDJORDlldk0zaXFwWWVBQS9zYW5kYm94L1BZN2pEY0NmdzZVY1ljVzBGbm96RzUtaW1nLTFfMTc3MDcwODM3NDAwMF9uYTFmbl9hR1Z5YnkxaVlXTnJaM0p2ZFc1ay5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Bx88fVu58AFn3i45kYxA~LETl42cKL6lwNnj0~QnjktBfeQdIkRxbG0RqaikQiQ9S9TKO5IMyJDjZ~SIeZ6FP7XN4Tci7dLUXcGAGKL61eMon3nvlj4DvGm5DfoZTIEr9doEhF0tvAtmCIIL-a96O7h23eB1vKZUFD9BMS-WGJm7IskBVHSyKVJspAK-HFisIgMbUnSRDCgU6CFXtTwXJhTkzbgnygtyN7o9q67zESVN6xT-ePov8lnaAs3eDHILqrJuSaPyFUdqBoRtiYgQSqGV0XUb1IqgGHQ~CGsYHnvXjpT9F-Kmt4u-L9FS~ozd8Xynn0hL15fqKvsl7pRuZQ__')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Floating hearts background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.4
            }}
          >
            <Heart 
              className="text-[#FF6B7A]" 
              size={20 + Math.random() * 40}
              fill="currentColor"
            />
          </div>
        ))}
      </div>

      {/* Confetti container */}
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {!accepted ? (
          <div className="animate-fade-in-up">
            {/* Question */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-[#8B2635] drop-shadow-lg leading-tight">
              Will You Be My Valentine?
            </h1>

            {/* Decorative hearts */}
            <div className="flex justify-center gap-4 mb-12">
              <Heart className="text-[#FF6B7A] animate-pulse" size={32} fill="currentColor" />
              <Heart className="text-[#E8B4B8] animate-pulse" size={40} fill="currentColor" style={{ animationDelay: '0.2s' }} />
              <Heart className="text-[#FF6B7A] animate-pulse" size={32} fill="currentColor" style={{ animationDelay: '0.4s' }} />
            </div>

            {/* Buttons */}
            <div 
              ref={buttonsContainerRef}
              className="relative flex flex-col sm:flex-row gap-6 justify-center items-center min-h-[200px] w-full max-w-md mx-auto"
            >
              {/* Yes Button */}
              <Button
                ref={yesButtonRef}
                onClick={handleYesClick}
                size="lg"
                className="bg-[#FF6B7A] hover:bg-[#FF5566] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 font-medium"
                style={{
                  fontSize: `${1.25 + noHoverCount * 0.15}rem`,
                  padding: `${1.5 + noHoverCount * 0.2}rem ${3 + noHoverCount * 0.3}rem`,
                  transform: `scale(${1 + noHoverCount * 0.1})`,
                }}
              >
                Yes! 💖
              </Button>

              {/* No Button (runs away) */}
              <Button
                ref={noButtonRef}
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoTouch}
                variant="outline"
                size="lg"
                className="absolute bg-white/80 hover:bg-white/90 text-[#8B2635] border-2 border-[#E8B4B8] text-xl px-12 py-6 rounded-full shadow-lg font-medium"
                style={{
                  left: `${noButtonPosition.x}px`,
                  top: `${noButtonPosition.y}px`,
                  transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  pointerEvents: isMoving ? 'none' : 'auto'
                }}
              >
                No
              </Button>
            </div>

            <p className="mt-12 text-[#8B2635]/70 text-lg italic">
              Hover over "No" if you dare... 😉
            </p>
          </div>
        ) : (
          <div className="animate-scale-in">
            {/* Acceptance message */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
              <div className="mb-6">
                <Heart className="text-[#FF6B7A] mx-auto animate-heartbeat" size={80} fill="currentColor" />
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold mb-6 text-[#FF6B7A] animate-pulse">
                Yay! 🎉
              </h1>
              
              <p className="text-2xl md:text-3xl text-[#8B2635] mb-4 font-medium">
                You've made me the happiest!
              </p>
              
              <p className="text-xl text-[#8B2635]/80 italic">
                Happy Valentine's Day! 💕
              </p>

              {/* Decorative hearts */}
              <div className="flex justify-center gap-3 mt-8">
                {[...Array(5)].map((_, i) => (
                  <Heart 
                    key={i}
                    className="text-[#FF6B7A] animate-bounce" 
                    size={24} 
                    fill="currentColor"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.1);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.15);
          }
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        .confetti-piece {
          position: absolute;
          top: -10%;
          font-size: 2rem;
          animation: confetti-fall 3s linear forwards;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
