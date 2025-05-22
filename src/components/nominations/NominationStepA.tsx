
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nominationStepASchema, NominationStepAData, NomineeTypeEnum } from '@/lib/validators/nominationValidators';
import { useNomination } from '@/contexts/NominationContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast'; // Corrected import path
import { AwardCategory } from '@/types'; // Assuming you have an AwardCategory type, adjust if not

// TODO: Fetch actual award categories from DB or use a mock
const MOCK_AWARD_CATEGORIES: AwardCategory[] = [
  { id: 'cat1', cluster_title: 'Humanitarian Leadership & Legacy' },
  { id: 'cat2', cluster_title: 'Youth Empowerment & Gender Equality' },
  { id: 'cat3', cluster_title: 'Disaster Relief & Crisis Management' },
  { id: 'cat4', cluster_title: 'Health & Wellbeing' },
  { id: 'cat5', cluster_title: 'Environmental Sustainability' },
  { id: 'cat6', cluster_title: 'Education & Capacity Building' },
];


const NominationStepA = () => {
  const { nominationId, setNominationId, updateFormData, formData, setCurrentStep } = useNomination();
  const { toast } = useToast();
  
  const form = useForm<NominationStepAData>({
    resolver: zodResolver(nominationStepASchema),
    defaultValues: {
      nominee_name: formData.nominee_name || '',
      nominee_type: formData.nominee_type || null,
      award_category_id: formData.award_category_id || null,
      summary_of_achievement: formData.summary_of_achievement || '',
    },
  });

  const onSubmit = async (data: NominationStepAData) => {
    try {
      updateFormData(data);
      let currentNominationId = nominationId;

      if (currentNominationId) {
        // Update existing nomination
        const { error } = await supabase
          .from('nominations')
          .update({ ...data, status: 'draft' })
          .eq('id', currentNominationId);
        if (error) throw error;
        toast({ title: "Step A Saved", description: "Nomination details updated." });
      } else {
        // Create new nomination
        const { data: newNomination, error } = await supabase
          .from('nominations')
          .insert([{ ...data, status: 'draft' }])
          .select('id')
          .single();
        if (error) throw error;
        if (newNomination?.id) {
          setNominationId(newNomination.id);
          currentNominationId = newNomination.id;
          toast({ title: "Step A Saved", description: "New nomination draft created." });
        } else {
          throw new Error("Failed to create nomination record.");
        }
      }
      setCurrentStep(2);
    } catch (error: any) {
      console.error("Error saving Step A:", error);
      toast({
        title: "Error",
        description: error.message || "Could not save Step A. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-2xl font-semibold text-tpahla-gold">Section A: Nominee Details</h3>
        
        <FormField
          control={form.control}
          name="nominee_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Nominee Full Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter nominee's full name" {...field} className="bg-tpahla-darkgreen/50 border-tpahla-gold/30 text-white focus:ring-tpahla-gold" />
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
              <FormLabel className="text-gray-300">Nominee Type*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="bg-tpahla-darkgreen/50 border-tpahla-gold/30 text-white focus:ring-tpahla-gold">
                    <SelectValue placeholder="Select nominee type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-tpahla-darkgreen border-tpahla-gold text-white">
                  {NomineeTypeEnum.options.map(option => (
                    <SelectItem key={option} value={option} className="hover:bg-tpahla-gold/20">
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
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
              <FormLabel className="text-gray-300">Award Category*</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="bg-tpahla-darkgreen/50 border-tpahla-gold/30 text-white focus:ring-tpahla-gold">
                    <SelectValue placeholder="Select award category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-tpahla-darkgreen border-tpahla-gold text-white">
                  {MOCK_AWARD_CATEGORIES.map(category => (
                    <SelectItem key={category.id} value={category.id} className="hover:bg-tpahla-gold/20">
                      {category.cluster_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="summary_of_achievement"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Summary of Achievement*</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Briefly describe the nominee's contributions and impact (max 1500 words)." 
                  {...field} 
                  rows={5}
                  className="bg-tpahla-darkgreen/50 border-tpahla-gold/30 text-white focus:ring-tpahla-gold"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" variant="tpahla-primary" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save & Continue to Step B'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NominationStepA;
