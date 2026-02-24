'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Heart, Share2, Flag } from 'lucide-react';
import { useArchive } from '@/lib/archive-context';
import { STATUS_CONFIG } from '@/lib/archive-types';
import CRTOverlay from '@/components/CRTOverlay';

export default function AssetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { artifacts } = useArchive();
  const [isEndorsing, setIsEndorsing] = useState(false);
  const [endorsementCount, setEndorsementCount] = useState(0);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeComment, setChallengeComment] = useState('');

  const artifact = artifacts.find(a => a.id === params.id);

  if (!artifact) {
    return (
      <div className="min-h-screen bg-[#12141a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8fa0b3] mb-4">Artifact not found</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#98dc48] text-[#000] rounded font-bold hover:shadow-lg transition"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7rem' }}
          >
            BACK
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[artifact.status];
  const replicationRate = artifact.replicationAttempts > 0 
    ? ((artifact.successfulReplications / artifact.replicationAttempts) * 100).toFixed(1)
    : '0.0';

  const handleEndorse = () => {
    setIsEndorsing(true);
    setEndorsementCount(endorsementCount + 1);
    setTimeout(() => setIsEndorsing(false), 500);
  };

  const handleChallenge = () => {
    if (challengeComment.trim()) {
      console.log('[v0] Challenge submitted:', { artifactId: artifact.id, comment: challengeComment });
      setChallengeComment('');
      setShowChallenge(false);
      alert('Challenge submitted! The community will attempt to replicate this performance.');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/archive/${artifact.id}`;
    if (navigator.share) {
      navigator.share({
        title: artifact.title,
        text: `Check out this legendary performance: ${artifact.title}`,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#12141a] text-[#dbe3eb]">
      <CRTOverlay />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#12141a] border-b border-[#232730] py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 bg-[#1b1e26] border border-[#232730] rounded hover:border-[#98dc48] transition"
          >
            <ArrowLeft size={16} />
            <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.6rem' }}>BACK</span>
          </button>
          <h1 style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8rem' }} className="text-center flex-1">
            ARTIFACT DETAILS
          </h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 pb-12">
        {/* Status Badge */}
        <div
          className="inline-block px-4 py-2 rounded mb-6 text-xs font-bold uppercase text-center"
          style={{
            backgroundColor: statusConfig.bgColor,
            color: statusConfig.color,
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '0.65rem',
            textShadow: `0 0 5px ${statusConfig.color}40`
          }}
        >
          {statusConfig.label}
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 
            className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] mb-3 leading-tight text-balance"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            {artifact.title}
          </h1>
          <p className="text-[#8fa0b3] text-sm leading-relaxed">
            {artifact.description}
          </p>
        </div>

        {/* Video Player Section */}
        {artifact.videoUrl && (
          <div className="mb-8 bg-[#1b1e26] border-2 border-[#232730] rounded-lg overflow-hidden">
            <div className="relative w-full aspect-video bg-black">
              <video
                src={artifact.videoUrl}
                controls
                controlsList="nodownload"
                className="w-full h-full"
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            <div className="p-4 sm:p-6 border-t border-[#232730]">
              <p className="text-xs text-[#7a8699] font-mono mb-2">PERFORMANCE RECORDING</p>
              <p className="text-sm text-[#8fa0b3]">
                This is the official recording of this legendary performance. Watch carefully to understand what makes this moment unreplicable.
              </p>
            </div>
          </div>
        )}

        {/* Creator Info */}
        <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-[#7a8699] font-mono mb-1">CREATOR</p>
              <p className="text-[#dbe3eb] font-bold text-sm">{artifact.creator}</p>
            </div>
            <div>
              <p className="text-xs text-[#7a8699] font-mono mb-1">GAME</p>
              <p className="text-[#dbe3eb] font-bold text-sm">{artifact.game}</p>
            </div>
            <div>
              <p className="text-xs text-[#7a8699] font-mono mb-1">ARTIFACT ID</p>
              <p className="text-[#98dc48] font-bold text-sm font-mono">{artifact.id}</p>
            </div>
            <div>
              <p className="text-xs text-[#7a8699] font-mono mb-1">STORED</p>
              <p className="text-[#dbe3eb] font-bold text-sm">{artifact.storedAt.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1b1e26] border-2 border-[#98dc48] border-opacity-30 rounded-lg p-4">
            <p className="text-xs text-[#7a8699] font-mono mb-2">CURATOR SCORE</p>
            <p className="text-3xl font-bold text-[#98dc48]">{artifact.curatorScore}</p>
            <p className="text-xs text-[#8fa0b3] mt-1">Community endorsements</p>
          </div>
          
          <div className="bg-[#1b1e26] border-2 border-[#5ecde3] border-opacity-30 rounded-lg p-4">
            <p className="text-xs text-[#7a8699] font-mono mb-2">REPLICATION RATE</p>
            <p className="text-3xl font-bold text-[#5ecde3]">{replicationRate}%</p>
            <p className="text-xs text-[#8fa0b3] mt-1">{artifact.successfulReplications} / {artifact.replicationAttempts} successful</p>
          </div>
          
          <div className="bg-[#1b1e26] border-2 border-[#f2c94c] border-opacity-30 rounded-lg p-4">
            <p className="text-xs text-[#7a8699] font-mono mb-2">ENDORSEMENTS</p>
            <p className="text-3xl font-bold text-[#f2c94c]">{artifact.endorsements + endorsementCount}</p>
            <p className="text-xs text-[#8fa0b3] mt-1">Curator votes</p>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <p className="text-xs text-[#7a8699] font-mono mb-3" style={{ fontFamily: "'Press Start 2P', cursive" }}>TAGS</p>
          <div className="flex flex-wrap gap-2">
            {artifact.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-3 py-2 bg-[#232730] text-[#5ecde3] rounded border border-[#5ecde3] font-mono hover:bg-[#5ecde3] hover:text-[#000] transition cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-0 sm:flex gap-3 mb-8">
          <button
            onClick={handleEndorse}
            disabled={isEndorsing}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1b1e26] text-[#98dc48] border-2 border-[#5c852b] rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '0.7rem',
              boxShadow: '-4px -4px 10px rgba(60, 70, 80, 0.3), 4px 4px 10px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(152, 220, 72, 0.1)'
            }}
          >
            <Heart size={16} className={isEndorsing ? 'fill-current' : ''} />
            ENDORSE
          </button>

          <button
            onClick={() => setShowChallenge(!showChallenge)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1b1e26] text-[#f2c94c] border-2 border-[#f2c94c] border-opacity-50 rounded-lg font-bold hover:shadow-lg transition"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '0.7rem',
              boxShadow: '-4px -4px 10px rgba(60, 70, 80, 0.3), 4px 4px 10px rgba(0, 0, 0, 0.8)'
            }}
          >
            <Flag size={16} />
            CHALLENGE
          </button>

          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1b1e26] text-[#5ecde3] border-2 border-[#5ecde3] border-opacity-50 rounded-lg font-bold hover:shadow-lg transition"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: '0.7rem',
              boxShadow: '-4px -4px 10px rgba(60, 70, 80, 0.3), 4px 4px 10px rgba(0, 0, 0, 0.8)'
            }}
          >
            <Share2 size={16} />
            SHARE
          </button>
        </div>

        {/* Challenge Form */}
        {showChallenge && (
          <div className="bg-[#1b1e26] border-2 border-[#f2c94c] border-opacity-50 rounded-lg p-4 sm:p-6 mb-8">
            <h3 className="text-lg font-bold text-[#f2c94c] mb-3" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8rem' }}>
              CHALLENGE THIS PERFORMANCE
            </h3>
            <p className="text-sm text-[#8fa0b3] mb-4">
              Submit your evidence that you can replicate or exceed this performance. Video proof required.
            </p>
            
            <textarea
              value={challengeComment}
              onChange={(e) => setChallengeComment(e.target.value)}
              placeholder="Describe your challenge attempt and upload proof link..."
              className="w-full px-3 py-2 bg-[#0f1116] border border-[#232730] rounded text-[#dbe3eb] placeholder-[#7a8699] focus:border-[#f2c94c] focus:outline-none mb-4 text-sm"
              rows={4}
              style={{ resize: 'vertical' }}
            />

            <div className="flex gap-3">
              <button
                onClick={handleChallenge}
                disabled={!challengeComment.trim()}
                className="flex-1 px-4 py-2 bg-[#f2c94c] text-[#000] rounded font-bold hover:shadow-lg transition disabled:opacity-50"
                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.65rem' }}
              >
                SUBMIT CHALLENGE
              </button>
              <button
                onClick={() => setShowChallenge(false)}
                className="flex-1 px-4 py-2 bg-[#1b1e26] text-[#8fa0b3] border border-[#232730] rounded font-bold hover:border-[#8fa0b3] transition"
                style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.65rem' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Performance History */}
        <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-bold text-[#dbe3eb] mb-4" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8rem' }}>
            REPLICATION ATTEMPTS
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#0f1116] border border-[#232730] rounded text-sm">
              <span className="text-[#8fa0b3]">Total Attempts</span>
              <span className="text-[#98dc48] font-bold">{artifact.replicationAttempts}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0f1116] border border-[#232730] rounded text-sm">
              <span className="text-[#8fa0b3]">Successful Replications</span>
              <span className="text-[#5ecde3] font-bold">{artifact.successfulReplications}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0f1116] border border-[#232730] rounded text-sm">
              <span className="text-[#8fa0b3]">Curator Endorsements</span>
              <span className="text-[#f2c94c] font-bold">{artifact.endorsements + endorsementCount}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
