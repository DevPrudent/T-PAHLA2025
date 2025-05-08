
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Award, X } from "lucide-react";

const Awards = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const awardCategories = [
    {
      title: "Humanitarian Leadership & Legacy",
      description: "Recognizing individuals who have demonstrated exceptional leadership in humanitarian initiatives with long-lasting impact across African communities.",
      criteria: ["Demonstrated leadership in humanitarian work", "Measurable impact on communities", "Longevity of contributions", "Innovation in addressing challenges"],
      icon: "/lovable-uploads/92b50466-de02-4bd7-be38-28457a5f67f4.png",
      awards: [
        "African Humanitarian Hero (Highest Honor)",
        "Pan-African Icon of Humanitarian Leadership",
        "Humanitarian Lifetime Achievement Award",
        "Distinguished Traditional Leadership for Humanitarian Support",
        "Outstanding Humanitarian Organization of the Year"
      ]
    },
    {
      title: "Youth Empowerment & Gender Equality",
      description: "Honoring leaders who have made significant contributions to advancing youth development and gender equality in Africa.",
      criteria: ["Innovative youth programs", "Advancement of gender equality", "Educational initiatives", "Empowerment outcomes"],
      icon: "/lovable-uploads/a00d42e3-b690-4797-be0e-d243e4646af2.png",
      awards: [
        "Humanitarian Youth Leadership Award",
        "Gender Equity & Women Empowerment Award",
        "Outstanding Public Office Holder for Gender Equality & Women's Empowerment Award",
        "Future Humanitarian Leaders Award"
      ]
    },
    {
      title: "Disaster Relief & Crisis Management",
      description: "Celebrating organizations and individuals who have shown exceptional response to disasters and crisis situations in Africa.",
      criteria: ["Rapid and effective response", "Lives saved and improved", "Resource mobilization", "Sustainable recovery support"],
      icon: "/lovable-uploads/13d00a6d-4190-4282-ab91-94a117e549c4.png",
      awards: [
        "Disaster Relief & Emergency Response Award",
        "Excellence in Disaster Relief & National Emergency Management Award",
        "Humanitarian Food Security & Nutrition Award"
      ]
    },
    {
      title: "Health & Wellbeing",
      description: "Recognizing outstanding contributions to improving healthcare access and wellbeing across African communities.",
      criteria: ["Healthcare access improvements", "Disease prevention initiatives", "Mental health support", "Innovative health solutions"],
      icon: "/lovable-uploads/b06f4b3d-06e0-424b-b0ae-8497f22a838e.png",
      awards: [
        "Excellence in Public Health & Crisis Management Leadership Award",
        "Healthcare Innovation Award",
        "Mental Health Advocacy Award",
        "Community Health Empowerment Award"
      ]
    },
    {
      title: "Environmental Sustainability",
      description: "Honoring individuals and organizations championing environmental conservation and sustainable practices in Africa.",
      criteria: ["Environmental protection initiatives", "Community involvement", "Sustainable resource management", "Climate action leadership"],
      icon: "/lovable-uploads/e3b6554c-d090-4298-946e-9e71a11f3a2b.png",
      awards: [
        "Sustainable Development & Environmental Stewardship Award",
        "Climate Change Leadership Award",
        "Renewable Energy & Humanitarian Infrastructure Award",
        "Clean Water, Sanitation & Hygiene (WASH) Award"
      ]
    },
    {
      title: "Education & Capacity Building",
      description: "Celebrating exceptional contributions to education and skills development across Africa.",
      criteria: ["Educational access improvements", "Quality of education initiatives", "Skills development programs", "Educational infrastructure"],
      icon: "/lovable-uploads/4a485718-b992-40c2-996e-3ab12464999b.png",
      awards: [
        "Humanitarian Education & Capacity-Building Award",
        "Educational Innovation Award",
        "Skills Development & Youth Empowerment Award",
        "Academic Leadership for Social Change Award"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Award Categories</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Recognizing Excellence in Various Facets of Humanitarian Leadership
          </p>
        </div>
      </div>
      
      <main className="py-12">
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-gray-700">
              The Pan-African Humanitarian Leadership Award celebrates excellence across diverse areas of humanitarian work. Each category recognizes unique contributions to the development and wellbeing of African communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awardCategories.map((category, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-transform hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                <div className="h-2 bg-tpahla-purple"></div>
                <div className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <img 
                      src={category.icon} 
                      alt={category.title}
                      className="w-16 h-16 object-contain" 
                    />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-darkgreen text-center">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Key Criteria:</h4>
                    <ul className="list-disc pl-5 text-gray-600">
                      {category.criteria.map((criterion, i) => (
                        <li key={i}>{criterion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="text-center text-sm text-tpahla-purple font-medium">Click to view awards in this category</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Past Winners Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold mb-12 text-center text-tpahla-darkgreen">Past Award Recipients</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <p className="text-center text-gray-600 italic mb-6">
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
      
      <Dialog open={selectedCategory !== null} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center gap-2">
              <Award className="text-tpahla-gold" size={24} />
              <span>{selectedCategory?.title}</span>
            </DialogTitle>
            <DialogDescription className="text-base text-gray-700 mt-2">
              {selectedCategory?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-tpahla-darkgreen border-b border-gray-200 pb-2">Awards in this Category</h3>
            <ul className="space-y-3">
              {selectedCategory?.awards.map((award, i) => (
                <li key={i} className="p-3 bg-gray-50 rounded-md flex items-start">
                  <Award className="text-tpahla-gold mr-2 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-medium">{award}</p>
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
