import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNomination } from '@/contexts/NominationContext';
import { nominationStepESchema, NominationStepEData } from '@/lib/validators/nominationValidators';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { CalendarIcon, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const NominationStepE = () => {
  const { 
    nominationData, 
    updateSectionData, 
    setCurrentStep, 
    nominationId, 
    resetNomination,
    isSubmittingNomination,
    setIsSubmittingNomination
  } = useNomination();

  const form = useForm<NominationStepEData>({
    resolver: zodResolver(nominationStepESchema),
    defaultValues: {
      confirm_accuracy: nominationData.sectionE?.confirm_accuracy || false,
      confirm_nominee_contact: nominationData.sectionE?.confirm_nominee_contact || false,
      confirm_data_use: nominationData.sectionE?.confirm_data_use || false,
      nominator_signature: nominationData.sectionE?.nominator_signature || '',
      date_signed: nominationData.sectionE?.date_signed ? new Date(nominationData.sectionE.date_signed) : new Date(),
    },
  });

  const onSubmit = async (data: NominationStepEData) => {
    setIsSubmittingNomination(true);
    updateSectionData('sectionE', data);
    console.log('NominationStepE Data:', data);
    const fullNominationDataForSubmission = {...nominationData, sectionE: data};
    console.log('Full Nomination Data before final submission:', fullNominationDataForSubmission);

    if (!nominationId) {
      toast.error('Critical error: Nomination ID is missing. Cannot submit.');
      setIsSubmittingNomination(false);
      return;
    }

    try {
      // Update the nomination with section E data and set status to 'submitted'
      const { error: submissionError } = await supabase
        .from('nominations')
        .update({
          form_section_e: data as any, 
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', nominationId);

      if (submissionError) throw submissionError;

      toast.success('Nomination Submitted Successfully!', {
        description: `Thank you for your nomination. Your Nomination ID is ${nominationId}. We are now sending a confirmation email. Please also submit supporting documents via email if you haven't uploaded them.`,
        duration: 10000,
      });
      
      console.log("Nomination submitted successfully to Supabase with ID:", nominationId);

      // Attempt to send email notification
      try {
        const nominatorEmail = fullNominationDataForSubmission.sectionD?.nominator_email;
        const nominatorName = fullNominationDataForSubmission.sectionD?.nominator_full_name || 'Nominator';
        const nomineeName = fullNominationDataForSubmission.sectionA?.nominee_full_name || fullNominationDataForSubmission.sectionA?.nominee_organization || 'The Nominee';
        
        if (!nominatorEmail || !nominatorName || !nomineeName) {
          // Log details if any crucial info is missing, but still attempt if some are present.
          // The edge function itself will also validate.
          console.warn("Potentially missing nominator/nominee details for email. Proceeding with available info.", {
            nominatorEmail, nominatorName, nomineeName
          });
          if (!nominatorEmail) { // Nominator email is critical
             throw new Error("Nominator email is missing for email notification.");
          }
        }

        console.log('Attempting to send email with payload:', {
          nominatorEmail,
          nominatorName,
          nomineeName,
          nominationId,
          siteUrl: window.location.origin,
        });
        
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-nomination-email', {
          body: {
            nominatorEmail,
            nominatorName,
            nomineeName,
            nominationId,
            siteUrl: window.location.origin, // Or a more specific URL to your awards page
          },
        });

        if (emailError) {
          console.error('Error invoking send-nomination-email function:', emailError);
          toast.error('Nomination submitted, but failed to send confirmation email.', {
            description: `Details: ${emailError.message}. Please contact support if this persists.`,
            duration: 10000,
          });
        } else {
          console.log('send-nomination-email function invoked successfully:', emailData);
          toast.success('Confirmation email process initiated.', {
            description: 'You should receive an email shortly.',
            duration: 5000,
          });
        }
      } catch (emailInvocationError: any) {
        console.error('Client-side error preparing or calling email function:', emailInvocationError);
        toast.error('Nomination submitted, but an issue occurred with email notification.', {
          description: `Details: ${emailInvocationError.message}.`,
          duration: 10000,
        });
      }

    } catch (error: any) {
      toast.error(`Error submitting nomination: ${error.message}`);
      console.error('Supabase final submission error:', error);
    } finally {
      setIsSubmittingNomination(false);
      // The component will re-render and show the "Submitted" state due to updated nominationData.sectionE
    }
  };
  
  const isNominationEffectivelySubmitted = nominationData.sectionE && nominationId && nominationData.sectionE.nominator_signature !== '' && nominationData.sectionE.confirm_accuracy;


  if (isNominationEffectivelySubmitted && !isSubmittingNomination && nominationData.sectionE && nominationData.sectionE.confirm_accuracy) {
    return (
      <div className="text-center py-10 text-gray-100">
        <Send className="h-16 w-16 text-tpahla-gold mx-auto mb-4" />
        <h2 className="text-3xl font-semibold text-tpahla-gold mb-3">Nomination Submitted!</h2>
        <p className="text-lg mb-2">Thank you for your submission.</p>
        <p className="text-sm text-gray-400 mb-6">Your Nomination ID is: <span className="font-bold text-tpahla-gold">{nominationId}</span></p>
        <p className="text-gray-300 mb-4">
          A confirmation email should be on its way. Remember to also email any remaining supporting documents to <a href="mailto:tpahla@ihsd-ng.org" className="text-tpahla-gold hover:underline">tpahla@ihsd-ng.org</a> with your Nominee's Name and Nomination ID in the subject line, if you haven't uploaded them directly.
        </p>
        <Button variant="tpahla-primary" onClick={resetNomination} className="px-8">
          Start New Nomination
        </Button>
      </div>
    );
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-gray-100">
        <h2 className="text-2xl font-semibold text-tpahla-gold border-b border-tpahla-gold/50 pb-2">
          Section E: Confirmation & Submission
        </h2>

        <FormField
          control={form.control}
          name="confirm_accuracy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-800/50 border-gray-700">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-tpahla-gold data-[state=checked]:bg-tpahla-gold data-[state=checked]:text-tpahla-darkgreen"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  I confirm that the information provided in this nomination is accurate to the best of my knowledge.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_nominee_contact"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-800/50 border-gray-700">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-tpahla-gold data-[state=checked]:bg-tpahla-gold data-[state=checked]:text-tpahla-darkgreen"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  I understand that the nominee may be contacted by TPAHLA for verification or further information.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_data_use"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-800/50 border-gray-700">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-tpahla-gold data-[state=checked]:bg-tpahla-gold data-[state=checked]:text-tpahla-darkgreen"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  I give permission to TPAHLA to use the information and materials provided in this nomination for the purpose of award assessment, and for promotional activities related to TPAHLA if the nominee is selected.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominator_signature"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Nominator's Signature</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Type your full name"
                  className="bg-gray-800 border-gray-700 focus:border-tpahla-gold"
                />
              </FormControl>
              <FormDescription className="text-gray-400">
                Typing your full name here constitutes your legal digital signature.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date_signed"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-lg">Date of Signature</FormLabel>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700 text-gray-100" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="[&_button]:text-gray-100 [&_button:hover]:bg-tpahla-gold/20 [&_.day_selected]:bg-tpahla-gold [&_.day_selected]:text-tpahla-darkgreen"
                    />
                  </PopoverContent>
                </Popover>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      field.onChange(date);
                    }}
                    className="bg-gray-800 border-gray-700 text-gray-100"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center pt-4">
          <Button type="button" variant="tpahla-outline" onClick={() => setCurrentStep(4)} className="px-6" disabled={isSubmittingNomination}>
            Back
          </Button>
          <Button 
            type="submit" 
            variant="tpahla-primary" 
            disabled={isSubmittingNomination} 
            className="px-8 min-w-[150px]"
          >
            {isSubmittingNomination ? (
              <Loader2 className="animate-spin mr-2" /> 
            ) : (
              <Send className="mr-2" />
            )}
            {isSubmittingNomination ? 'Submitting...' : 'Submit Nomination'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NominationStepE;