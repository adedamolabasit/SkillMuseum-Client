'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { PerformanceArtifact, CuratorProfile, ArchiveContextType } from './archive-types';

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

export const ArchiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [curator, setCuratorState] = useState<CuratorProfile | null>(null);
  const [artifacts, setArtifactsState] = useState<PerformanceArtifact[]>([]);
  const [selectedArtifact, setSelectedArtifactState] = useState<PerformanceArtifact | null>(null);

  const setCurator = useCallback((curatorData: CuratorProfile) => {
    setCuratorState(curatorData);
    setIsAuthenticated(true);
  }, []);

  const setArtifacts = useCallback((newArtifacts: PerformanceArtifact[]) => {
    setArtifactsState(newArtifacts);
  }, []);

  const setSelectedArtifact = useCallback((artifact: PerformanceArtifact | null) => {
    setSelectedArtifactState(artifact);
  }, []);

  const value: ArchiveContextType = {
    isAuthenticated,
    curator,
    artifacts,
    selectedArtifact,
    setCurator,
    setArtifacts,
    setSelectedArtifact,
  };

  return (
    <ArchiveContext.Provider value={value}>
      {children}
    </ArchiveContext.Provider>
  );
};

export const useArchive = () => {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within ArchiveProvider');
  }
  return context;
};
