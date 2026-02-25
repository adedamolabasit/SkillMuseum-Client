'use client';

import React, { useState } from 'react';

export const SubmitArtifact: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    game: '',
    description: '',
    videoUrl: '',
    tags: '',
    difficulty: 'Medium'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6">
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] uppercase mb-2"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          SUBMIT ARTIFACT
        </h1>
        <p className="text-[#8fa0b3] text-sm">
          Capture your greatest moment. Store it forever. Become a legend.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-[#8fa0b3] uppercase mb-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Performance Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="E.g., NO-HIT RUN (ANY%)"
            className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#232730] rounded text-[#dbe3eb] placeholder-[#7a8699] focus:border-[#98dc48] focus:outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8fa0b3] uppercase mb-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Game Title *
          </label>
          <input
            type="text"
            name="game"
            value={formData.game}
            onChange={handleChange}
            placeholder="E.g., CELESTE"
            className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#232730] rounded text-[#dbe3eb] placeholder-[#7a8699] focus:border-[#98dc48] focus:outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8fa0b3] uppercase mb-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us what makes this performance legendary. What's the story?"
            rows={4}
            className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#232730] rounded text-[#dbe3eb] placeholder-[#7a8699] focus:border-[#98dc48] focus:outline-none transition resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8fa0b3] uppercase mb-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Video URL (YouTube, Twitch, etc.) *
          </label>
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#232730] rounded text-[#dbe3eb] placeholder-[#7a8699] focus:border-[#98dc48] focus:outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8fa0b3] uppercase mb-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Difficulty Level
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#232730] rounded text-[#dbe3eb] focus:border-[#98dc48] focus:outline-none transition"
          >
            <option value="Easy">Easy - Achievable with practice</option>
            <option value="Medium">Medium - Challenging but possible</option>
            <option value="Hard">Hard - Elite tier skill required</option>
            <option value="Impossible">Impossible - Nearly unreplicable</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8fa0b3] uppercase mb-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="E.g., speedrun, no-hit, glitch, platformer"
            className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#232730] rounded text-[#dbe3eb] placeholder-[#7a8699] focus:border-[#98dc48] focus:outline-none transition"
          />
        </div>

        <div className="bg-[#1b1e26] border-2 border-[#5ecde3] rounded-lg p-4">
          <p className="text-[#5ecde3] text-xs font-bold mb-2" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.65rem' }}>
            HOW ARTIFACTS ARE SCORED
          </p>
          <ul className="text-[#8fa0b3] text-xs space-y-1">
            <li>• Curator Endorsements: Community votes on skill &amp; execution</li>
            <li>• Replication Attempts: How many try to match your performance</li>
            <li>• Time Preserved: Longevity in the Archive</li>
            <li>• Rarity Score: Uniqueness of the performance</li>
          </ul>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-4 bg-[#1b1e26] text-[#98dc48] border-2 border-[#5c852b] rounded-lg font-bold hover:shadow-lg transition"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '0.75rem',
            boxShadow: '-4px -4px 10px rgba(60, 70, 80, 0.3), 4px 4px 10px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(152, 220, 72, 0.1)'
          }}
        >
          STORE IN ARCHIVE
        </button>

        <p className="text-[#7a8699] text-xs text-center">
          By submitting, you agree that this performance will be permanently recorded on-chain.
        </p>
      </form>
    </div>
  );
};
