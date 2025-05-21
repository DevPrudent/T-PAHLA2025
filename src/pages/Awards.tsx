import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Award as AwardIcon, ChevronRight, Users, ShieldCheck, Leaf, Lightbulb, Home, Users2, Landmark, Scale, BookOpen, Search, Image as ImageIcon, HelpCircle, ServerCrash, LucideProps } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Type for icon components
type LucideIconComponent = React.FC<LucideProps>;

// Icon mapping
const iconMap: Record<string, LucideIconComponent> = {
  Users,
  ShieldCheck,
  Users2,
  Leaf,
  Lightbulb,
  Home,
  Landmark,
  BookOpen,
  Scale,
  Search,
  Default: HelpCircle,
};

// Type for data structure after fetching and transforming
interface AwardCluster {
  id: string;
  clusterTitle: string;
  IconComponent: LucideIconComponent;
  description: string;
  awards: string[];
  imagePath: string | null;
}

// Type for raw data from Supabase
interface AwardCategoryFromDB {
  id: string;
  cluster_title: string;
  description: string | null;
  awards: unknown | null; // Supabase jsonb can be 'unknown' initially
  icon_name: string | null;
  image_path: string | null;
}

const fetchAwardCategories = async (): Promise<AwardCluster[]> => {
  const { data, error } = await supabase
    .from("award_categories")
    .select("id, cluster_title, description, awards, icon_name, image_path")
    .order("cluster_title", { ascending: true });

  if (error) {
    console.error("Error fetching award categories:", error);
    throw new Error(error.message);
  }
  if (!data) {
    return [];
  }

  return data.map((category: AwardCategoryFromDB) => {
    let parsedAwards: string[] = [];
    if (category.awards && Array.isArray(category.awards)) {
      parsedAwards = category.awards.filter((award: unknown): award is string => typeof award === 'string');
    }
    
    return {
      id: category.id,
      clusterTitle: category.cluster_title,
      description: category.description || "No description available.",
      awards: parsedAwards,
      IconComponent: category.icon_name ? (iconMap[category.icon_name] || iconMap.Default) : iconMap.Default,
      imagePath: category.image_path,
    };
  });
};

const Awards = () => {
  const [selectedCluster, setSelectedCluster] = useState<AwardCluster | null>(null);

  const { data: awardClusters, isLoading, error, refetch } = useQuery<AwardCluster[], Error>({
    queryKey: ["awardCategories"],
    queryFn: fetchAwardCategories,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar and Footer are now rendered by PublicLayout in App.tsx */}
      
      {/* Removed pt-24 from this div. PublicLayout's pt-24 will handle navbar clearance. */}
      <div className="pb-12 bg-tpahla-darkgreen text-tpahla-text-primary">
        <div className="container mx-auto px-4 text-center pt-8">
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
          
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col bg-tpahla-neutral rounded-lg shadow-xl overflow-hidden border border-tpahla-gold/20">
                  <div className="h-2 bg-gradient-to-r from-tpahla-gold-gradient-start to-tpahla-gold-gradient-end"></div>
                  <AspectRatio ratio={16 / 9} className="bg-tpahla-neutral-light">
                    <Skeleton className="w-full h-full" />
                  </AspectRatio>
                  <div className="p-6 flex-grow">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                  </div>
                  <div className="px-6 py-4 bg-tpahla-neutral-light border-t border-tpahla-gold/10">
                    <Skeleton className="h-5 w-1/2 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
             <Alert variant="destructive" className="max-w-2xl mx-auto">
              <ServerCrash className="h-5 w-5" />
              <AlertTitle>Error Fetching Categories</AlertTitle>
              <AlertDescription>
                Could not load award categories. Please try again later.
                <button onClick={() => refetch()} className="ml-2 text-sm underline">Try again</button>
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && awardClusters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {awardClusters.map((cluster) => (
                <div 
                  key={cluster.id} 
                  className="flex flex-col bg-tpahla-neutral rounded-lg shadow-xl overflow-hidden border border-tpahla-gold/20 hover:shadow-tpahla-gold/30 hover:border-tpahla-gold/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  onClick={() => setSelectedCluster(cluster)}
                >
                  <div className="h-2 bg-gradient-to-r from-tpahla-gold-gradient-start to-tpahla-gold-gradient-end"></div>
                  
                  <div className="w-full">
                    <AspectRatio ratio={16 / 9} className="bg-tpahla-neutral-light">
                      {cluster.imagePath ? (
                        <img src={cluster.imagePath} alt={cluster.clusterTitle} className="object-cover w-full h-full" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="w-16 h-16 text-tpahla-gold opacity-50" strokeWidth={1.5} />
                        </div>
                      )}
                    </AspectRatio>
                  </div>

                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-gold text-center">{cluster.clusterTitle}</h3>
                    <p className="text-tpahla-text-secondary text-sm mb-4 min-h-[5rem] overflow-hidden text-ellipsis line-clamp-4">{cluster.description}</p>
                  </div>

                  <div className="px-6 py-4 bg-tpahla-neutral-light border-t border-tpahla-gold/10">
                    <div className="text-center text-sm text-tpahla-gold font-medium group-hover:text-gradient-gold flex items-center justify-center">
                      View Awards in this Cluster <ChevronRight size={18} className="ml-1 transform transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
           {!isLoading && !error && (!awardClusters || awardClusters.length === 0) && (
            <p className="text-center text-tpahla-text-secondary col-span-full">No award categories found. Please check back later or add categories in the admin dashboard.</p>
           )}
        </section>

        {/* Unveiling of Humanitarian Ambassadors Section */}
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
              {selectedCluster && selectedCluster.IconComponent && <selectedCluster.IconComponent className="text-tpahla-emerald" size={28} />}
              <span>{selectedCluster?.clusterTitle}</span>
            </DialogTitle>
            <DialogDescription className="text-base text-tpahla-text-secondary mt-2 pt-2 border-t border-tpahla-gold/20">
              {selectedCluster?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            <h3 className="text-lg font-medium text-tpahla-gold border-b border-tpahla-gold/20 pb-2">Awards in this Cluster</h3>
            {selectedCluster && selectedCluster.awards.length > 0 ? (
              <ul className="space-y-3">
                {selectedCluster.awards.map((award, i) => (
                  <li key={i} className="p-3 bg-tpahla-neutral-light rounded-md flex items-start shadow">
                    <AwardIcon className="text-tpahla-gold mr-3 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-medium text-tpahla-text-primary">{award}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-tpahla-text-secondary">No specific awards listed for this cluster yet.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Footer is now rendered by PublicLayout in App.tsx */}
    </div>
  );
};

export default Awards;
