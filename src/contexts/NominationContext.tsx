
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TablesInsert } from '@/integrations/supabase/types'; // Assuming this type exists

export type NominationData = Partial<TablesInsert<'nominations'>>;

interface NominationContextType {
  nominationId: string | null;
  setNominationId: (id: string | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: NominationData;
  updateFormData: (data: Partial<NominationData>) => void;
  resetNomination: () => void;
}

const NominationContext = createContext<NominationContextType | undefined>(undefined);

export const NominationProvider = ({ children }: { children: ReactNode }) => {
  const [nominationId, setNominationId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<NominationData>({});

  const updateFormData = (data: Partial<NominationData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetNomination = () => {
    setNominationId(null);
    setCurrentStep(1);
    setFormData({});
  }

  return (
    <NominationContext.Provider
      value={{
        nominationId,
        setNominationId,
        currentStep,
        setCurrentStep,
        formData,
        updateFormData,
        resetNomination,
      }}
    >
      {children}
    </NominationContext.Provider>
  );
};

export const useNomination = () => {
  const context = useContext(NominationContext);
  if (!context) {
    throw new Error('useNomination must be used within a NominationProvider');
  }
  return context;
};

