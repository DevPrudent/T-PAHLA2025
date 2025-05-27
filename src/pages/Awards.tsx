import { useState } from "react";
import { ServerCrash } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 

import AwardsHeader from "@/components/awards/AwardsHeader";
import AwardClusterCard from "@/components/awards/AwardClusterCard";
import AwardClusterDialog from "@/components/awards/AwardClusterDialog";
import HumanitarianAmbassadorsSection from "@/components/awards/HumanitarianAmbassadorsSection";
import { useAwardCategories, AwardCluster } from "@/hooks/useAwardCategories";

const Awards = () => {
  const [selectedCluster, setSelectedCluster] = useState<AwardCluster | null>(null);
  const { data: awardClusters, isLoading, error, refetch } = useAwardCategories();

  return (
    <div className="min-h-screen bg-background">
      <AwardsHeader />
      
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
                <AwardClusterCard 
                  key={cluster.id} 
                  cluster={cluster}
                  onClick={() => setSelectedCluster(cluster)}
                />
              ))}
            </div>
          )}
           {!isLoading && !error && (!awardClusters || awardClusters.length === 0) && (
            <p className="text-center text-tpahla-text-secondary col-span-full">No award categories found. Please check back later or add categories in the admin dashboard.</p>
           )}
        </section>

        <HumanitarianAmbassadorsSection />
        
        {/* Past Award Recipients Section REMOVED */}
      </main>
      
      <AwardClusterDialog 
        selectedCluster={selectedCluster}
        onOpenChange={() => setSelectedCluster(null)}
      />
      
      {/* Footer removed */}
    </div>
  );
};

export default Awards;
