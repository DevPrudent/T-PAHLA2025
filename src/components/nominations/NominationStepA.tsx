import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { nominationStepASchema, NominationStepAData } from '@/lib/validators/nominationValidators';
import { africanCountries, getCountryNameByCode } from '@/lib/africanCountries';
import { useNomination } from '@/contexts/NominationContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
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
      nominator_email: '',
      nominator_name: '',
      nominee_full_name: '',
      nominee_gender: undefined,
      nominee_dob: '', // Will be YYYY-MM-DD
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
        form_section_a: data as any, 
        user_id: user?.id,
        status: 'draft',
        nominee_name: data.nominee_full_name,
        nominator_email: data.nominator_email,
        nominator_name: data.nominator_name,
      };

      if (currentNominationId) {
        // Update existing nomination - preserve the ID
        const { error } = await supabase
          .from('nominations')
          .update(nominationPayload)
          .eq('id', currentNominationId);
        if (error) throw error;
        toast.success('Section A updated!');
      } else {
        // Create new nomination only if no ID exists
        const insertPayload: NominationInsert = {
            nominee_name: data.nominee_full_name,
            form_section_a: data as any,
            nominator_email: data.nominator_email,
            nominator_name: data.nominator_name,
            user_id: user?.id,
            status: 'draft',
        };
        const { data: newNomination, error } = await supabase
          .from('nominations')
          .insert(insertPayload)
          .select()
          .single();
        if (error) throw error;
        if (newNomination) {
          setNominationId(newNomination.id);
          toast.success('Section A saved!');
        }
      }
      setCurrentStep(2);
    } catch (error: any) {
      console.error('Error saving Section A:', error);
      toast.error(`Failed to save Section A: ${error.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-gray-100">
        <h2 className="text-2xl font-semibold text-tpahla-gold mb-6">SECTION A: NOMINEE INFORMATION</h2>

        <div className="bg-tpahla-gold/10 p-4 rounded-lg border border-tpahla-gold/30 mb-6">
          <h3 className="text-lg font-semibold text-tpahla-gold mb-4">Nominator Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nominator_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
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
                  <FormLabel>Your Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email address" {...field} className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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
            <FormItem className="flex flex-col">
              <FormLabel>3. Date of Birth (DD/MM/YYYY)</FormLabel>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-gray-700 border-gray-600 hover:bg-gray-600 text-white hover:text-white",
                          !field.value && "text-gray-400"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP") // Using new Date() in case field.value is just YYYY-MM-DD string
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : '')}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="text-white [&_button]:text-white [&_button:hover]:bg-tpahla-gold [&_button[aria-selected]]:bg-tpahla-gold [&_button[aria-selected]]:text-tpahla-darkgreen"
                    />
                  </PopoverContent>
                </Popover>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominee_nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>4. Nationality *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {africanCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code} className="hover:bg-gray-700 focus:bg-gray-700">
                      {country.name}
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
          name="nominee_country_of_residence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>5. Country of Residence *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
                    <SelectValue placeholder="Select country of residence" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {africanCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code} className="hover:bg-gray-700 focus:bg-gray-700">
                      {country.name}
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
              <FormLabel>7. Title/Position Held *</FormLabel>
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
              <FormLabel>8. Email Address of Nominee *</FormLabel>
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
              <FormLabel>9. Phone Number of Nominee (include country code) *</FormLabel>
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
        
        <div className="flex justify-between items-center">
           <Button type="button" variant="tpahla-outline" size="lg" onClick={() => setCurrentStep(1)} disabled={true} className="opacity-0 pointer-events-none">
            Previous
          </Button>
          <Button type="submit" variant="tpahla-primary" size="lg">
            Save & Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NominationStepA;