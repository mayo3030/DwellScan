'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer() {
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Show button immediately, load audio in background
    setIsReady(true);
    
    try {
      const audio = new Audio('/ambient.mp3');
      audio.loop = true;
      audio.volume = 0.15;
      audio.preload = 'auto';
      audioRef.current = audio;
    } catch (e) {
      console.warn('Audio init failed:', e);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked — normal browser behavior
      });
    } else {
      audioRef.current.pause();
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  if (!isReady) return null;

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 backdrop-blur-xl px-4 py-2.5 shadow-lg shadow-primary/5 transition-all duration-500 hover:border-primary/40 hover:shadow-primary/10"
      aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
    >
      {/* Sound wave visualization bars */}
      <div className="flex items-center gap-[2px] h-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-[2px] rounded-full transition-all duration-300 ${
              isMuted
                ? 'h-1 bg-muted-foreground/40'
                : 'bg-primary animate-sound-bar'
            }`}
            style={{
              animationDelay: isMuted ? '0s' : `${i * 0.15}s`,
              height: isMuted ? '4px' : undefined,
            }}
          />
        ))}
      </div>

      {/* Icon */}
      {isMuted ? (
        <VolumeX className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
      ) : (
        <Volume2 className="h-4 w-4 text-primary" />
      )}

      {/* Label */}
      <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground group-hover:text-foreground transition-colors">
        {isMuted ? 'Sound Off' : 'Sound On'}
      </span>
    </button>
  );
}
