import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { NominationStepAData, NominationStepBData, NominationStepCData, NominationStepDData, NominationStepEData } from '@/lib/validators/nominationValidators';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type NominationRow = Database['public']['Tables']['nominations']['Row'];

interface NominationData {
  sectionA?: NominationStepAData;
  sectionB?: NominationStepBData;
  sectionC?: NominationStepCData;
  sectionD?: NominationStepDData;
  sectionE?: NominationStepEData;
}

interface NominationContextType {
  nominationId: string | null;
  setNominationId: (id: string | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nominationData: NominationData;
  updateSectionData: (section: keyof NominationData, data: any) => void;
  resetNomination: () => void;
  isSubmittingNomination: boolean;
  setIsSubmittingNomination: (isSubmitting: boolean) => void;
  isLoadingNomination: boolean; // Added for loading state
}

const NominationContext = createContext<NominationContextType | undefined>(undefined);

interface NominationProviderProps {
  children: ReactNode;
  editNominationId?: string;
}

export const NominationProvider = ({ children, editNominationId }: NominationProviderProps) => {
  const [nominationId, setNominationId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [nominationData, setNominationData] = useState<NominationData>({});
  const [isSubmittingNomination, setIsSubmittingNomination] = useState(false);
  const [isLoadingNomination, setIsLoadingNomination] = useState(false);

  useEffect(() => {
    const loadNominationForEdit = async (id: string) => {
      setIsLoadingNomination(true);
      console.log(`NominationContext: Attempting to load nomination with ID: ${id}`);
      try {
        const { data, error } = await supabase
          .from('nominations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('NominationContext: Error fetching nomination for edit:', error);
          toast.error(`Failed to load nomination: ${error.message}`);
          // Potentially redirect or show an error message to the user
          // For now, we'll reset to a new nomination state
          resetNomination();
          return;
        }

        if (data) {
          console.log('NominationContext: Fetched nomination data:', data);
          setNominationId(data.id);
          const loadedData: NominationData = {
            sectionA: data.form_section_a as NominationStepAData || undefined,
            sectionB: data.form_section_b as NominationStepBData || undefined,
            sectionC: data.form_section_c as NominationStepCData || undefined,
            sectionD: data.form_section_d as NominationStepDData || undefined,
            sectionE: data.form_section_e as NominationStepEData || undefined,
          };
          setNominationData(loadedData);
          // For simplicity, always start at step 1 when editing. User can navigate.
          // Alternatively, determine the step based on filled sections.
          setCurrentStep(1); 
          console.log('NominationContext: Nomination loaded for editing. Data:', loadedData);
          toast.success('Nomination loaded for editing.');
        } else {
          console.warn('NominationContext: No nomination found for ID:', id);
          toast.warning('No nomination found with the provided ID. Starting a new nomination.');
          resetNomination();
        }
      } catch (err: any) {
        console.error('NominationContext: Unexpected error loading nomination:', err);
        toast.error(`An unexpected error occurred: ${err.message}`);
        resetNomination();
      } finally {
        setIsLoadingNomination(false);
      }
    };

    if (editNominationId) {
      // Check if we are not already loading this ID or if it's different from current nominationId
      if (nominationId !== editNominationId) {
         loadNominationForEdit(editNominationId);
      }
    } else {
      // If no editNominationId is provided, and there's no existing nominationId in state, ensure it's reset
      // This handles navigating from an edit URL to the plain /nomination-form URL
      if (!nominationId) {
        resetNomination();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editNominationId]); // Only re-run if editNominationId changes


  const updateSectionData = (section: keyof NominationData, data: any) => {
    setNominationData(prevData => {
      const updatedData = {
        ...prevData,
        [section]: data,
      };
      console.log(`NominationContext: Updated ${section}`, data);
      console.log('NominationContext: Full data after update', updatedData);
      return updatedData;
    });
  };

  const resetNomination = () => {
    console.log('NominationContext: Resetting nomination.');
    setNominationId(null);
    setCurrentStep(1);
    setNominationData({});
    setIsSubmittingNomination(false);
    setIsLoadingNomination(false); // Ensure loading state is reset
    // If navigating away from an edit URL to /nomination-form, editNominationId will become undefined
    // which will trigger the reset logic in useEffect.
    // If user clicks "Start New Nomination" on an edit page, this reset is fine.
  };

  return (
    <NominationContext.Provider value={{
      nominationId,
      setNominationId,
      currentStep,
      setCurrentStep,
      nominationData,
      updateSectionData,
      resetNomination,
      isSubmittingNomination,
      setIsSubmittingNomination,
      isLoadingNomination,
    }}>
      {children}
    </NominationContext.Provider>
  );
};

export const useNomination = () => {
  const context = useContext(NominationContext);
  if (context === undefined) {
    throw new Error('useNomination must be used within a NominationProvider');
  }
  return context;
};
