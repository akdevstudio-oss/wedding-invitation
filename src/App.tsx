/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { EnvelopeOpening } from './components/EnvelopeOpening';
import { CurtainReveal } from './components/CurtainReveal';
import { Navigation } from './components/Navigation';
import { RoyalInvitationCard } from './components/RoyalInvitationCard';
import { MusicControl } from './components/MusicControl';
import { PetalsCanvas } from './components/PetalsCanvas';
import { AdminPanel } from './components/AdminPanel';
import {
  EditableWeddingSettings,
  InvitedGuest,
  loadStoredSettings,
  loadStoredInvitedGuests,
  getDefaultSettings,
} from './data/weddingStore';

type AppStage = 'loading' | 'envelope' | 'curtain' | 'invitation';

export default function App() {
  const [stage, setStage] = useState<AppStage>('loading');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [settings, setSettings] = useState<EditableWeddingSettings>(getDefaultSettings());
  const [activeGuest, setActiveGuest] = useState<InvitedGuest | null>(null);

  useEffect(() => {
    setSettings(loadStoredSettings());

    // Check for ?invite=<slug> on initial load
    const loadedGuests: InvitedGuest[] = loadStoredInvitedGuests();
    const params = new URLSearchParams(window.location.search);
    const inviteSlug = params.get('invite');
    if (inviteSlug) {
      const match = loadedGuests.find(
        (g: InvitedGuest) => g.slug.toLowerCase() === inviteSlug.toLowerCase()
      );
      if (match) {
        setActiveGuest(match);
      }
    }
  }, []);

  const handleLoadingComplete = () => {
    setStage('envelope');
  };

  const handleEnvelopeComplete = () => {
    setStage('curtain');
  };

  const handleCurtainComplete = () => {
    setStage('invitation');
  };

  const handleDirectUnlock = () => {
    setStage('invitation');
  };

  const handleReplayIntro = () => {
    setStage('envelope');
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#44382F] relative selection:bg-[#D8C7AA] selection:text-[#44382F]">
      {/* 1. Loading Screen */}
      {stage === 'loading' && <LoadingScreen onLoaded={handleLoadingComplete} />}

      {/* 2. Realistic 3D Envelope Opening with Wax Seal */}
      {stage === 'envelope' && (
        <EnvelopeOpening
          guest={activeGuest}
          onComplete={handleEnvelopeComplete}
          onSkip={handleDirectUnlock}
        />
      )}

      {/* 3. Theatrical Curtain Sweep Reveal */}
      {stage === 'curtain' && (
        <CurtainReveal
          onComplete={handleCurtainComplete}
          onSkip={handleDirectUnlock}
        />
      )}

      {/* 4. Complete Streamlined Royal Invitation Card */}
      {(stage === 'curtain' || stage === 'invitation') && (
        <main className="relative">
          {/* Subtle Floating Petals & Gold Dust Background */}
          {settings.showPetals && <PetalsCanvas density={18} />}

          {/* Floating Audio Controller */}
          <MusicControl />

          {/* Streamlined Navigation Bar with Admin Trigger */}
          <Navigation onOpenAdmin={() => setIsAdminOpen(true)} />

          {/* Top Floating Controls (Replay + Admin Shortcut) */}
          <div className="fixed top-16 right-4 sm:right-6 z-30 flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(true)}
              type="button"
              className="text-[10px] font-serif uppercase tracking-widest text-[#B69A68] hover:text-[#44382F] bg-[#FDFBF7]/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#D8C7AA]/70 shadow-xs transition-colors cursor-pointer"
              title="Host Admin Panel: Guest Quotas & Settings"
            >
              Admin Panel
            </button>

            <button
              onClick={handleReplayIntro}
              type="button"
              className="hidden sm:block text-[10px] font-serif uppercase tracking-widest text-[#8D8174] hover:text-[#44382F] bg-[#FDFBF7]/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#D8C7AA]/50 shadow-xs transition-colors cursor-pointer"
              title="Re-open the 3D envelope and curtain reveal"
            >
              Replay Envelope
            </button>
          </div>

          {/* Consolidated Royal Invitation Card */}
          <RoyalInvitationCard
            settings={settings}
            onOpenAdmin={() => setIsAdminOpen(true)}
            activeGuestOverride={activeGuest}
          />

          {/* Host Admin Panel Modal */}
          <AdminPanel
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            onSettingsUpdated={(newSettings) => setSettings(newSettings)}
            onSelectActiveGuest={(guest) => {
              setActiveGuest(guest);
              setStage('invitation');
            }}
          />
        </main>
      )}
    </div>
  );
}
