import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNomination } from '@/contexts/NominationContext';
import { nominationStepDSchema, NominationStepDData } from '@/lib/validators/nominationValidators';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

const NominationStepD = () => {
  const { nominationData, updateSectionData, setCurrentStep, nominationId } = useNomination();

  const form = useForm<NominationStepDData>({
    resolver: zodResolver(nominationStepDSchema),
    defaultValues: nominationData.sectionD || {
      nominator_full_name: '',
      nominator_relationship_to_nominee: '',
      nominator_organization: '',
      nominator_email: '',
      nominator_phone: '',
      nominator_reason: '',
    },
  });

  useEffect(() => {
    if (nominationData.sectionD) {
      form.reset(nominationData.sectionD);
    }
  }, [nominationData.sectionD, form]);

  const onSubmit = async (data: NominationStepDData) => {
    updateSectionData('sectionD', data);
    console.log('NominationStepD Data:', data);

    if (nominationId) {
      try {
        const { error } = await supabase
          .from('nominations')
          .update({
            form_section_d: data as any, // Casting as any if type issue persists
            nominator_name: data.nominator_full_name, // Also update top-level nominator_name
            nominator_email: data.nominator_email, // Also update top-level nominator_email
            updated_at: new Date().toISOString(),
          })
          .eq('id', nominationId);

        if (error) throw error;
        toast.success('Section D saved!');
        setCurrentStep(5); // Proceed to Next Step (Section E)
      } catch (error: any) {
        toast.error(`Error saving Section D: ${error.message}`);
        console.error('Supabase update error (Section D):', error);
      }
    } else {
      toast.error('Nomination ID is missing. Please go back to Section A.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-gray-100">
        <h2 className="text-2xl font-semibold text-tpahla-gold border-b border-tpahla-gold/50 pb-2">
          Section D: Nominator Information
        </h2>

        <FormField
          control={form.control}
          name="nominator_full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Nominator's Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Dr. Jane Smith" className="bg-gray-800 border-gray-700 focus:border-tpahla-gold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="nominator_relationship_to_nominee"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Relationship to Nominee</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Colleague, Mentor, Community Leader" className="bg-gray-800 border-gray-700 focus:border-tpahla-gold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominator_organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Nominator's Organization (If applicable)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Acme Corp, XYZ Foundation" className="bg-gray-800 border-gray-700 focus:border-tpahla-gold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominator_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Nominator's Email Address</FormLabel>
              <FormControl>
                <Input type="email" {...field} placeholder="e.g., nominator@example.com" className="bg-gray-800 border-gray-700 focus:border-tpahla-gold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominator_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Nominator's Phone Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., +234 800 000 0000" className="bg-gray-800 border-gray-700 focus:border-tpahla-gold" />
              </FormControl>
               <FormDescription className="text-gray-400">
                Please include country code.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominator_reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Brief Reason for Nomination</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  className="bg-gray-800 border-gray-700 focus:border-tpahla-gold"
                  placeholder="Briefly state why you are nominating this individual/organization (approx. 100 words)."
                />
              </FormControl>
              <FormDescription className="text-gray-400">
                Maximum 500 characters (approx. 100 words).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center pt-4">
          <Button type="button" variant="tpahla-outline" onClick={() => setCurrentStep(3)} className="px-6">
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

export default NominationStepD;
