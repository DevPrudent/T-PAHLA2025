
import React, { useEffect } from 'react'; // Added useEffect
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNomination } from '@/contexts/NominationContext';
import { NominationStepBData, nominationStepBSchema } from '@/lib/validators/nominationValidators';
import { awardCategoriesData, getAwardsForCategory, Award } from '@/lib/awardCategories';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NominationStepB = () => {
  const { setCurrentStep, nominationData, updateSectionData, isLoadingNomination } = useNomination();

  const form = useForm<NominationStepBData>({
    resolver: zodResolver(nominationStepBSchema),
    defaultValues: nominationData.sectionB || {
      award_category: '',
      specific_award: '',
    },
  });

  const selectedCategoryId = form.watch('award_category');
  const [availableAwards, setAvailableAwards] = React.useState<Award[]>([]);

  // Effect to reset form when nominationData.sectionB changes (e.g., after async load)
  useEffect(() => {
    if (nominationData.sectionB) {
      form.reset(nominationData.sectionB);
      // If category is loaded, also populate specific awards
      if (nominationData.sectionB.award_category) {
        setAvailableAwards(getAwardsForCategory(nominationData.sectionB.award_category));
      }
    } else {
      // If sectionB is null/undefined (e.g. after reset), reset form to empty state
      form.reset({ award_category: '', specific_award: '' });
      setAvailableAwards([]);
    }
  }, [nominationData.sectionB, form]);


  React.useEffect(() => {
    if (selectedCategoryId) {
      const newAvailableAwards = getAwardsForCategory(selectedCategoryId);
      setAvailableAwards(newAvailableAwards);
      // Reset specific_award if the category changes and the current specific_award is not in the new list
      const currentSpecificAward = form.getValues('specific_award');
      if (currentSpecificAward && !newAvailableAwards.find(a => a.value === currentSpecificAward)) {
        form.setValue('specific_award', '');
      }
    } else {
      setAvailableAwards([]);
    }
  }, [selectedCategoryId, form]);
  
  // This effect might be redundant due to the form.reset effect, but kept for clarity if needed.
  // React.useEffect(() => {
  //   const defaultCategory = nominationData.sectionB?.award_category;
  //   if (defaultCategory) {
  //     setAvailableAwards(getAwardsForCategory(defaultCategory));
  //   }
  // }, [nominationData.sectionB?.award_category]);


  const onSubmit = (data: NominationStepBData) => {
    updateSectionData('sectionB', data);
    console.log("Section B data submitted:", data);
    setCurrentStep(3); // Move to Section C
  };

  const handlePrevious = () => {
    setCurrentStep(1); // Go back to Section A
  };
  
  if (isLoadingNomination && !nominationData.sectionB) { // Show loader if context is loading initial data for this step
    return <div className="text-center py-10 text-gray-300">Loading nomination details...</div>;
  }

  return (
    <div className="space-y-8 text-gray-100">
      <h2 className="text-2xl font-semibold text-tpahla-gold mb-6">SECTION B: NOMINATION CATEGORY</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="award_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Award Category</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    // form.setValue('specific_award', ''); // Reset specific award when category changes
                  }} 
                  value={field.value} // Ensure value is controlled
                  // defaultValue={field.value} // defaultValue might conflict with controlled value
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-tpahla-gold focus:border-tpahla-gold">
                      <SelectValue placeholder="Select an award category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    {awardCategoriesData.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="hover:bg-gray-600 focus:bg-gray-600">
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedCategoryId && availableAwards.length > 0 && (
            <FormField
              control={form.control}
              name="specific_award"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Specific Award</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} // Ensure value is controlled
                    // defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-tpahla-gold focus:border-tpahla-gold">
                        <SelectValue placeholder="Select a specific award" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      {availableAwards.map((award) => (
                        <SelectItem key={award.value} value={award.value} className="hover:bg-gray-600 focus:bg-gray-600">
                          {award.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-between mt-8">
            <Button type="button" variant="tpahla-outline-gold" onClick={handlePrevious} className="text-tpahla-gold hover:text-tpahla-darkgreen hover:bg-tpahla-gold">
              Previous (to Section A)
            </Button>
            <Button type="submit" variant="tpahla-primary">
              Save & Next (to Section C)
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NominationStepB;
