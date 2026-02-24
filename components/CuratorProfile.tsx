'use client';

import React, { useState } from 'react';
import { useArchive } from '@/lib/archive-context';
import { ArchiveCard } from './ArchiveCard';

export const CuratorProfile: React.FC = () => {
  const { curator, artifacts } = useArchive();
  const [activeTab, setActiveTab] = useState<'stored' | 'endorsed'>('stored');

  if (!curator) {
    return (
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-12 text-center">
        <p className="text-[#8fa0b3] text-sm">Please sign in to view your curator profile.</p>
      </div>
    );
  }

  const curatorArtifacts = artifacts.filter(a => a.creator === curator.name);
  const stats = {
    totalStored: curatorArtifacts.length,
    totalEndorsements: curatorArtifacts.reduce((sum, a) => sum + a.endorsements, 0),
    avgScore: curatorArtifacts.length > 0 
      ? (curatorArtifacts.reduce((sum, a) => sum + a.curatorScore, 0) / curatorArtifacts.length).toFixed(1)
      : '0',
    topPerformance: curatorArtifacts.length > 0 
      ? curatorArtifacts.reduce((max, a) => a.curatorScore > max.curatorScore ? a : max)
      : null
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-[#1b1e26] border-2 border-[#98dc48] rounded-lg p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#98dc48] to-[#5ecde3] flex items-center justify-center">
            <span className="text-3xl font-bold text-[#000]">{curator.name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] uppercase mb-2"
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              {curator.name}
            </h1>
            <p className="text-[#8fa0b3] text-sm mb-3">
              {curator.bio || 'Master of performance. Keeper of moments. Legend in the making.'}
            </p>
            <div className="text-xs text-[#7a8699] font-mono">
              Member since {new Date(curator.joinedDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0f1116] border border-[#232730] rounded-lg p-4 text-center">
            <p className="text-[#7a8699] text-xs font-mono mb-1">ENDORSEMENT POWER</p>
            <p className="text-[#98dc48] text-2xl font-bold">{curator.endorsementPower}</p>
          </div>
          <div className="bg-[#0f1116] border border-[#232730] rounded-lg p-4 text-center">
            <p className="text-[#7a8699] text-xs font-mono mb-1">STORED</p>
            <p className="text-[#5ecde3] text-2xl font-bold">{stats.totalStored}</p>
          </div>
          <div className="bg-[#0f1116] border border-[#232730] rounded-lg p-4 text-center">
            <p className="text-[#7a8699] text-xs font-mono mb-1">TOTAL ENDORSEMENTS</p>
            <p className="text-[#f2c94c] text-2xl font-bold">{stats.totalEndorsements}</p>
          </div>
          <div className="bg-[#0f1116] border border-[#232730] rounded-lg p-4 text-center">
            <p className="text-[#7a8699] text-xs font-mono mb-1">AVG SCORE</p>
            <p className="text-[#9d72ff] text-2xl font-bold">{stats.avgScore}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-[#232730]">
        {(['stored', 'endorsed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-bold text-sm uppercase transition-all ${
              activeTab === tab
                ? 'text-[#98dc48] border-b-2 border-[#98dc48]'
                : 'text-[#8fa0b3] hover:text-[#dbe3eb]'
            }`}
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7rem' }}
          >
            {tab === 'stored' ? `Stored (${stats.totalStored})` : 'Endorsed'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'stored' ? (
          curatorArtifacts.length > 0 ? (
            <div className="space-y-6">
              {/* Top Performance Highlight */}
              {stats.topPerformance && (
                <div className="bg-gradient-to-r from-[#98dc48]20 to-[#5ecde3]20 border-2 border-[#98dc48] rounded-lg p-6">
                  <p className="text-[#98dc48] text-xs font-bold mb-2 uppercase" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.65rem' }}>
                    Your Top Performance
                  </p>
                  <h3 className="text-xl font-bold text-[#dbe3eb] mb-2">{stats.topPerformance.title}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[#7a8699] text-xs font-mono">Score</p>
                      <p className="text-[#98dc48] font-bold">{stats.topPerformance.curatorScore}</p>
                    </div>
                    <div>
                      <p className="text-[#7a8699] text-xs font-mono">Endorsements</p>
                      <p className="text-[#f2c94c] font-bold">{stats.topPerformance.endorsements}</p>
                    </div>
                    <div>
                      <p className="text-[#7a8699] text-xs font-mono">Status</p>
                      <p className="text-[#5ecde3] font-bold text-sm">{stats.topPerformance.status}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stored Artifacts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {curatorArtifacts.map((artifact) => (
                  <ArchiveCard key={artifact.id} artifact={artifact} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#1b1e26] border-2 border-dashed border-[#232730] rounded-lg p-12 text-center">
              <p
                className="text-[#8fa0b3] text-sm mb-2"
                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8rem' }}
              >
                NO ARTIFACTS STORED YET
              </p>
              <p className="text-[#7a8699] text-xs">Submit your first performance to get started!</p>
            </div>
          )
        ) : (
          <div className="bg-[#1b1e26] border-2 border-dashed border-[#232730] rounded-lg p-12 text-center">
            <p
              className="text-[#8fa0b3] text-sm mb-2"
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8rem' }}
            >
              ENDORSED ARTIFACTS
            </p>
            <p className="text-[#7a8699] text-xs">Your endorsements will appear here.</p>
          </div>
        )}
      </div>

      {/* Achievement Section */}
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6">
        <h2
          className="text-xl font-bold text-[#dbe3eb] uppercase mb-4"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Curator Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { icon: '📚', title: 'Archivist', desc: 'Stored 5 artifacts' },
            { icon: '⭐', title: 'Recognizer', desc: '50+ endorsements' },
            { icon: '🏆', title: 'Elite Curator', desc: 'Avg score 80+' },
            { icon: '👑', title: 'Legend', desc: 'Immortal artifact' }
          ].map((achievement, i) => (
            <div
              key={i}
              className="bg-[#0f1116] border border-[#232730] rounded-lg p-3 text-center opacity-50 hover:opacity-100 transition"
            >
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <p className="text-[#dbe3eb] text-xs font-bold">{achievement.title}</p>
              <p className="text-[#7a8699] text-xs mt-1">{achievement.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
