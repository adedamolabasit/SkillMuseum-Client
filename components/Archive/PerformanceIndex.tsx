'use client';

import React, { useState } from 'react';
import { PerformanceIndexProps } from '@/shared/types/archive';

export const PerformanceIndex: React.FC<PerformanceIndexProps> = ({ artifacts }) => {
  const [sortBy, setSortBy] = useState<'score' | 'endorsements' | 'replications'>('score');

  const sortedArtifacts = [...artifacts]
    .filter(a => a.curatorScore > 0)
    .sort((a, b) => {
      switch (sortBy) {
        case 'endorsements':
          return b.endorsements - a.endorsements;
        case 'replications':
          return b.successfulReplications - a.successfulReplications;
        case 'score':
        default:
          return b.curatorScore - a.curatorScore;
      }
    })
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6">
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] uppercase mb-2"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          PERFORMANCE INDEX
        </h1>
        <p className="text-[#8fa0b3] text-sm">The greatest performances ranked by curator consensus.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['score', 'endorsements', 'replications'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={`px-4 py-2 text-xs font-bold rounded transition-all ${
              sortBy === option
                ? 'text-[#000] bg-[#98dc48] border border-[#98dc48]'
                : 'text-[#8fa0b3] bg-[#1b1e26] border border-[#232730] hover:border-[#5ecde3]'
            }`}
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6rem' }}
          >
            {option === 'score' && 'Curator Score'}
            {option === 'endorsements' && 'Endorsements'}
            {option === 'replications' && 'Replications'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#232730]">
              <th className="text-left py-3 px-4 text-xs text-[#7a8699] font-mono">RANK</th>
              <th className="text-left py-3 px-4 text-xs text-[#7a8699] font-mono">PERFORMANCE</th>
              <th className="text-left py-3 px-4 text-xs text-[#7a8699] font-mono">CREATOR</th>
              <th className="text-center py-3 px-4 text-xs text-[#7a8699] font-mono">SCORE</th>
              <th className="text-center py-3 px-4 text-xs text-[#7a8699] font-mono">ENDORSEMENTS</th>
              <th className="text-center py-3 px-4 text-xs text-[#7a8699] font-mono">REPS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232730]">
            {sortedArtifacts.map((artifact, index) => {
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
              return (
                <tr
                  key={artifact.id}
                  className="hover:bg-[#1b1e26] transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-bold text-[#98dc48]">{medal}</td>
                  <td className="py-3 px-4">
                    <p className="text-xs text-[#dbe3eb] font-bold truncate">{artifact.title}</p>
                    <p className="text-xs text-[#7a8699]">{artifact.game}</p>
                  </td>
                  <td className="py-3 px-4 text-xs text-[#8fa0b3] font-mono truncate">
                    {artifact.creator}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[#98dc48] font-bold text-sm">{artifact.curatorScore}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[#f2c94c] font-bold text-sm">{artifact.endorsements}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[#5ecde3] font-bold text-sm">{artifact.successfulReplications}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedArtifacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#8fa0b3] text-sm">No performances to display.</p>
        </div>
      )}
    </div>
  );
};
