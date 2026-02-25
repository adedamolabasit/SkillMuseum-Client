"use client";

import React, { useState } from "react";
import { CollectionsProps } from "@/shared/types/archive";

export const Collections: React.FC<CollectionsProps> = ({ artifacts }) => {
  const [selectedGame, setSelectedGame] = useState<string>("ALL");

  const games = ["ALL", ...new Set(artifacts.map((a) => a.game))];
  const filteredArtifacts =
    selectedGame === "ALL"
      ? artifacts
      : artifacts.filter((a) => a.game === selectedGame);

  const statsByGame = games.reduce(
    (acc, game) => {
      if (game === "ALL") return acc;
      const gameArtifacts = artifacts.filter((a) => a.game === game);
      acc[game] = {
        count: gameArtifacts.length,
        totalEndorsements: gameArtifacts.reduce(
          (sum, a) => sum + a.endorsements,
          0,
        ),
        avgScore:
          gameArtifacts.length > 0
            ? (
                gameArtifacts.reduce((sum, a) => sum + a.curatorScore, 0) /
                gameArtifacts.length
              ).toFixed(1)
            : "0",
      };
      return acc;
    },
    {} as Record<
      string,
      {
        count: number;
        totalEndorsements: number;
        avgScore: string;
      }
    >,
  );

  return (
    <div className="space-y-8">
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6">
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] uppercase mb-2"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          COLLECTIONS
        </h1>
        <p className="text-[#8fa0b3] text-sm">
          Browse performances by game. Discover what&apos;s epic in each universe.
        </p>
      </div>

      <div>
        <p
          className="text-xs font-bold text-[#8fa0b3] uppercase mb-3"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Select Game
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {games.map((game) => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`px-3 py-3 text-xs font-bold rounded transition-all text-center ${
                selectedGame === game
                  ? "text-[#000] bg-[#98dc48] border-2 border-[#98dc48]"
                  : "text-[#8fa0b3] bg-[#1b1e26] border-2 border-[#232730] hover:border-[#5ecde3]"
              }`}
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "0.6rem",
              }}
            >
              {game}
            </button>
          ))}
        </div>
      </div>

      {selectedGame !== "ALL" && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1b1e26] border border-[#232730] rounded-lg p-4 text-center">
            <p className="text-[#7a8699] text-xs font-mono mb-1">STORED</p>
            <p className="text-[#98dc48] text-2xl font-bold">
              {statsByGame[selectedGame]?.count || 0}
            </p>
          </div>
          <div className="bg-[#1b1e26] border border-[#232730] rounded-lg p-4 text-center">
            <p className="text-[#7a8699] text-xs font-mono mb-1">AVG SCORE</p>
            <p className="text-[#5ecde3] text-2xl font-bold">
              {statsByGame[selectedGame]?.avgScore || "0"}
            </p>
          </div>
          <div className="bg-[#1b1e26] border border-[#232730] rounded-lg p-4 text-center">
            <p className="text-[#7a8699] text-xs font-mono mb-1">
              ENDORSEMENTS
            </p>
            <p className="text-[#f2c94c] text-2xl font-bold">
              {statsByGame[selectedGame]?.totalEndorsements || 0}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {selectedGame === "ALL" ? (
          games
            .filter((g) => g !== "ALL")
            .map((game) => (
              <div
                key={game}
                className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6 cursor-pointer hover:border-[#98dc48] transition-all"
                onClick={() => setSelectedGame(game)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3
                    className="text-xl font-bold text-[#dbe3eb] uppercase"
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: "1rem",
                    }}
                  >
                    {game}
                  </h3>
                  <span className="text-[#98dc48] font-bold text-lg">→</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[#7a8699] text-xs font-mono mb-1">
                      STORED
                    </p>
                    <p className="text-[#98dc48] text-xl font-bold">
                      {statsByGame[game]?.count || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7a8699] text-xs font-mono mb-1">
                      AVG SCORE
                    </p>
                    <p className="text-[#5ecde3] text-xl font-bold">
                      {statsByGame[game]?.avgScore || "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7a8699] text-xs font-mono mb-1">
                      ENDORSEMENTS
                    </p>
                    <p className="text-[#f2c94c] text-xl font-bold">
                      {statsByGame[game]?.totalEndorsements || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="bg-[#1b1e26] border border-[#232730] rounded-lg p-4"
              >
                <h4 className="text-sm font-bold text-[#dbe3eb] mb-2 line-clamp-2">
                  {artifact.title}
                </h4>
                <p className="text-xs text-[#7a8699] mb-3">
                  By {artifact.creator}
                </p>
                <div className="flex justify-between text-xs">
                  <span className="text-[#98dc48]">
                    Score: {artifact.curatorScore}
                  </span>
                  <span className="text-[#f2c94c]">
                    +{artifact.endorsements}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedGame !== "ALL" && filteredArtifacts.length === 0 && (
        <div className="bg-[#1b1e26] border-2 border-dashed border-[#232730] rounded-lg p-12 text-center">
          <p className="text-[#8fa0b3] text-sm">
            No performances found for this game.
          </p>
        </div>
      )}
    </div>
  );
};
