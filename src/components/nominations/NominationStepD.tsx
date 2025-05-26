
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNomination } from '@/contexts/NominationContext';
import { NominationStepDData, nominationStepDSchema } from '@/lib/validators/nominationValidators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type NominationUpdate = Partial<Database['public']['Tables']['nominations']['Update']>;

const NominationStepD = () => {
  const { user } = useAuth();
  const { setCurrentStep, nominationData, updateSectionData, nominationId } = useNomination();

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

  const onSubmit = async (data: NominationStepDData) => {
    updateSectionData('sectionD', data);
    console.log("Section D data submitted:", data);

    if (!nominationId) {
      toast.error("Nomination ID is missing. Please complete previous steps.");
      setCurrentStep(1); // Or the step where nominationId is created
      return;
    }

    try {
      const nominationPayload: NominationUpdate = {
        form_section_d: data as any,
        // user_id and status are set in Step A or updated if needed
      };

      const { error } = await supabase
        .from('nominations')
        .update(nominationPayload)
        .eq('id', nominationId);

      if (error) throw error;
      toast.success('Section D saved!');
      setCurrentStep(5); // Move to Section E
    } catch (error: any) {
      console.error('Error saving Section D:', error);
      toast.error(`Failed to save Section D: ${error.message}`);
    }
  };

  const handlePrevious = () => {
    // updateSectionData('sectionD', form.getValues()); // Optionally save before going back
    setCurrentStep(3); // Go back to Section C
  };

  return (
    <div className="space-y-8 text-gray-100">
      <h2 className="text-2xl font-semibold text-tpahla-gold mb-6">SECTION D: NOMINATOR INFORMATION</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nominator_full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">1. Full Name of Nominator *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-tpahla-gold focus:border-tpahla-gold" />
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
                <FormLabel className="text-gray-300">2. Relationship to Nominee *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Colleague, Mentor, Community Member" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-tpahla-gold focus:border-tpahla-gold" />
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
                <FormLabel className="text-gray-300">3. Your Organization/Institution (if applicable)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your organization" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-tpahla-gold focus:border-tpahla-gold" />
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
                <FormLabel className="text-gray-300">4. Your Email Address *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-tpahla-gold focus:border-tpahla-gold" />
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
                <FormLabel className="text-gray-300">5. Your Phone Number (include country code) *</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="e.g., +234 123 456 7890" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-tpahla-gold focus:border-tpahla-gold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nominator_reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">6. Reason for Nomination (Max 100 words) *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Briefly state why you are nominating this individual."
                    className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-tpahla-gold focus:border-tpahla-gold min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                 <FormDescription className="text-gray-400">
                  A concise summary of your motivation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={handlePrevious}>
              Previous (to Section C)
            </Button>
            <Button type="submit" variant="tpahla-primary">
              Save & Next (to Section E)
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NominationStepD;
