'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function HowSection() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    {
      number: '01',
      title: 'CAPTURE',
      description: 'Upload proof of your impossible combo, clutch play, or creative exploit.',
      tags: ['Raw Footage']
    },
    {
      number: '02',
      title: 'MINT',
      description: 'Record the moment permanently on-chain as a unique Performance Asset.',
      tags: ['Immutable']
    },
    {
      number: '03',
      title: 'CHALLENGE',
      description: 'If no one replicates it after 1,000 tries, it gains Elite Status.',
      tags: ['Relic Vault']
    }
  ];

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#dbe3eb]">
            From Epic Moment to Eternal Exhibit
          </h2>
        </div>

        {/* Desktop Grid - Shows all steps expanded */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-6 sm:p-8 bg-[#1b1e26] border-t-4 border-[#5ecde3] rounded-lg"
              style={{
                boxShadow: '0 10px 20px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)'
              }}
            >
              {/* Step Number */}
              <div
                className="absolute top-2 right-4 text-5xl sm:text-6xl font-bold"
                style={{
                  color: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                {step.number}
              </div>

              {/* Content */}
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-[#dbe3eb] uppercase">
                {step.title}
              </h3>

              <p className="text-sm sm:text-base text-[#7a8699] mb-4 leading-relaxed">
                {step.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {step.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 text-xs rounded border border-[#9d72ff] text-[#9d72ff] bg-[rgba(157,114,255,0.1)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Accordion - Collapsible steps */}
        <div className="md:hidden space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="bg-[#1b1e26] border border-[#232730] rounded-lg overflow-hidden">
              {/* Accordion Header */}
              <button
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                className="w-full p-4 flex items-center justify-between hover:bg-[#232730] transition"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-[rgba(255,255,255,0.1)]">
                    {step.number}
                  </span>
                  <h3 className="text-base font-bold text-[#dbe3eb] uppercase text-left">
                    {step.title}
                  </h3>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-[#5ecde3] flex-shrink-0 transition-transform ${
                    expandedStep === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Accordion Content */}
              {expandedStep === index && (
                <div className="px-4 pb-4 pt-2 border-t border-[#232730] bg-[rgba(26,30,38,0.5)]">
                  <p className="text-sm text-[#7a8699] mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs rounded border border-[#9d72ff] text-[#9d72ff] bg-[rgba(157,114,255,0.1)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
