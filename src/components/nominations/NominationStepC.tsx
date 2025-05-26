import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNomination } from '@/contexts/NominationContext';
import { nominationStepCSchema, NominationStepCData } from '@/lib/validators/nominationValidators';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { PlusCircle, Trash2, ArrowRight, Loader2, UploadCloud, FileText, Image as ImageIcon, Paperclip } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import type { Tables } from '@/integrations/supabase/types'; // For nomination_documents type

type NominationDocument = Tables<'nomination_documents'>;
type FileTypeEnum = NominationDocument['file_type'];

const NominationStepC = () => {
  const { nominationData, updateSectionData, setCurrentStep, nominationId } = useNomination();
  // Removed setNominationId as it's not used here.

  const [uploadedFiles, setUploadedFiles] = useState<NominationDocument[]>([]);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({}); // Tracks upload status per file type
  const [isFetchingFiles, setIsFetchingFiles] = useState(false);

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

  // Fetch existing uploaded files for this nomination
  useEffect(() => {
    const fetchFiles = async () => {
      if (!nominationId) return;
      setIsFetchingFiles(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("You must be logged in to view files.");
          setIsFetchingFiles(false);
          return;
        }

        const { data, error } = await supabase
          .from('nomination_documents')
          .select('*')
          .eq('nomination_id', nominationId)
          .eq('user_id', user.id); // Ensure users only see their own document records

        if (error) throw error;
        setUploadedFiles(data || []);
      } catch (error: any) {
        toast.error(`Error fetching files: ${error.message}`);
        console.error('Error fetching files:', error);
      } finally {
        setIsFetchingFiles(false);
      }
    };

    fetchFiles();
  }, [nominationId]);

  useEffect(() => {
    // Pre-populate form if data exists
    if (nominationData.sectionC) {
      form.reset(nominationData.sectionC);
      if (!nominationData.sectionC.media_links || nominationData.sectionC.media_links.length === 0) {
        append({ value: '' }, { shouldFocus: false });
      }
    } else {
       if (fields.length === 0) {
        append({ value: '' }, { shouldFocus: false });
      }
    }
  }, [nominationData.sectionC, form, append, fields.length]);


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: FileTypeEnum) => {
    if (!event.target.files || event.target.files.length === 0) return;
    if (!nominationId) {
      toast.error("Nomination ID is missing. Please complete previous steps.");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to upload files.");
      return;
    }

    const filesToUpload = Array.from(event.target.files);
    setIsUploading(prev => ({ ...prev, [fileType as string]: true }));

    for (const file of filesToUpload) {
      const fileName = `${user.id}/${nominationId}/${fileType}/${Date.now()}_${file.name}`;
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('nomination_files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { error: dbError, data: dbData } = await supabase
          .from('nomination_documents')
          .insert({
            nomination_id: nominationId,
            file_name: file.name,
            storage_path: uploadData.path,
            file_type: fileType,
            user_id: user.id,
          })
          .select()
          .single(); // get the inserted row back

        if (dbError) throw dbError;
        if (dbData) {
            setUploadedFiles(prev => [...prev, dbData as NominationDocument]);
        }
        toast.success(`Successfully uploaded ${file.name}`);
      } catch (error: any) {
        toast.error(`Error uploading ${file.name}: ${error.message}`);
        console.error(`Error uploading ${file.name}:`, error);
      }
    }
    setIsUploading(prev => ({ ...prev, [fileType as string]: false }));
    // Reset file input
    event.target.value = '';
  };

  const handleFileDelete = async (document: NominationDocument) => {
    if (!document.id || !document.storage_path) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete ${document.file_name}?`);
    if (!confirmDelete) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('nomination_files')
        .remove([document.storage_path]);
      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('nomination_documents')
        .delete()
        .eq('id', document.id);
      if (dbError) throw dbError;

      setUploadedFiles(prev => prev.filter(f => f.id !== document.id));
      toast.success(`Successfully deleted ${document.file_name}`);
    } catch (error: any) {
      toast.error(`Error deleting ${document.file_name}: ${error.message}`);
      console.error(`Error deleting ${document.file_name}:`, error);
    }
  };

  const onSubmit = async (data: NominationStepCData) => {
    const processedData = {
      ...data,
      media_links: data.media_links?.filter(link => link.value.trim() !== '') || [],
    };
    updateSectionData('sectionC', processedData);
    console.log('NominationStepC Data (text fields):', processedData);

    if (nominationId) {
      try {
        const { error } = await supabase
          .from('nominations')
          .update({
            form_section_c: processedData as any,
            updated_at: new Date().toISOString(),
          })
          .eq('id', nominationId);

        if (error) throw error;
        toast.success('Section C (text fields) saved!');
        setCurrentStep(4); 
      } catch (error: any) {
        toast.error(`Error saving Section C (text fields): ${error.message}`);
        console.error('Supabase update error (Section C):', error);
      }
    } else {
      toast.error('Nomination ID is missing. Please go back to a previous step.');
    }
  };
  
  const renderUploadedFiles = (filterType: FileTypeEnum) => {
    const files = uploadedFiles.filter(f => f.file_type === filterType);
    if (files.length === 0 && filterType !== 'cv_resume' && !isFetchingFiles) return <p className="text-sm text-gray-500">No {filterType.replace('_', ' ')} uploaded yet.</p>;
    if (files.length === 0 && filterType === 'cv_resume' && !isFetchingFiles) return <p className="text-sm text-gray-500">No CV/Resume uploaded yet.</p>;


    return files.map(file => (
      <div key={file.id} className="flex items-center justify-between p-2 border border-gray-700 rounded-md mb-2 bg-gray-800/50">
        <div className="flex items-center space-x-2">
          {file.file_type === 'cv_resume' && <FileText className="h-5 w-5 text-tpahla-gold" />}
          {file.file_type === 'photo_media' && <ImageIcon className="h-5 w-5 text-tpahla-gold" />}
          {file.file_type === 'additional_document' && <Paperclip className="h-5 w-5 text-tpahla-gold" />}
          <a 
            href={supabase.storage.from('nomination_files').getPublicUrl(file.storage_path).data.publicUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-300 hover:text-tpahla-gold hover:underline"
          >
            {file.file_name}
          </a>
        </div>
        <Button variant="ghost" size="sm" onClick={() => handleFileDelete(file)} className="text-red-500 hover:text-red-400">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ));
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

        {/* File Upload Section */}
        <div className="space-y-6 p-4 border border-dashed border-gray-700 rounded-md">
          <h3 className="text-lg font-semibold text-gray-300">Supporting Documents</h3>
          <p className="text-sm text-gray-400">
            Upload the following documents. Ensure the Nominee's Full Name is clear in the CV/Resume.
            Max file size: 5MB each. Accepted types: PDF, DOC, DOCX, JPG, PNG, MP4, MOV.
          </p>

          {/* CV/Resume Upload */}
          <div className="space-y-2">
            <FormLabel className="text-md font-medium">Nominee's CV/Resume (PDF, DOC, DOCX)</FormLabel>
            {isFetchingFiles && uploadedFiles.filter(f=>f.file_type === 'cv_resume').length === 0 && <Loader2 className="animate-spin h-5 w-5 text-tpahla-gold" />}
            {renderUploadedFiles('cv_resume')}
            {uploadedFiles.filter(f => f.file_type === 'cv_resume').length === 0 && ( // Only show upload if none exists
              <Input
                type="file"
                accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => handleFileUpload(e, 'cv_resume')}
                disabled={isUploading['cv_resume'] || !nominationId}
                className="bg-gray-800 border-gray-700 file:text-tpahla-gold file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-tpahla-gold/10 hover:file:bg-tpahla-gold/20"
              />
            )}
            {isUploading['cv_resume'] && <Loader2 className="animate-spin h-5 w-5 text-tpahla-gold mt-2" />}
          </div>

          {/* Photos/Media Upload */}
          <div className="space-y-2">
            <FormLabel className="text-md font-medium">High-Resolution Action Photographs or Media Files (Up to 3 - JPG, PNG, MP4, MOV)</FormLabel>
            {isFetchingFiles && uploadedFiles.filter(f=>f.file_type === 'photo_media').length === 0 && <Loader2 className="animate-spin h-5 w-5 text-tpahla-gold" />}
            {renderUploadedFiles('photo_media')}
             {uploadedFiles.filter(f => f.file_type === 'photo_media').length < 3 && ( // Allow up to 3 photo/media files
                <Input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,video/mp4,video/quicktime"
                    onChange={(e) => handleFileUpload(e, 'photo_media')}
                    disabled={isUploading['photo_media'] || !nominationId || uploadedFiles.filter(f => f.file_type === 'photo_media').length >= 3}
                    className="bg-gray-800 border-gray-700 file:text-tpahla-gold file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-tpahla-gold/10 hover:file:bg-tpahla-gold/20"
                />
             )}
            {isUploading['photo_media'] && <Loader2 className="animate-spin h-5 w-5 text-tpahla-gold mt-2" />}
            {uploadedFiles.filter(f => f.file_type === 'photo_media').length >= 3 && <p className="text-xs text-gray-500">Maximum 3 photo/media files uploaded.</p>}
          </div>

          {/* Other Supporting Documents Upload */}
          <div className="space-y-2">
            <FormLabel className="text-md font-medium">Any Other Supporting Documents (Optional - PDF, DOC, DOCX)</FormLabel>
             {isFetchingFiles && uploadedFiles.filter(f=>f.file_type === 'additional_document').length === 0 && <Loader2 className="animate-spin h-5 w-5 text-tpahla-gold" />}
            {renderUploadedFiles('additional_document')}
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => handleFileUpload(e, 'additional_document')}
              disabled={isUploading['additional_document'] || !nominationId}
              className="bg-gray-800 border-gray-700 file:text-tpahla-gold file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-tpahla-gold/10 hover:file:bg-tpahla-gold/20"
            />
            {isUploading['additional_document'] && <Loader2 className="animate-spin h-5 w-5 text-tpahla-gold mt-2" />}
          </div>
        </div>


        <div className="flex justify-between items-center pt-4">
          <Button type="button" variant="tpahla-outline" onClick={() => setCurrentStep(2)} className="px-6">
            Back
          </Button>
          <Button 
            type="submit" 
            variant="tpahla-primary" 
            disabled={form.formState.isSubmitting || Object.values(isUploading).some(s => s)} 
            className="px-8"
          >
            {(form.formState.isSubmitting || Object.values(isUploading).some(s => s)) ? (
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
