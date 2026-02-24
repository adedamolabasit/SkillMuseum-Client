'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProblemsSection from '@/components/ProblemsSection';
import HowSection from '@/components/HowSection';
import CommunitySection from '@/components/CommunitySection';
import IndieSection from '@/components/IndieSection';
import FinalCTA from '@/components/FinalCTA';
import AuthModal from '@/components/AuthModal';
import CRTOverlay from '@/components/CRTOverlay';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');

  return (
    <div className="relative w-full overflow-hidden">
      <CRTOverlay />
      <Header onSignIn={() => {
        setActiveTab('signin');
        setIsModalOpen(true);
      }} onSignUp={() => {
        setActiveTab('signup');
        setIsModalOpen(true);
      }} />
      
      <main className="relative">
        <Hero onSignUp={() => {
          setActiveTab('signup');
          setIsModalOpen(true);
        }} />
        <ProblemsSection />
        <HowSection />
        <CommunitySection />
        <IndieSection />
        <FinalCTA onSignUp={() => {
          setActiveTab('signup');
          setIsModalOpen(true);
        }} />
      </main>

      <AuthModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
