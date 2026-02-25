"use client";
import { votes } from "@/shared/mock";

export default function CommunitySection() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 bg-[#0f1116]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-[#dbe3eb]">
            Vote. Challenge. Immortalize.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {votes.map((vote, index) => (
            <div
              key={index}
              className={`relative bg-[#12141a] border rounded-lg p-4 md:p-6 ${
                index === 0 ? "border-[#f2c94c]" : "border-[#333]"
              }`}
            >
              {index === 0 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f2c94c] text-[#000] px-2 py-0.5 rounded text-xs font-semibold">
                  {vote.status}
                </div>
              )}

              <h3 className="text-sm md:text-base font-bold text-[#dbe3eb] mb-3 mt-1">
                {vote.title}
              </h3>

              <div className="h-2 bg-[#222] rounded border border-[#333] overflow-hidden mb-2">
                <div
                  className="h-full bg-[#98dc48]"
                  style={{
                    width: `${vote.percentage}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              <p className="text-xs text-[#8fa0b3]">
                {vote.percentage}% • {vote.votes} attempts
              </p>

              <button className="mt-3 w-full px-2 py-1.5 bg-[#98dc48] text-[#000] rounded font-bold text-xs hover:bg-[#7ec835] transition">
                Vote
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
