
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Image as ImageIconPlaceholder, Users, ShieldCheck, Users2, Leaf, Lightbulb, Home, Landmark, Scale, BookOpen, Search, HelpCircle, Award as AwardIcon, AlertTriangle, Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type AwardCategoryRow = Database['public']['Tables']['award_categories']['Row'];

const iconList = [
  { name: 'Users', IconComponent: Users },
  { name: 'ShieldCheck', IconComponent: ShieldCheck },
  { name: 'Users2', IconComponent: Users2 },
  { name: 'Leaf', IconComponent: Leaf },
  { name: 'Lightbulb', IconComponent: Lightbulb },
  { name: 'Home', IconComponent: Home },
  { name: 'Landmark', IconComponent: Landmark },
  { name: 'Scale', IconComponent: Scale },
  { name: 'BookOpen', IconComponent: BookOpen },
  { name: 'Search', IconComponent: Search },
  { name: 'Award', IconComponent: AwardIcon },
  { name: 'HelpCircle', IconComponent: HelpCircle },
];

const categoryFormSchema = z.object({
  cluster_title: z.string().min(3, { message: 'Cluster title must be at least 3 characters.' }),
  description: z.string().optional(),
  icon_name: z.string().optional(),
  awards: z.string().optional(), // Newline-separated awards
  image_file: z.custom<FileList>((val) => val instanceof FileList, "Image is required").nullable().refine(files => files && files.length > 0, 'Image is required.'),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const fetchAwardCategories = async (): Promise<AwardCategoryRow[]> => {
  const { data, error } = await supabase.from('award_categories').select('*').order('cluster_title');
  if (error) throw error;
  return data || [];
};

const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: categories, isLoading, error } = useQuery<AwardCategoryRow[], Error>({
    queryKey: ['awardCategoriesAdmin'],
    queryFn: fetchAwardCategories,
  });

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      cluster_title: '',
      description: '',
      icon_name: iconList[0].name, // Default to first icon
      awards: '',
      image_file: null,
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      let imagePath: string | null = null;
      if (values.image_file && values.image_file.length > 0) {
        const file = values.image_file[0];
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('category_images')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('category_images').getPublicUrl(uploadData.path);
        imagePath = publicUrlData.publicUrl;
      }

      const awardsArray = values.awards?.split('\n').map(a => a.trim()).filter(a => a) || [];

      const { error: insertError } = await supabase.from('award_categories').insert({
        cluster_title: values.cluster_title,
        description: values.description,
        icon_name: values.icon_name,
        awards: awardsArray,
        image_path: imagePath,
      });

      if (insertError) {
        console.error('Insert category error:', insertError);
        // Attempt to delete uploaded image if DB insert fails
        if (imagePath) {
            const pathParts = imagePath.split('/');
            const uploadedFileName = pathParts[pathParts.length -1];
            await supabase.storage.from('category_images').remove([uploadedFileName]);
        }
        throw new Error(`Failed to add category: ${insertError.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awardCategoriesAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['awardCategories'] }); // Invalidate public page query too
      toast.success('Category added successfully!');
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    addCategoryMutation.mutate(values);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => form.reset()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Award Category</DialogTitle>
              <DialogDescription>
                Fill in the details for the new award category. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cluster_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cluster Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Community Impact Awards" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of the category cluster..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icon_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconList.map(icon => (
                            <SelectItem key={icon.name} value={icon.name}>
                              <div className="flex items-center">
                                <icon.IconComponent className="mr-2 h-4 w-4" />
                                {icon.name}
                              </div>
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
                  name="awards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Awards in this Cluster (one per line)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Best Community Project&#10;Volunteer of the Year" {...field} rows={4}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="image_file"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Category Image/Thumbnail</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept="image/png, image/jpeg, image/gif, image/webp"
                          onChange={(e) => onChange(e.target.files)}
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={addCategoryMutation.isPending}>
                    {addCategoryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Category
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Loading categories...</span></div>}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>Error loading categories: {error.message}</p>
        </div>
      )}

      {!isLoading && !error && categories && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Cluster Title</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No categories found. Add one to get started!
                  </TableCell>
                </TableRow>
              )}
              {categories.map((category) => {
                const IconComp = iconList.find(icon => icon.name === category.icon_name)?.IconComponent || HelpCircle;
                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      {category.image_path ? (
                        <img src={category.image_path} alt={category.cluster_title} className="h-10 w-10 object-cover rounded-sm" />
                      ) : (
                        <div className="h-10 w-10 bg-muted rounded-sm flex items-center justify-center">
                          <ImageIconPlaceholder className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{category.cluster_title}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <IconComp className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{category.icon_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="mr-1" disabled> {/* Edit to be implemented */}
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" disabled> {/* Delete to be implemented */}
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

