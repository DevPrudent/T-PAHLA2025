import { useState } from "react";
import { motion } from "framer-motion";
import { ServerCrash, Award, Users, Download } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import AwardsHeader from "@/components/awards/AwardsHeader";
import AwardClusterCard from "@/components/awards/AwardClusterCard";
import AwardClusterDialog from "@/components/awards/AwardClusterDialog";
import HumanitarianAmbassadorsSection from "@/components/awards/HumanitarianAmbassadorsSection";
import { useAwardCategories, AwardCluster } from "@/hooks/useAwardCategories";

const Awards = () => {
  const [selectedCluster, setSelectedCluster] = useState<AwardCluster | null>(null);
  const { data: awardClusters, isLoading, error, refetch } = useAwardCategories();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter award clusters based on search term
  const filteredClusters = awardClusters?.filter(cluster => {
    if (!searchTerm) return true;
    return (
      cluster.clusterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cluster.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cluster.awards.some(award => award.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AwardsHeader />
      
      <main className="py-12">
        {/* Introduction Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-tpahla-text-secondary mb-8">
                The Pan-African Humanitarian Leadership Award celebrates excellence across diverse areas of humanitarian work. Each category recognizes unique contributions to the development and wellbeing of African communities.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Link to="/nominations">
                  <Button className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                    <Award className="mr-2 h-4 w-4" />
                    Submit a Nomination
                  </Button>
                </Link>
                <a href="https://zrutcdhfqahfduxppudv.supabase.co/storage/v1/object/public/documents/TPAHLA%202025%20BROCHURE%2033" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-tpahla-gold text-tpahla-gold hover:bg-tpahla-gold/10">
                    <Download className="mr-2 h-4 w-4" />
                    Download Awards Brochure
                  </Button>
                </a>
              </div>
            </motion.div>
            
            {/* Search */}
            <div className="mb-12">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search award categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 rounded-full border border-tpahla-gold/30 bg-tpahla-neutral focus:outline-none focus:ring-2 focus:ring-tpahla-gold/50 text-tpahla-text-primary"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-tpahla-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-tpahla-gold hover:text-tpahla-gold/70"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Award Categories Grid */}
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

            {!isLoading && !error && filteredClusters && (
              filteredClusters.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredClusters.map((cluster) => (
                    <motion.div key={cluster.id} variants={itemVariants}>
                      <AwardClusterCard 
                        cluster={cluster}
                        onClick={() => setSelectedCluster(cluster)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-16 w-16 mx-auto text-tpahla-gold/50 mb-4" />
                  <p className="text-tpahla-text-secondary text-lg">
                    {searchTerm ? "No award categories match your search." : "No award categories found."}
                  </p>
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      className="mt-4 border-tpahla-gold text-tpahla-gold hover:bg-tpahla-gold/10"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              )
            )}
          </div>
        </section>

        {/* Eligibility Criteria Section */}
        <section className="py-16 bg-tpahla-neutral">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-serif font-bold mb-4 text-tpahla-gold">Eligibility Criteria</h2>
                <p className="text-tpahla-text-secondary">
                  To be considered for a TPAHLA award, nominees must meet the following criteria:
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="h-full bg-tpahla-neutral-light border border-tpahla-gold/20 rounded-lg p-6">
                    <h3 className="text-xl font-serif font-bold mb-4 text-tpahla-gold">For Individuals</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-tpahla-gold/20 p-2 rounded-full mr-3 mt-0.5">
                          <Users className="h-4 w-4 text-tpahla-gold" />
                        </div>
                        <p className="text-tpahla-text-secondary">Demonstrated leadership in humanitarian service within Africa</p>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-tpahla-gold/20 p-2 rounded-full mr-3 mt-0.5">
                          <Users className="h-4 w-4 text-tpahla-gold" />
                        </div>
                        <p className="text-tpahla-text-secondary">Measurable impact on communities or social issues</p>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-tpahla-gold/20 p-2 rounded-full mr-3 mt-0.5">
                          <Users className="h-4 w-4 text-tpahla-gold" />
                        </div>
                        <p className="text-tpahla-text-secondary">Minimum of 3 years of consistent work in the nominated field</p>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-tpahla-gold/20 p-2 rounded-full mr-3 mt-0.5">
                          <Users className="h-4 w-4 text-tpahla-gold" />
                        </div>
                        <p className="text-tpahla-text-secondary">Ethical conduct and reputation in professional activities</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="h-full bg-tpahla-neutral-light border border-tpahla-gold/20 rounded-lg p-6">
                    <h3 className="text-xl font-serif font-bold mb-4 text-tpahla-gold">For Organizations</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-tpahla-gold/20 p-2 rounded-full mr-3 mt-0.5">
                          <Users className="h-4 w-4 text-tpahla-gold" />
                        </div>
                        <p className="text-tpahla-text-secondary">Legally registered entity with at least 5 years of operation</p>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-tpahla-gold/20 p-2 rounded-full mr-3 mt-0.5">
                          <Users className="h-4 w-4 text-tpahla-gold" />
                        </div>
                        <p className="text-tpahla-text-secondary">Demonstrated excellence in humanitarian service delivery</p>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-tpahla-gold/20 p-2 rounded-full mr-3 mt-0.5">
                          <Users className="h-4 w-4 text-tpahla-gold" />
                        </div>
                        <p className="text-tpahla-text-secondary">Transparent governance and financial management</p>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-tpahla-gold/20 p-2 rounded-full mr-3 mt-0.5">
                          <Users className="h-4 w-4 text-tpahla-gold" />
                        </div>
                        <p className="text-tpahla-text-secondary">Significant and measurable impact on target communities</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-8"
              >
                <div className="bg-tpahla-gold/10 border border-tpahla-gold rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="bg-tpahla-gold/20 p-2 rounded-full mr-3 mt-0.5">
                      <Award className="h-5 w-5 text-tpahla-gold" />
                    </div>
                    <div>
                      <h4 className="font-bold text-tpahla-gold mb-2">Nomination Process</h4>
                      <p className="text-tpahla-text-secondary mb-4">
                        Nominations can be submitted by individuals, organizations, or through self-nomination. All nominations must include supporting documentation and references.
                      </p>
                      <Link to="/nominations">
                        <Button className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                          Start Nomination Process
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <HumanitarianAmbassadorsSection />
        
        {/* Call to Action */}
        <section className="py-16 bg-tpahla-darkgreen text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">
                  Recognize Excellence in Humanitarian Leadership
                </h2>
                <p className="text-xl mb-8">
                  Nominate an individual, organization, or institution making significant humanitarian impact across Africa.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/nominations">
                    <Button size="lg" className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                      Submit a Nomination
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                      Register for the Event
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <AwardClusterDialog 
        selectedCluster={selectedCluster}
        onOpenChange={() => setSelectedCluster(null)}
      />
    </div>
  );
};

export default Awards;