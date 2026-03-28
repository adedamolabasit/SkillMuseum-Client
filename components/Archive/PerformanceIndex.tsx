"use client";

import React, { useState, useMemo } from "react";
import { PerformanceIndexProps } from "@/shared/types/archive";
import { useVoteResults } from "@/shared/api/hooks/useVotes";

interface VoteItem {
  dataValues: {
    assetId: string;
    category: string;
    count?: number | string;
  };
  title: string;
  game?: string;
  creator: string;
  curatorScore?: number;
  endorsements?: number;
  successfulReplications?: number;
}

interface AggregatedResult {
  assetId: string;
  title: string;
  game: string;
  creator: string;
  count: number;
  perCategoryCounts?: Record<string, number>;
  curatorScore?: number;
  endorsements?: number;
  successfulReplications?: number;
}

const categoryColors = [
  "text-[#98dc48]",
  "text-[#b39ddb]",
  "text-[#f5a623]",
  "text-[#ff6b6b]",
  "text-[#5ecde18]",
];

export const PerformanceIndex: React.FC<PerformanceIndexProps> = ({}) => {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const { data: voteResult } = useVoteResults();

  const categories: string[] = useMemo(() => {
    if (!voteResult?.results) return [];
    return Array.from(
      new Set(voteResult.results.map((r: VoteItem) => r.dataValues.category)),
    );
  }, [voteResult]);

  const aggregatedResults: AggregatedResult[] = useMemo(() => {
    if (!voteResult?.results) return [];

    const lookup: Record<string, AggregatedResult> = {};

    voteResult.results.forEach((item: VoteItem) => {
      const assetId = item.dataValues.assetId;
      const category = item.dataValues.category;
      const count = Number(item.dataValues.count || 0);

      if (filterCategory && category !== filterCategory) return;

      if (!lookup[assetId]) {
        lookup[assetId] = {
          assetId,
          title: item.title,
          game: item.game || "",
          creator: item.creator,
          count,
          perCategoryCounts: filterCategory ? undefined : { [category]: count },
        };
      } else {
        lookup[assetId].count += count;

        if (!filterCategory) {
          if (!lookup[assetId].perCategoryCounts)
            lookup[assetId].perCategoryCounts = {};
          lookup[assetId].perCategoryCounts[category] =
            (lookup[assetId].perCategoryCounts[category] || 0) + count;
        }
      }
    });

    return Object.values(lookup).sort((a, b) => b.count - a.count);
  }, [voteResult, filterCategory]);

  return (
    <div className="space-y-6">
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6">
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] uppercase mb-2"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          PERFORMANCE INDEX
        </h1>
        <p className="text-[#8fa0b3] text-lg">
          The greatest performances ranked by curator consensus.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded transition-all ${
              filterCategory === cat
                ? "text-[#000] bg-[#98dc48] border border-[#98dc48]"
                : "text-[#8fa0b3] bg-[#1b1e26] border border-[#232730] hover:border-[#5ecde3] "
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => setFilterCategory(null)}
          className={`px-4 py-2 text-xs font-bold rounded transition-all ${
            filterCategory === null
              ? "text-[#000] bg-[#98dc48] border border-[#98dc48]"
              : "text-[#8fa0b3] bg-[#1b1e26] border border-[#232730] hover:border-[#5ecde3]"
          }`}
          style={{}}
        >
          All Categories
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#232730]">
              <th className="text-left py-3 px-4 text-xs text-[#7a8699] font-mono">
                RANK
              </th>
              <th className="text-left py-3 px-4 text-xs text-[#7a8699] font-mono">
                PERFORMANCE
              </th>
              <th className="text-left py-3 px-4 text-xs text-[#7a8699] font-mono">
                CREATOR
              </th>

              {filterCategory === null &&
                categories.map((cat, idx) => (
                  <th
                    key={cat}
                    className="text-center py-3 px-4 text-xs font-mono text-[#7a8699]"
                  >
                    {cat}
                  </th>
                ))}

              <th className="text-center py-3 px-4 text-xs text-[#7a8699] font-mono">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232730]">
            {aggregatedResults.map((artifact, index) => {
              const medal =
                index === 0
                  ? "🥇"
                  : index === 1
                    ? "🥈"
                    : index === 2
                      ? "🥉"
                      : `#${index + 1}`;
              return (
                <tr
                  key={artifact.assetId}
                  className="hover:bg-[#1b1e26] transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-bold text-[#98dc48]">
                    {medal}
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs text-[#dbe3eb] font-bold truncate">
                      {artifact.title}
                    </p>
                    <p className="text-xs text-[#7a8699]">{artifact.game}</p>
                  </td>
                  <td className="py-3 px-4  text-[#8fa0b3]  text-sm truncate">
                    {artifact.creator}
                  </td>

                  {filterCategory === null &&
                    categories.map((cat, idx) => (
                      <td
                        key={`${artifact.assetId}_${cat}`}
                        className={`py-3 px-4 text-center text-sm font-bold ${categoryColors[idx % categoryColors.length]}`}
                      >
                        {artifact.perCategoryCounts?.[cat] || 0}
                      </td>
                    ))}

                  <td className="py-3 px-4 text-center">
                    <span className="text-[#5ecde3] font-bold text-sm">
                      {artifact.count}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {aggregatedResults.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#8fa0b3] text-sm">No performances to display.</p>
        </div>
      )}
    </div>
  );
};
