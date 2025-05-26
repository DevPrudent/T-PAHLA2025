
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNomination } from '@/contexts/NominationContext';
import { nominationStepCSchema, NominationStepCData } from '@/lib/validators/nominationValidators';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { PlusCircle, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

const NominationStepC = () => {
  const { nominationData, updateSectionData, setCurrentStep, nominationId, setNominationId } = useNomination();
  console.log("NominationStepC rendering, attempting to re-evaluate types."); // Temporary log

  const form = useForm<NominationStepCData>({
    resolver: zodResolver(nominationStepCSchema),
    defaultValues: {
      justification: nominationData.sectionC?.justification || '',
      notable_recognitions: nominationData.sectionC?.notable_recognitions || '',
      media_links: nominationData.sectionC?.media_links || [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'media_links',
  });

  useEffect(() => {
    // Pre-populate form if data exists
    if (nominationData.sectionC) {
      form.reset(nominationData.sectionC);
      // Ensure at least one media link field if none are present
      if (!nominationData.sectionC.media_links || nominationData.sectionC.media_links.length === 0) {
        append({ value: '' }, { shouldFocus: false });
      }
    } else {
      // Ensure at least one media link field on initial load if no data
       if (fields.length === 0) {
        append({ value: '' }, { shouldFocus: false });
      }
    }
  }, [nominationData.sectionC, form, append, fields.length]);

  const onSubmit = async (data: NominationStepCData) => {
    // Filter out empty media links before saving
    const processedData = {
      ...data,
      media_links: data.media_links?.filter(link => link.value.trim() !== '') || [],
    };
    updateSectionData('sectionC', processedData);
    console.log('NominationStepC Data:', processedData);

    if (nominationId) {
      try {
        const { error } = await supabase
          .from('nominations')
          .update({
            form_section_c: processedData as any, // Casting as any temporarily if type issue persists
            updated_at: new Date().toISOString(),
          })
          .eq('id', nominationId);

        if (error) throw error;
        toast.success('Section C saved!');
        setCurrentStep(4); // Proceed to Next Step (Section D)
      } catch (error: any) {
        toast.error(`Error saving Section C: ${error.message}`);
        console.error('Supabase update error (Section C):', error);
      }
    } else {
      // This case should ideally not happen if previous steps enforce nominationId creation
      toast.error('Nomination ID is missing. Please go back to a previous step.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-gray-100">
        <h2 className="text-2xl font-semibold text-tpahla-gold border-b border-tpahla-gold/50 pb-2">
          Section C: Justification & Supporting Materials
        </h2>

        <FormField
          control={form.control}
          name="justification"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Detailed Justification for Nomination</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={10}
                  className="bg-gray-800 border-gray-700 focus:border-tpahla-gold"
                  placeholder="Provide a comprehensive narrative (approx. 400-500 words) detailing the nominee's achievements, impact, and reasons for deserving this award. Focus on specific examples and measurable outcomes where possible."
                />
              </FormControl>
              <FormDescription className="text-gray-400">
                Maximum 2500 characters (approx. 400-500 words).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notable_recognitions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Notable Recognitions or Previous Awards (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  className="bg-gray-800 border-gray-700 focus:border-tpahla-gold"
                  placeholder="List any significant recognitions, awards, or honors the nominee has received."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel className="text-lg mb-2 block">Media Links (Optional)</FormLabel>
          <FormDescription className="text-gray-400 mb-2">
            Provide links to relevant online articles, videos, portfolios, or other media showcasing the nominee's work or impact.
          </FormDescription>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2 mb-2">
              <FormField
                control={form.control}
                name={`media_links.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="https://example.com/article"
                        className="bg-gray-800 border-gray-700 focus:border-tpahla-gold"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-500 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ value: '' })}
            className="mt-2 text-tpahla-gold border-tpahla-gold hover:bg-tpahla-gold/10"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Media Link
          </Button>
        </div>

        {/* Placeholder for File Uploads - to be implemented later */}
        <div className="space-y-4 p-4 border border-dashed border-gray-700 rounded-md">
            <h3 className="text-md font-semibold text-gray-300">Supporting Documents (To be submitted via email)</h3>
            <p className="text-sm text-gray-400">
                Please prepare the following documents and submit them to <a href="mailto:tpahla@ihsd-ng.org" className="text-tpahla-gold hover:underline">tpahla@ihsd-ng.org</a> after completing this online form. Ensure the email subject line includes the Nominee's Full Name and Nomination ID (if available).
            </p>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                <li>Nominee's CV/Resume (PDF, DOC, DOCX)</li>
                <li>Recent Passport Photograph of Nominee (JPEG, PNG)</li>
                <li>Up to 3 High-Resolution Action Photographs or Media Files (JPEG, PNG, MP4, MOV)</li>
                <li>Any Other Supporting Documents (PDF, DOC, DOCX)</li>
            </ul>
             <p className="text-xs text-gray-500">Note: File upload functionality directly on this form will be available in a future update.</p>
        </div>


        <div className="flex justify-between items-center pt-4">
          <Button type="button" variant="tpahla-outline" onClick={() => setCurrentStep(2)} className="px-6">
            Back
          </Button>
          <Button 
            type="submit" 
            variant="tpahla-primary" 
            disabled={form.formState.isSubmitting} 
            className="px-8"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin mr-2" /> 
            ) : (
              <ArrowRight className="mr-2" />
            )}
            Save & Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NominationStepC;
