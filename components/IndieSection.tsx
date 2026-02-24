'use client';

export default function IndieSection() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Content */}
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 text-[#dbe3eb]">
              For Indie Creators
            </h2>

            <p className="text-sm md:text-base text-[#8fa0b3] mb-4">
              Launch campaigns and showcase your game's mechanics.
            </p>

            <button className="px-4 md:px-6 py-2 md:py-2.5 bg-[#98dc48] text-[#12141a] rounded-lg font-semibold hover:bg-[#7ec835] transition text-sm w-full md:w-auto">
              Learn More
            </button>
          </div>

          {/* Featured Campaigns - Minimal */}
          <div className="hidden lg:flex gap-3">
            <div className="flex-1 bg-[#1b1e26] border border-[#232730] rounded-lg p-3">
              <h3 className="text-xs font-bold text-[#dbe3eb]">Celeste</h3>
              <p className="text-xs text-[#7a8699]">Active</p>
            </div>
            <div className="flex-1 bg-[#1b1e26] border border-[#232730] rounded-lg p-3">
              <h3 className="text-xs font-bold text-[#dbe3eb]">Hollow Knight</h3>
              <p className="text-xs text-[#7a8699]">Trending</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
