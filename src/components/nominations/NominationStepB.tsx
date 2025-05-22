
import React from 'react';
import { useNomination } from '@/contexts/NominationContext';
import { Button } from '@/components/ui/button';

const NominationStepB = () => {
  const { setCurrentStep, nominationData } = useNomination();

  // Placeholder data structure for Section B - Award Category
  // This will be replaced with actual form fields later.
  const [selectedCategory, setSelectedCategory] = React.useState(nominationData.sectionB?.award_category || '');

  const handleNext = () => {
    // Here you would typically save Section B data to the context:
    // updateSectionData('sectionB', { award_category: selectedCategory });
    console.log("Section B data (placeholder):", { award_category: selectedCategory });
    setCurrentStep(3); // Move to Section C (which we'll create later)
  };

  const handlePrevious = () => {
    setCurrentStep(1); // Go back to Section A
  };

  return (
    <div className="space-y-8 text-gray-100">
      <h2 className="text-2xl font-semibold text-tpahla-gold mb-6">SECTION B: NOMINATION CATEGORY</h2>
      
      <p className="text-gray-300">
        This is a placeholder for Section B: Nomination Category.
        The actual form fields for selecting an award category will be implemented here based on the details you provided.
      </p>

      {/* Example input (will be replaced with proper category selection) */}
      <div>
        <label htmlFor="categoryInput" className="block text-sm font-medium text-gray-300">
          Enter Category (temp)
        </label>
        <input
          id="categoryInput"
          type="text"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-1 block w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md shadow-sm focus:ring-tpahla-gold focus:border-tpahla-gold sm:text-sm p-2"
          placeholder="e.g., African Humanitarian Hero"
        />
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handlePrevious}>
          Previous
        </Button>
        <Button variant="tpahla-primary" onClick={handleNext}>
          Save & Next (to Section C)
        </Button>
      </div>
    </div>
  );
};

export default NominationStepB;
