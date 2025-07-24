
import React from 'react';
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
  const { setCurrentStep, nominationData, updateSectionData, nominationId } = useNomination();

  const form = useForm<NominationStepBData>({
    resolver: zodResolver(nominationStepBSchema),
    defaultValues: nominationData.sectionB || {
      award_category: '',
      specific_award: '',
    },
  });

  const selectedCategoryId = form.watch('award_category');
  const [availableAwards, setAvailableAwards] = React.useState<Award[]>([]);

  React.useEffect(() => {
    if (selectedCategoryId) {
      setAvailableAwards(getAwardsForCategory(selectedCategoryId));
      // Reset specific_award if the category changes and the current specific_award is not in the new list
      const currentSpecificAward = form.getValues('specific_award');
      if (currentSpecificAward && !getAwardsForCategory(selectedCategoryId).find(a => a.value === currentSpecificAward)) {
        form.setValue('specific_award', '');
      }
    } else {
      setAvailableAwards([]);
    }
  }, [selectedCategoryId, form]);
  
  // Effect to populate awards if default category is present
  React.useEffect(() => {
    const defaultCategory = nominationData.sectionB?.award_category;
    if (defaultCategory) {
      setAvailableAwards(getAwardsForCategory(defaultCategory));
    }
  }, [nominationData.sectionB?.award_category]);


  const onSubmit = (data: NominationStepBData) => {
    updateSectionData('sectionB', data);
    console.log("Section B data submitted:", data);
    
    // Save to database immediately when Section B is completed
    if (nominationId) {
      saveToDatabase(data);
    } else {
      console.error("No nomination ID available to save Section B");
      toast.error("Error: No nomination ID found. Please go back to Section A.");
    }
  };

  const saveToDatabase = async (data: NominationStepBData) => {
    try {
      const { error } = await supabase
        .from('nominations')
        .update({
          form_section_b: data as any,
          award_category_id: data.award_category, // Update the top-level award_category_id field
          updated_at: new Date().toISOString(),
        })
        .eq('id', nominationId);

      if (error) throw error;
      toast.success('Section B saved successfully!');
      setCurrentStep(3); // Move to Section C only after successful save
    } catch (error: any) {
      console.error('Error saving Section B:', error);
      toast.error(`Failed to save Section B: ${error.message}`);
    }
  };

  const handlePrevious = () => {
    // Potentially save current data before going back if desired
    // updateSectionData('sectionB', form.getValues()); 
    setCurrentStep(1); // Go back to Section A
  };

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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Button type="button" variant="outline" onClick={handlePrevious}>
              Previous
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
