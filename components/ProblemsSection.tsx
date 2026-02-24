'use client';

export default function ProblemsSection() {
  const problems = [
    {
      icon: '✖',
      title: 'FADING CLIPS',
      description: 'Jaw-dropping feats vanish into random clips and forgotten feeds. Without ownership, viral moments are fleeting.'
    },
    {
      icon: '📉',
      title: 'FORGOTTEN LEADERBOARDS',
      description: 'High scores are reset. Servers shut down. Your grind evaporates into digital dust with no permanent record.'
    },
    {
      icon: '👾',
      title: 'INVISIBLE TALENT',
      description: 'Indie gamers and small studios struggle to spotlight true mechanics without big marketing budgets.'
    }
  ];

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-[#12141a] to-[#15171e]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-[#98dc48] uppercase tracking-widest">
            P1
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#dbe3eb] mb-4 uppercase">
            Hi-Score
          </h3>
          <p className="text-sm sm:text-base text-[#8fa0b3] max-w-2xl mx-auto">
            Iconic moments fade — unless you preserve them
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="p-6 sm:p-8 rounded-xl bg-[#1b1e26] border border-[#232730] hover:border-[#5ecde3] hover:shadow-[0_0_20px_rgba(94,205,227,0.1)] transition-all duration-300 text-center"
              style={{
                boxShadow: '-8px -8px 16px rgba(48, 54, 70, 0.5), 8px 8px 16px rgba(0, 0, 0, 0.8), inset 1px 1px 1px rgba(255,255,255,0.05)'
              }}
            >
              <div className="text-4xl sm:text-5xl mb-4">{problem.icon}</div>
              <h3
                className="text-lg sm:text-xl font-bold mb-3 text-[#dbe3eb] uppercase"
              >
                {problem.title}
              </h3>
              <p className="text-sm sm:text-base text-[#7a8699] leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Transition Text */}
        <div className="text-center mt-16 sm:mt-20 lg:mt-24">
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#f2c94c] uppercase">
            SkillMuseum™ changes that. Your performance becomes history you own.
          </p>
        </div>
      </div>
    </section>
  );
}
