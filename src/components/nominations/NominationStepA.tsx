import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nominationStepASchema, NominationStepAData } from '@/lib/validators/nominationValidators';
import { useNomination } from '@/contexts/NominationContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type NominationInsert = Database['public']['Tables']['nominations']['Insert'];
type NominationRow = Database['public']['Tables']['nominations']['Row'];


const NominationStepA = () => {
  const { user } = useAuth();
  const { nominationId, setNominationId, updateSectionData, setCurrentStep, nominationData } = useNomination();

  const form = useForm<NominationStepAData>({
    resolver: zodResolver(nominationStepASchema),
    defaultValues: nominationData.sectionA || {
      nominee_full_name: '',
      nominee_gender: undefined,
      nominee_dob: '',
      nominee_nationality: '',
      nominee_country_of_residence: '',
      nominee_organization: '',
      nominee_title_position: '',
      nominee_email: '',
      nominee_phone: '',
      nominee_social_media: '',
    },
  });

  const onSubmit = async (data: NominationStepAData) => {
    updateSectionData('sectionA', data);
    console.log("Section A Data to save:", data);

    try {
      let currentNominationId = nominationId;

      const nominationPayload: Partial<NominationInsert> = {
        form_section_a: data as any, // Cast to any because Supabase types expect Json
        user_id: user?.id,
        status: 'draft',
        // Ensure required fields like 'nominee_name' are handled correctly
        // If 'nominee_name' is top-level in DB, extract it from 'data'
        nominee_name: data.nominee_full_name, // Assuming nominee_full_name maps to the DB's nominee_name
      };


      if (currentNominationId) {
        // Update existing nomination
        const { error } = await supabase
          .from('nominations')
          .update(nominationPayload)
          .eq('id', currentNominationId);
        if (error) throw error;
        toast.success('Section A updated!');
      } else {
        // Create new nomination
        // Ensure all *required* fields for insert are present or have defaults in DB
        const insertPayload: NominationInsert = {
            nominee_name: data.nominee_full_name, // This is a required field in the 'nominations' table
            form_section_a: data as any,
            user_id: user?.id,
            status: 'draft',
            // Add any other non-nullable fields that don't have defaults if necessary
        };
        const { data: newNomination, error } = await supabase
          .from('nominations')
          .insert(insertPayload)
          .select()
          .single();
        if (error) throw error;
        if (newNomination) {
          setNominationId(newNomination.id);
          currentNominationId = newNomination.id; // Ensure currentNominationId is updated for subsequent logic if any
          toast.success('Section A saved!');
        }
      }
      setCurrentStep(2); // Move to next step
    } catch (error: any) {
      console.error('Error saving Section A:', error);
      toast.error(`Failed to save Section A: ${error.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-gray-100">
        <h2 className="text-2xl font-semibold text-tpahla-gold mb-6">SECTION A: NOMINEE INFORMATION</h2>

        <FormField
          control={form.control}
          name="nominee_full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>1. Full Name of Nominee *</FormLabel>
              <FormControl>
                <Input placeholder="Enter nominee's full name" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominee_gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>2. Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1 md:flex-row md:space-x-4 md:space-y-0"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="male" className="text-tpahla-gold border-gray-600" />
                    </FormControl>
                    <FormLabel className="font-normal">Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="female" className="text-tpahla-gold border-gray-600" />
                    </FormControl>
                    <FormLabel className="font-normal">Female</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="other" className="text-tpahla-gold border-gray-600" />
                    </FormControl>
                    <FormLabel className="font-normal">Other</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominee_dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>3. Date of Birth (DD/MM/YYYY)</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominee_nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>4. Nationality</FormLabel>
              <FormControl>
                <Input placeholder="Enter nationality" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominee_country_of_residence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>5. Country of Residence</FormLabel>
              <FormControl>
                <Input placeholder="Enter country of residence" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominee_organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>6. Organization/Institution (if applicable)</FormLabel>
              <FormControl>
                <Input placeholder="Enter organization/institution" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominee_title_position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>7. Title/Position Held</FormLabel>
              <FormControl>
                <Input placeholder="Enter title/position" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominee_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>8. Email Address of Nominee</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter nominee's email" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="nominee_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>9. Phone Number of Nominee (include country code)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="e.g. +234 123 456 7890" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominee_social_media"
          render={({ field }) => (
            <FormItem>
              <FormLabel>10. Social Media Handles (LinkedIn, Twitter/X, Instagram, etc.)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. @nominee_handle, linkedin.com/in/nominee" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" variant="tpahla-primary" size="lg">
            Save & Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NominationStepA;
