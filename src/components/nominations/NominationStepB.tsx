
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nominationStepBSchema, NominationStepBData } from '@/lib/validators/nominationValidators';
import { useNomination } from '@/contexts/NominationContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast'; // Corrected import path

const NominationStepB = () => {
  const { nominationId, updateFormData, formData, setCurrentStep } = useNomination();
  const { toast } = useToast();

  if (!nominationId) {
    setCurrentStep(1); // Redirect to step A if no nominationId (should not happen if flow is correct)
    toast({ title: "Error", description: "Please complete Step A first.", variant: "destructive" });
    return <p className="text-red-500">Please complete Step A first.</p>;
  }

  const form = useForm<NominationStepBData>({
    resolver: zodResolver(nominationStepBSchema),
    defaultValues: {
      nominator_name: formData.nominator_name || '',
      nominator_email: formData.nominator_email || '',
    },
  });

  const onSubmit = async (data: NominationStepBData) => {
    try {
      updateFormData(data);
      const { error } = await supabase
        .from('nominations')
        .update({ ...data, status: 'draft' }) // Keep status as draft
        .eq('id', nominationId);

      if (error) throw error;

      toast({ title: "Step B Saved", description: "Nominator details updated." });
      setCurrentStep(3); // Proceed to Step C
    } catch (error: any) {
      console.error("Error saving Step B:", error);
      toast({
        title: "Error",
        description: error.message || "Could not save Step B. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-2xl font-semibold text-tpahla-gold">Section B: Nominator's Details</h3>
        
        <FormField
          control={form.control}
          name="nominator_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Your Full Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} className="bg-tpahla-darkgreen/50 border-tpahla-gold/30 text-white focus:ring-tpahla-gold" />
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
              <FormLabel className="text-gray-300">Your Email Address*</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email address" {...field} className="bg-tpahla-darkgreen/50 border-tpahla-gold/30 text-white focus:ring-tpahla-gold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between">
          <Button type="button" variant="tpahla-outline-gold" onClick={() => setCurrentStep(1)}>
            Back to Step A
          </Button>
          <Button type="submit" variant="tpahla-primary" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save & Continue to Step C'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NominationStepB;

