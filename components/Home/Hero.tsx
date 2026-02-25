'use client';

import { useState } from 'react';
import { HeroProps } from '@/shared/types/home';

export default function Hero({ onSignUp }: HeroProps) {
  const [hoverCard, setHoverCard] = useState(false);

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 overflow-hidden">
      <div
        className="fixed inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(152, 220, 72, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(152, 220, 72, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          animation: 'gridMove 20s linear infinite',
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col justify-center">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-[#dbe3eb]"
            >
              Every Move Is History. Own Your Performance.
            </h1>

            <p className="text-lg sm:text-xl text-[#8fa0b3] mb-8 max-w-lg leading-relaxed">
              Capture your most unreplicable gameplay moments and mint them as permanent performance assets. Get recognized by the community, claim your spotlight, and etch your legend into the SkillMuseum™ forever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onSignUp}
                className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-[#12141a] bg-[#98dc48] rounded-lg hover:bg-[#7ec835] transition duration-300 w-full sm:w-auto cursor-pointer"
              >
                Join The Beta
              </button>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 lg:h-96">
            <div
              className="relative w-full h-full rounded-2xl bg-[#1b1e26] border-4 border-[#2a2e38] overflow-hidden cursor-pointer transition-transform duration-500"
              style={{
                boxShadow: '-20px -20px 40px rgba(35, 40, 50, 0.3), 20px 20px 40px rgba(0,0,0,0.8), inset 0 0 0 4px #2a2e38',
                transform: hoverCard ? 'rotateY(0) rotateX(0)' : 'rotateY(-10deg) rotateX(5deg)',
                transformStyle: 'preserve-3d'
              }}
              onMouseEnter={() => setHoverCard(true)}
              onMouseLeave={() => setHoverCard(false)}
            >
              <div className="w-full h-full bg-[#000] flex items-center justify-center relative overflow-hidden border-2 border-[#333]">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(180deg, transparent 95%, rgba(94, 205, 227, 0.2) 95%), linear-gradient(90deg, transparent 95%, rgba(94, 205, 227, 0.2) 95%), #12141a',
                    backgroundSize: '40px 40px',
                  }}
                >
                  <div
                    className="w-16 h-20 sm:w-20 sm:h-24 bg-[#98dc48] rounded-sm"
                    style={{
                      boxShadow: '4px 4px 0 #004d00',
                      animation: 'idleBounce 1s infinite alternate'
                    }}
                  />
                </div>

                <div
                  className="absolute top-3 left-3 right-3 flex justify-between text-white text-xs sm:text-sm"
                  style={{ fontFamily: "'VT323', monospace" }}
                >
                  <span>LVL: 1</span>
                  <span>HP: 100%</span>
                </div>
              </div>

              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{
                  background: 'linear-gradient(90deg, #98dc48, transparent 20%, transparent 80%, #9d72ff)',
                  opacity: 0.7,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
