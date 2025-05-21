import { useState, useEffect, ChangeEvent } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Using the shadcn toast
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Award, ChevronRight, Users, ShieldCheck, Leaf, Lightbulb, Home, Users2, Landmark, Scale, BookOpen, Search, UploadCloud, LucideIcon } from "lucide-react";

// Type for an award category, matching the database structure
interface AwardCategory {
  id: string;
  cluster_title: string;
  description: string | null;
  awards: string[] | null;
  icon_name: string | null;
  image_path: string | null;
  created_at?: string;
  updated_at?: string;
}

// Mapping of icon names (strings) to Lucide components
const iconComponents: { [key: string]: LucideIcon } = {
  Users,
  ShieldCheck,
  Leaf,
  Lightbulb,
  Home,
  Users2,
  Landmark,
  Scale,
  BookOpen,
  Search,
  Award, // Default/fallback icon
};

const getIconComponent = (iconName: string | null): LucideIcon => {
  if (iconName && iconComponents[iconName]) {
    return iconComponents[iconName];
  }
  return Award; // Default icon if not found or null
};


const Awards = () => {
  const [selectedCluster, setSelectedCluster] = useState<AwardCategory | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingCategoryId, setUploadingCategoryId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch award categories from Supabase
  const { data: awardClusters, isLoading, error: fetchError } = useQuery<AwardCategory[], Error>({
    queryKey: ['awardCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('award_categories')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Mutation for updating the image_path in the database
  const updateImageMutation = useMutation<void, Error, { categoryId: string; imagePath: string }>({
    mutationFn: async ({ categoryId, imagePath }) => {
      const { error } = await supabase
        .from('award_categories')
        .update({ image_path: imagePath, updated_at: new Date().toISOString() })
        .eq('id', categoryId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awardCategories'] });
      toast({ title: "Success", description: "Image updated successfully!" });
    },
    onError: (error) => {
      toast({ title: "Error", description: `Failed to update image: ${error.message}`, variant: "destructive" });
    },
    onSettled: () => {
      setSelectedFile(null);
      setUploadingCategoryId(null);
    }
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleImageUpload = async (categoryId: string) => {
    if (!selectedFile) {
      toast({ title: "No file selected", description: "Please select an image file to upload.", variant: "destructive" });
      return;
    }
    if (!categoryId) {
        toast({ title: "Error", description: "Category ID is missing.", variant: "destructive" });
        return;
    }

    setUploadingCategoryId(categoryId);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${categoryId}_${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`; // Storing in a 'public' subfolder within the bucket

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('award_images') // Bucket name
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true, // Overwrite if file with same name exists
        });

      if (uploadError) throw uploadError;

      // File uploaded successfully, now update the database record
      updateImageMutation.mutate({ categoryId, imagePath: filePath });

    } catch (error: any) {
      toast({ title: "Upload Error", description: error.message, variant: "destructive" });
      setSelectedFile(null);
      setUploadingCategoryId(null);
    }
  };
  
  const getSupabaseImageUrl = (imagePath: string | null) => {
    if (!imagePath) return "/placeholder.svg"; // Default placeholder
    // Check if it's a Supabase storage path or an old placeholder path
    if (imagePath.startsWith('public/')) { // Our convention for storage paths
        const { data } = supabase.storage.from('award_images').getPublicUrl(imagePath);
        return data.publicUrl || "/placeholder.svg";
    }
    return imagePath; // Assume it's an absolute URL or a path in /public folder
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background">Loading award categories...</div>;
  if (fetchError) return <div className="min-h-screen flex items-center justify-center bg-background text-red-500">Error fetching categories: {fetchError.message}</div>;

  const IconForDialog = selectedCluster ? getIconComponent(selectedCluster.icon_name) : Award;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 bg-tpahla-darkgreen text-tpahla-text-primary">
        
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 text-tpahla-gold">Award Categories - TPAHLA 2025</h1>
          <p className="text-lg max-w-3xl mx-auto text-tpahla-text-secondary">
            Recognizing Excellence in Various Facets of Humanitarian Leadership
          </p>
        </div>
      </div>
      
      <main className="py-12">
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-tpahla-text-secondary">
              The Pan-African Humanitarian Leadership Award celebrates excellence across diverse areas of humanitarian work. Each category recognizes unique contributions to the development and wellbeing of African communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awardClusters?.map((cluster) => (
              <div 
                key={cluster.id} 
                className="flex flex-col bg-tpahla-neutral rounded-lg shadow-xl overflow-hidden border border-tpahla-gold/20 hover:shadow-tpahla-gold/30 hover:border-tpahla-gold/40 transition-all duration-300 group"
              >
                <div className="h-2 bg-gradient-to-r from-tpahla-gold-gradient-start to-tpahla-gold-gradient-end"></div>
                
                <div className="w-full cursor-pointer" onClick={() => setSelectedCluster(cluster)}>
                  <AspectRatio ratio={16 / 9} className="bg-tpahla-neutral-light">
                    <img 
                      src={getSupabaseImageUrl(cluster.image_path)}
                      alt={cluster.cluster_title} 
                      className="object-cover w-full h-full" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                        (e.target as HTMLImageElement).alt = "Placeholder Image";
                      }}
                    />
                  </AspectRatio>
                </div>

                <div className="p-6 flex-grow cursor-pointer" onClick={() => setSelectedCluster(cluster)}>
                  <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-gold text-center">{cluster.cluster_title}</h3>
                  <p className="text-tpahla-text-secondary text-sm mb-4 min-h-[5rem] overflow-hidden">{cluster.description}</p>
                </div>

                <div className="px-6 py-4 bg-tpahla-neutral-light/50 border-t border-tpahla-gold/10">
                  <div className="space-y-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-sm file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-tpahla-emerald/20 file:text-tpahla-emerald hover:file:bg-tpahla-emerald/30"
                      onClick={(e) => e.stopPropagation()} // Prevent card click when clicking input
                    />
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleImageUpload(cluster.id);
                      }}
                      disabled={updateImageMutation.isPending && uploadingCategoryId === cluster.id}
                      className="w-full bg-tpahla-emerald hover:bg-tpahla-emerald/90 text-white"
                      size="sm"
                    >
                      {updateImageMutation.isPending && uploadingCategoryId === cluster.id ? "Uploading..." : <><UploadCloud size={16} className="mr-2" /> Upload New Image</>}
                    </Button>
                  </div>
                </div>
                
                <div 
                    className="px-6 py-4 bg-tpahla-neutral-light border-t border-tpahla-gold/10 cursor-pointer"
                    onClick={() => setSelectedCluster(cluster)}
                >
                  <div className="text-center text-sm text-tpahla-gold font-medium group-hover:text-gradient-gold flex items-center justify-center">
                    View Awards in this Cluster <ChevronRight size={18} className="ml-1 transform transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        
        <section className="py-16 bg-tpahla-neutral-light">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-tpahla-emerald">
                Unveiling of Humanitarian Ambassadors
              </h2>
              <p className="text-xl text-tpahla-text-secondary mb-8">
                A Key Highlight of the TPAHLA 2025 Programme
              </p>
              <div className="bg-tpahla-neutral p-8 rounded-lg shadow-xl border-t-4 border-tpahla-gold">
                <p className="text-tpahla-text-secondary text-left leading-relaxed">
                  As part of the Pan-African Humanitarian Leadership Award (TPAHLA) programme, the unveiling of Humanitarian Ambassadors will be a key highlight. These ambassadors are outstanding individuals selected for their unwavering commitment to humanitarian service and their ability to advocate for and drive change across the continent. Their leadership qualities, impactful work in various humanitarian causes, and influence will serve as an inspiration to others and reinforce the spirit of altruism across Africa.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold mb-12 text-center text-tpahla-gold relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-tpahla-emerald">Past Award Recipients</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-tpahla-neutral rounded-lg shadow-xl p-8 border border-tpahla-gold/20">
                <p className="text-center text-tpahla-text-secondary italic mb-6">
                  Information about past award recipients will be available after the inaugural ceremony on October 18, 2025.
                </p>
                <div className="flex justify-center">
                  <img 
                    src="/lovable-uploads/0782cd19-ebc3-4e7c-8099-2ffc6e08289e.png" 
                    alt="TPAHLA Logo" 
                    className="h-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Dialog open={selectedCluster !== null} onOpenChange={() => setSelectedCluster(null)}>
        <DialogContent className="max-w-2xl bg-tpahla-neutral border-tpahla-gold text-tpahla-text-primary">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center gap-3 text-tpahla-gold">
              {selectedCluster && <IconForDialog className="text-tpahla-emerald" size={28} />}
              <span>{selectedCluster?.cluster_title}</span>
            </DialogTitle>
            <DialogDescription className="text-base text-tpahla-text-secondary mt-2 pt-2 border-t border-tpahla-gold/20">
              {selectedCluster?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            <h3 className="text-lg font-medium text-tpahla-gold border-b border-tpahla-gold/20 pb-2">Awards in this Cluster</h3>
            <ul className="space-y-3">
              {selectedCluster?.awards?.map((award, i) => (
                <li key={i} className="p-3 bg-tpahla-neutral-light rounded-md flex items-start shadow">
                  <Award className="text-tpahla-gold mr-3 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-tpahla-text-primary">{award}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Awards;
