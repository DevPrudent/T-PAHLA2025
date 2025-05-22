import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useNomination } from '@/contexts/NominationContext';
import { NominationStepASchema, NominationStepAData } from '@/lib/validators/nominationValidators';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { TablesInsert } from '@/integrations/supabase/types'; // For explicit typing

// Assuming this type exists in your project
interface AwardCategory {
  id: string;
  cluster_title: string;
}

const fetchAwardCategories = async (): Promise<AwardCategory[]> => {
  const { data, error } = await supabase.from('award_categories').select('id, cluster_title');
  if (error) {
    console.error('Error fetching award categories:', error);
    toast.error('Failed to load award categories.');
    return [];
  }
  return data || [];
};

const NominationStepA = () => {
  const { formData, updateFormData, setCurrentStep, setNominationId, nominationId } = useNomination();
  const [isLoading, setIsLoading] = React.useState(false);
  const [awardCategories, setAwardCategories] = React.useState<AwardCategory[]>([]);

  const form = useForm<NominationStepAData>({
    resolver: zodResolver(NominationStepASchema),
    defaultValues: {
      nominee_name: formData.nominee_name || '',
      nominee_type: formData.nominee_type || undefined,
      award_category_id: formData.award_category_id || undefined,
      summary_of_achievement: formData.summary_of_achievement || '',
      ...(formData.form_section_a as NominationStepAData), // Populate from saved section A data
    },
  });

  React.useEffect(() => {
    fetchAwardCategories().then(setAwardCategories);
  }, []);

  const onSubmit = async (data: NominationStepAData) => {
    setIsLoading(true);
    try {
      updateFormData({ 
        ...data, 
        form_section_a: data // also save explicitly to form_section_a
      });

      // Prepare the payload for Supabase upsert
      // Ensure all required fields are present and correctly typed.
      const basePayload: Omit<TablesInsert<'nominations'>, 'id' | 'created_at' | 'updated_at'> = {
        ...formData, // existing data from context
        ...data,     // current step's validated data
        form_section_a: data, // store the whole step A data again under its specific field
        status: 'draft',
      };
      
      // Explicitly ensure nominee_name is set from `data` (which is validated and required)
      // This helps TypeScript understand it's not optional.
      basePayload.nominee_name = data.nominee_name;
      if (data.nominee_type) basePayload.nominee_type = data.nominee_type;
      if (data.award_category_id) basePayload.award_category_id = data.award_category_id;
      if (data.summary_of_achievement) basePayload.summary_of_achievement = data.summary_of_achievement;


      let upsertObject: TablesInsert<'nominations'>;

      if (nominationId) {
        upsertObject = { ...basePayload, id: nominationId };
      } else {
        // If it's a new nomination, Supabase will generate an ID.
        // We must not send `id: undefined` or `id: null`.
        const { id, ...restForInsert } = basePayload; // remove potential 'id' from formData
        upsertObject = restForInsert as TablesInsert<'nominations'>; // Cast: we've ensured required fields
      }
      
      console.log("Upserting with payload:", upsertObject);

      const { data: savedData, error: upsertError } = await supabase
        .from('nominations')
        .upsert([upsertObject]) // Use array for upsert
        .select()
        .single();

      if (upsertError) {
        console.error('Error saving nomination Step A:', upsertError);
        toast.error(`Failed to save Step A: ${upsertError.message}`);
        setIsLoading(false);
        return;
      }

      if (savedData) {
        console.log('Step A saved:', savedData);
        setNominationId(savedData.id); // Update nominationId in context
        updateFormData(savedData); // Update formData with potentially new/updated fields from DB
        toast.success('Step A saved successfully!');
        setCurrentStep(2);
      }
    } catch (error) {
      console.error('An unexpected error occurred in Step A:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-2xl font-semibold text-tpahla-gold mb-6">Step 1: Nominee Information</h2>
        
        <FormField
          control={form.control}
          name="nominee_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Nominee Full Name / Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dr. John Doe or Example Foundation" {...field} className="bg-tpahla-darkgreen border-tpahla-gold/50 text-gray-200 placeholder:text-gray-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominee_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Nominee Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-tpahla-darkgreen border-tpahla-gold/50 text-gray-200">
                    <SelectValue placeholder="Select nominee type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-tpahla-darkgreen border-tpahla-gold/50 text-gray-200">
                  <SelectItem value="individual" className="hover:bg-tpahla-gold/20">Individual</SelectItem>
                  <SelectItem value="organization" className="hover:bg-tpahla-gold/20">Organization</SelectItem>
                  <SelectItem value="institution" className="hover:bg-tpahla-gold/20">Institution</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="award_category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Award Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-tpahla-darkgreen border-tpahla-gold/50 text-gray-200">
                    <SelectValue placeholder="Select award category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-tpahla-darkgreen border-tpahla-gold/50 text-gray-200">
                  {awardCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="hover:bg-tpahla-gold/20">
                      {category.cluster_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-500">
                Select the category that best fits the nominee's contributions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary_of_achievement"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Summary of Achievement (Max 500 words)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a concise summary of the nominee's key achievements related to the award category."
                  {...field}
                  rows={5}
                  className="bg-tpahla-darkgreen border-tpahla-gold/50 text-gray-200 placeholder:text-gray-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="tpahla-primary" size="lg" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save & Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NominationStepA;
