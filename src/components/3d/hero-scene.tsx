'use client';

import { useState, useEffect } from 'react';

// Luxury static fallback - a CSS-animated version
function StaticHeroFallback() {
  return (
    <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center relative overflow-hidden">
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-primary/10 animate-[spin_20s_linear_infinite]" />
        <div className="absolute w-48 h-48 md:w-60 md:h-60 rounded-full border border-primary/20 animate-[spin_15s_linear_infinite_reverse]" />
        <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border border-primary/30 animate-[spin_10s_linear_infinite]" />
      </div>
      
      {/* Floating particles effect using CSS */}
      <div className="absolute inset-0">
        {Array.from({length: 20}).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${10 + (i * 4.2) % 80}%`,
              top: `${10 + (i * 3.7) % 80}%`,
              animation: `float ${3 + (i % 4)}s ease-in-out ${i * 0.3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Center house icon */}
      <div className="relative z-10 text-center">
        <div className="h-24 w-24 md:h-32 md:w-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center backdrop-blur-sm animate-float">
          <svg viewBox="0 0 40 40" fill="none" className="h-12 w-12 md:h-16 md:w-16 text-primary" aria-label="DwellScan">
            <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 28V16L20 10L28 16V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="17" y="21" width="6" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="20" cy="15" r="2" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
          </svg>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="text-[10px] font-medium text-primary/60 tracking-[0.3em] uppercase">AI-Powered</span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        <p className="text-sm text-muted-foreground">Property Analysis</p>
      </div>
    </div>
  );
}

// Try to load 3D scene dynamically with full error handling
function ThreeScene() {
  const [SceneComponent, setSceneComponent] = useState<React.ComponentType | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    // Try to dynamically import the 3D scene
    import('./three-scene')
      .then((mod) => {
        if (mounted) {
          setSceneComponent(() => mod.default);
        }
      })
      .catch((err) => {
        console.warn('3D scene failed to load:', err);
        if (mounted) {
          setLoadFailed(true);
        }
      });

    return () => { mounted = false; };
  }, []);

  if (loadFailed || !SceneComponent) {
    return <StaticHeroFallback />;
  }

  return <SceneComponent />;
}

export default function HeroScene() {
  const [use3D, setUse3D] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Only try 3D if WebGL is available
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        setUse3D(true);
      }
    } catch {
      setError(true);
    }
  }, []);

  if (error || !use3D) {
    return (
      <div className="relative">
        <StaticHeroFallback />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="relative">
      <ThreeScene />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
