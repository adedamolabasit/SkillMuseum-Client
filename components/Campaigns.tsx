'use client';

import React, { useState } from 'react';
import { Campaign } from '@/lib/archive-types';

interface CampaignsProps {
  campaigns?: Campaign[];
}

export const Campaigns: React.FC<CampaignsProps> = ({ campaigns = [] }) => {
  const [selectedStatus, setSelectedStatus] = useState<'ACTIVE' | 'TRENDING' | 'ARCHIVED'>('ACTIVE');

  // Mock campaigns if none provided
  const mockCampaigns: Campaign[] = campaigns.length > 0 ? campaigns : [
    {
      id: '1',
      title: 'CELESTE SPEEDRUN',
      game: 'CELESTE',
      description: 'Complete Celeste any% run under 20 minutes. Show us your mastery.',
      status: 'ACTIVE',
      entries: 12,
      createdBy: 'SpeedRunStudio'
    },
    {
      id: '2',
      title: 'HOLLOW KNIGHT PATH OF PAIN',
      game: 'HOLLOW KNIGHT',
      description: 'Path of Pain no-hit challenge. Can you achieve perfection?',
      status: 'TRENDING',
      entries: 45,
      createdBy: 'IndieGames Inc'
    },
    {
      id: '3',
      title: 'DARK SOULS SEQUENCE BREAK',
      game: 'DARK SOULS',
      description: 'Find the most creative sequence breaks in any area.',
      status: 'ACTIVE',
      entries: 28,
      createdBy: 'ChallengeCreators'
    },
    {
      id: '4',
      title: 'NEON ABYSS GLITCH',
      game: 'NEON ABYSS',
      description: 'Discover and showcase game-breaking glitches responsibly.',
      status: 'TRENDING',
      entries: 67,
      createdBy: 'GlitchMasters'
    }
  ];

  const filteredCampaigns = mockCampaigns.filter(c => c.status === selectedStatus);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6">
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] uppercase mb-2"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          CAMPAIGNS
        </h1>
        <p className="text-[#8fa0b3] text-sm">
          Special exhibitions. Community challenges. Prove your skill and make history.
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['ACTIVE', 'TRENDING', 'ARCHIVED'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 text-xs font-bold rounded transition-all ${
              selectedStatus === status
                ? 'text-[#000] bg-[#98dc48] border border-[#98dc48]'
                : 'text-[#8fa0b3] bg-[#1b1e26] border border-[#232730] hover:border-[#5ecde3]'
            }`}
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6rem' }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg overflow-hidden hover:border-[#5ecde3] transition-all cursor-pointer group"
          >
            {/* Status Badge */}
            <div
              className={`px-4 py-2 text-xs font-bold uppercase text-center text-white ${
                campaign.status === 'ACTIVE'
                  ? 'bg-[#98dc48]'
                  : campaign.status === 'TRENDING'
                  ? 'bg-[#f2c94c]'
                  : 'bg-[#7a8699]'
              }`}
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.55rem' }}
            >
              {campaign.status}
            </div>

            {/* Content */}
            <div className="p-5">
              <h3
                className="text-lg font-bold text-[#dbe3eb] uppercase mb-2 line-clamp-2"
                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.9rem' }}
              >
                {campaign.title}
              </h3>

              <p className="text-[#8fa0b3] text-xs mb-3 line-clamp-2">
                {campaign.description}
              </p>

              <div className="bg-[#0f1116] rounded p-3 mb-4 border border-[#232730]">
                <p className="text-[#7a8699] text-xs font-mono mb-1">GAME</p>
                <p className="text-[#dbe3eb] font-bold text-sm">{campaign.game}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#0f1116] rounded p-3 border border-[#232730]">
                  <p className="text-[#7a8699] text-xs font-mono">ENTRIES</p>
                  <p className="text-[#98dc48] font-bold text-lg">{campaign.entries}</p>
                </div>
                <div className="bg-[#0f1116] rounded p-3 border border-[#232730]">
                  <p className="text-[#7a8699] text-xs font-mono">CURATOR</p>
                  <p className="text-[#5ecde3] font-bold text-xs truncate">{campaign.createdBy}</p>
                </div>
              </div>

              <button
                className="w-full px-3 py-2 bg-[#1b1e26] text-[#98dc48] border-2 border-[#5c852b] rounded font-bold text-xs hover:shadow-lg transition group-hover:shadow-[0_0_10px_rgba(152,220,72,0.3)]"
                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6rem' }}
              >
                VIEW SUBMISSIONS
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="bg-[#1b1e26] border-2 border-dashed border-[#232730] rounded-lg p-12 text-center">
          <p
            className="text-[#8fa0b3] text-sm mb-2"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8rem' }}
          >
            NO {selectedStatus} CAMPAIGNS
          </p>
          <p className="text-[#7a8699] text-xs">Check back soon for more epic challenges.</p>
        </div>
      )}
    </div>
  );
};
