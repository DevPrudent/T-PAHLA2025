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
  DialogDescription as DialogDescriptionComponent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  image_file: z.custom<FileList>((val) => val instanceof FileList).nullable().optional(),
  remove_image: z.boolean().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const fetchAwardCategories = async (): Promise<AwardCategoryRow[]> => {
  const { data, error } = await supabase.from('award_categories').select('*').order('cluster_title');
  if (error) throw error;
  return data || [];
};

// Helper to get filename from Supabase public URL
const getFileNameFromPath = (path: string | null | undefined): string | null => {
    if (!path) return null;
    try {
        const url = new URL(path);
        const pathSegments = url.pathname.split('/');
        return pathSegments[pathSegments.length - 1];
    } catch (e) { // Not a URL, might be just a path fragment
        const pathSegments = path.split('/');
        return pathSegments[pathSegments.length -1];
    }
}

const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AwardCategoryRow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<AwardCategoryRow | null>(null);


  const { data: categories, isLoading, error } = useQuery<AwardCategoryRow[], Error>({
    queryKey: ['awardCategoriesAdmin'],
    queryFn: fetchAwardCategories,
  });

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      cluster_title: '',
      description: '',
      icon_name: iconList[0].name,
      awards: '',
      image_file: null,
      remove_image: false,
    },
  });

  const handleOpenEditDialog = (category: AwardCategoryRow) => {
    setEditingCategory(category);
    form.reset({
      cluster_title: category.cluster_title,
      description: category.description || '',
      icon_name: category.icon_name || iconList[0].name,
      awards: category.awards ? (category.awards as string[]).join('\n') : '',
      image_file: null, // File input cannot be pre-filled for security
      remove_image: false,
    });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (category: AwardCategoryRow) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const addCategoryMutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      if (!values.image_file || values.image_file.length === 0) {
        throw new Error("Image is required when adding a new category.");
      }

      let imagePath: string | null = null;
      const file = values.image_file[0];
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('category_images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }
      const { data: publicUrlData } = supabase.storage.from('category_images').getPublicUrl(uploadData.path);
      imagePath = publicUrlData.publicUrl;

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
        if (imagePath) {
            const uploadedFileName = getFileNameFromPath(uploadData.path);
            if (uploadedFileName) await supabase.storage.from('category_images').remove([uploadedFileName]);
        }
        throw new Error(`Failed to add category: ${insertError.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awardCategoriesAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['awardCategories'] });
      queryClient.invalidateQueries({ queryKey: ['awardCategoriesCount'] });
      toast.success('Category added successfully!');
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const editCategoryMutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      if (!editingCategory) throw new Error("No category selected for editing.");

      let newImagePath: string | null | undefined = editingCategory.image_path; // Keep old if not changed

      // 1. Handle image removal
      if (values.remove_image) {
        if (editingCategory.image_path) {
          const oldFileName = getFileNameFromPath(editingCategory.image_path);
          if (oldFileName) {
            const { error: deleteError } = await supabase.storage.from('category_images').remove([oldFileName]);
            if (deleteError) console.error("Error deleting old image:", deleteError.message);
          }
        }
        newImagePath = null;
      } 
      // 2. Handle new image upload (if remove_image is false and new file provided)
      else if (values.image_file && values.image_file.length > 0) {
        // Delete old image first
        if (editingCategory.image_path) {
          const oldFileName = getFileNameFromPath(editingCategory.image_path);
          if (oldFileName) {
            const { error: deleteError } = await supabase.storage.from('category_images').remove([oldFileName]);
            if (deleteError) console.error("Error deleting old image during replacement:", deleteError.message);
          }
        }
        // Upload new image
        const file = values.image_file[0];
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('category_images')
          .upload(fileName, file);

        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
        const { data: publicUrlData } = supabase.storage.from('category_images').getPublicUrl(uploadData.path);
        newImagePath = publicUrlData.publicUrl;
      }

      const awardsArray = values.awards?.split('\n').map(a => a.trim()).filter(a => a) || [];

      const { error: updateError } = await supabase
        .from('award_categories')
        .update({
          cluster_title: values.cluster_title,
          description: values.description,
          icon_name: values.icon_name,
          awards: awardsArray,
          image_path: newImagePath,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingCategory.id);

      if (updateError) {
        // If DB update fails but new image was uploaded, try to delete new image
        if (newImagePath && newImagePath !== editingCategory.image_path && values.image_file && values.image_file.length > 0) {
             const uploadedFileName = getFileNameFromPath(newImagePath);
             if(uploadedFileName) await supabase.storage.from('category_images').remove([uploadedFileName]);
        }
        throw new Error(`Failed to update category: ${updateError.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awardCategoriesAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['awardCategories'] });
      queryClient.invalidateQueries({ queryKey: ['awardCategoriesCount'] });
      toast.success('Category updated successfully!');
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      form.reset();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryToDelete: AwardCategoryRow) => {
      // 1. Delete from database
      const { error: dbError } = await supabase
        .from('award_categories')
        .delete()
        .eq('id', categoryToDelete.id);

      if (dbError) {
        throw new Error(`Failed to delete category from database: ${dbError.message}`);
      }

      // 2. Delete image from storage if it exists
      if (categoryToDelete.image_path) {
        const fileName = getFileNameFromPath(categoryToDelete.image_path);
        if (fileName) {
            const { error: storageError } = await supabase.storage
            .from('category_images')
            .remove([fileName]);
            if (storageError) {
                // Log error but don't necessarily throw, as DB entry is deleted.
                // User might need to manually clean storage if this happens.
                console.error(`Failed to delete image from storage, but category deleted from DB. Image path: ${fileName}`, storageError);
                toast.warning(`Category deleted, but failed to remove image '${fileName}' from storage. Please check storage manually.`);
            }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awardCategoriesAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['awardCategories'] });
      queryClient.invalidateQueries({ queryKey: ['awardCategoriesCount'] });
      toast.success('Category deleted successfully!');
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
    },
    onError: (error) => {
      toast.error(`Error deleting category: ${error.message}`);
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      editCategoryMutation.mutate(values);
    } else {
      addCategoryMutation.mutate(values);
    }
  };
  
  const currentMutation = editingCategory ? editCategoryMutation : addCategoryMutation;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
          if (!isOpen) form.reset();
          setIsAddDialogOpen(isOpen);
          setEditingCategory(null); 
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => { form.reset({ cluster_title: '', description: '', icon_name: iconList[0].name, awards: '', image_file: null, remove_image: false }); setEditingCategory(null); setIsAddDialogOpen(true); } }>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Award Category</DialogTitle>
              <DialogDescriptionComponent>
                Fill in the details for the new award category. Click save when you're done.
              </DialogDescriptionComponent>
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
                      <FormLabel>Description (Optional)</FormLabel>
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
                      <FormLabel>Awards in this Cluster (Optional, one per line)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Best Community Project&#10;Volunteer of the Year" {...field} rows={3}/>
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
                      <FormLabel>Category Image/Thumbnail {editingCategory ? "(Leave blank to keep current)" : "(Required)"}</FormLabel>
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
      
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => {
        if (!isOpen) { setEditingCategory(null); form.reset(); }
        setIsEditDialogOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Award Category</DialogTitle>
            <DialogDescriptionComponent>
              Update the details for the award category. Click save when you're done.
            </DialogDescriptionComponent>
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
                      <Input {...field} />
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <FormLabel>Awards in this Cluster (Optional, one per line)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
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
                      <FormLabel>New Category Image/Thumbnail (Optional)</FormLabel>
                       {editingCategory?.image_path && !form.watch("remove_image") && (
                         <div className="mb-2">
                           <p className="text-sm text-muted-foreground">Current image:</p>
                           <img src={editingCategory.image_path} alt="Current category image" className="h-20 w-20 object-cover rounded-sm border" />
                         </div>
                       )}
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
                {editingCategory?.image_path && (
                  <FormField
                    control={form.control}
                    name="remove_image"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Remove current image?
                          </FormLabel>
                          <FormDescription>
                            If checked, the current image will be removed. A new image will replace it if uploaded.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setIsEditDialogOpen(false); setEditingCategory(null); form.reset(); }}>Cancel</Button>
                <Button type="submit" disabled={editCategoryMutation.isPending}>
                  {editCategoryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category
              "{deletingCategory?.cluster_title}" and its associated image (if any).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingCategory(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingCategory) {
                  deleteCategoryMutation.mutate(deletingCategory);
                }
              }}
              disabled={deleteCategoryMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCategoryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


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
                <TableHead className="hidden sm:table-cell">Description</TableHead>
                <TableHead className="hidden md:table-cell">Awards</TableHead>
                <TableHead className="hidden lg:table-cell">Icon</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No categories found. Add one to get started!
                  </TableCell>
                </TableRow>
              )}
              {categories.map((category) => {
                const IconComp = iconList.find(icon => icon.name === category.icon_name)?.IconComponent || HelpCircle;
                const awardsList = Array.isArray(category.awards) ? category.awards : [];
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
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground truncate max-w-[150px]">{category.description || '-'}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {awardsList.length > 0 ? `${awardsList.length} award(s)` : '-'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center">
                        <IconComp className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{category.icon_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="mr-1" onClick={() => handleOpenEditDialog(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleOpenDeleteDialog(category)}>
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
