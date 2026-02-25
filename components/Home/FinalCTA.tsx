'use client';
import { FinalCTAProps } from "@/shared/types/home";

export default function FinalCTA({ onSignUp }: FinalCTAProps) {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 border-t border-[#232730]">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg p-4 md:p-6 border border-[#232730] text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-[#dbe3eb]">
            Ready to Enter?
          </h2>

          <p className="text-sm md:text-base text-[#8fa0b3] mb-4">
            Store your performance. Join early access.
          </p>

          <button
            onClick={onSignUp}
            className="px-4 md:px-6 py-2 md:py-2.5 bg-[#98dc48] text-[#12141a] rounded-lg font-semibold hover:bg-[#7ec835] transition text-sm"
          >
            Enter Museum
          </button>
        </div>
      </div>
    </section>
  );
}
