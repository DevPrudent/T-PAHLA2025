import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNomination } from '@/contexts/NominationContext';
import { NominationStepCData, nominationStepCSchema } from '@/lib/validators/nominationValidators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { PlusCircle, Trash2, FileText, Image, FileUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type NominationUpdate = Partial<Database['public']['Tables']['nominations']['Update']>;

const NominationStepC = () => {
  const { setCurrentStep, nominationData, updateSectionData, nominationId } = useNomination();

  const form = useForm<NominationStepCData>({
    resolver: zodResolver(nominationStepCSchema),
    defaultValues: nominationData.sectionC || {
      justification: '',
      notable_recognitions: '',
      media_links: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "media_links"
  });

  const onSubmit = async (data: NominationStepCData) => {
    // Filter out empty media links before saving
    const processedData = {
      ...data,
      media_links: data.media_links?.filter(link => link.value.trim() !== '') || [],
    };
    updateSectionData('sectionC', processedData);
    console.log("Section C data submitted:", processedData);

    if (!nominationId) {
      toast.error("Nomination ID is missing. Please complete previous steps.");
      setCurrentStep(1); 
      return;
    }

    try {
      const nominationPayload: NominationUpdate = {
        form_section_c: processedData as any,
      };

      const { error } = await supabase
        .from('nominations')
        .update(nominationPayload)
        .eq('id', nominationId);

      if (error) throw error;
      toast.success('Section C saved!');
      setCurrentStep(4); // Move to Section D
    } catch (error: any) {
      console.error('Error saving Section C:', error);
      toast.error(`Failed to save Section C: ${error.message}`);
    }
  };

  const handlePrevious = () => {
    // updateSectionData('sectionC', form.getValues()); // Optionally save before going back
    setCurrentStep(2); // Go back to Section B
  };

  return (
    <div className="space-y-8 text-gray-100">
      <h2 className="text-2xl font-semibold text-tpahla-gold mb-6">SECTION C: JUSTIFICATION FOR NOMINATION</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="justification"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Why does the nominee deserve this award? (Max 400-500 words)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Explain key achievements, measurable impact, community testimonials (optional), dates, milestones, or recognition."
                    className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-tpahla-gold focus:border-tpahla-gold min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Clearly articulate the nominee's contributions and impact.
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
                <FormLabel className="text-gray-300">Notable Recognitions or Previous Awards (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g., Community Leader Award 2023, Forbes 30 Under 30"
                    className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-tpahla-gold focus:border-tpahla-gold"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="text-gray-300 mb-2 block">Links to Supporting Media (Optional)</FormLabel>
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-center space-x-2 mb-2">
                <FormField
                  control={form.control}
                  name={`media_links.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input
                          placeholder="https://example.com/article_or_video"
                          className="bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-tpahla-gold focus:border-tpahla-gold"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Show remove button only if there's more than one link or if it's not the only link and it's not empty */}
                {(fields.length > 1 || (fields.length === 1 && form.getValues(`media_links.${index}.value`) !== '')) && (
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
              onClick={() => append({ value: "" })}
              className="text-tpahla-gold border-tpahla-gold hover:bg-tpahla-gold/10"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Media Link
            </Button>
             <FormDescription className="text-gray-400 mt-1">
                Add links to articles, videos, or other online media supporting the nomination.
            </FormDescription>
          </div>

          {/* Placeholder for File Uploads */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-tpahla-gold flex items-center">
                <FileUp className="mr-2 h-5 w-5" /> Upload Supporting Documents
              </CardTitle>
              <CardDescription className="text-gray-400">
                CV/Resume, Photos/Media, Other relevant documents. (File upload functionality will be enabled soon.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border-2 border-dashed border-gray-600 rounded-md text-center text-gray-500">
                <FileText className="mx-auto h-10 w-10 mb-2" />
                <p>CV/Resume Upload (Coming Soon)</p>
              </div>
              <div className="p-4 border-2 border-dashed border-gray-600 rounded-md text-center text-gray-500">
                <Image className="mx-auto h-10 w-10 mb-2" />
                <p>Photos/Media Upload (Coming Soon)</p>
              </div>
              <div className="p-4 border-2 border-dashed border-gray-600 rounded-md text-center text-gray-500">
                <FileText className="mx-auto h-10 w-10 mb-2" />
                <p>Other Documents Upload (Coming Soon)</p>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Supported formats: PDF, DOCX, JPG, PNG. Max file size: 5MB per file.
              </p>
            </CardContent>
          </Card>


          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={handlePrevious}>
              Previous (to Section B)
            </Button>
            <Button type="submit" variant="tpahla-primary">
              Save & Next (to Section D)
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NominationStepC;
