"use client";

import React, { createContext, useContext, useState } from "react";

interface ArtifactFormState {
  title: string;
  game: string;
  description: string;
  tags: string;
  difficulty: string;
  statusTier: string;
}

type ArtifactErrors = Partial<
  Record<keyof ArtifactFormState | "video", string>
>;

interface ContextType {
  form: ArtifactFormState;
  setForm: React.Dispatch<React.SetStateAction<ArtifactFormState>>;
  errors: ArtifactErrors;
  setErrors: React.Dispatch<React.SetStateAction<ArtifactErrors>>;

  videoFile: File | null;
  setVideoFile: React.Dispatch<React.SetStateAction<File | null>>;
  resetForm: () => void;
}

const ArtifactFormContext = createContext<ContextType | null>(null);

export const ArtifactFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const defaultState: ArtifactFormState = {
    title: "",
    game: "",
    description: "",
    tags: '',
    difficulty: "medium",
    statusTier: "Gallery Exhibit",
  };

  const [form, setForm] = useState<ArtifactFormState>(defaultState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ArtifactFormState | "video", string>>
  >({});
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const resetForm = () => {
    setForm(defaultState);
    setVideoFile(null);
  };

  return (
    <ArtifactFormContext.Provider
      value={{
        form,
        setForm,
        errors,
        setErrors,
        videoFile,
        setVideoFile,
        resetForm,
      }}
    >
      {children}
    </ArtifactFormContext.Provider>
  );
};

export const useArtifactForm = () => {
  const ctx = useContext(ArtifactFormContext);
  if (!ctx) throw new Error("Use inside ArtifactFormProvider");
  return ctx;
};
