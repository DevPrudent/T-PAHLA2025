
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Awards = () => {
  const awardCategories = [
    {
      title: "Humanitarian Leadership & Legacy",
      description: "Recognizing individuals who have demonstrated exceptional leadership in humanitarian initiatives with long-lasting impact across African communities.",
      criteria: ["Demonstrated leadership in humanitarian work", "Measurable impact on communities", "Longevity of contributions", "Innovation in addressing challenges"],
      icon: "🏆"
    },
    {
      title: "Youth Empowerment & Gender Equality",
      description: "Honoring leaders who have made significant contributions to advancing youth development and gender equality in Africa.",
      criteria: ["Innovative youth programs", "Advancement of gender equality", "Educational initiatives", "Empowerment outcomes"],
      icon: "⚖️"
    },
    {
      title: "Disaster Relief & Crisis Management",
      description: "Celebrating organizations and individuals who have shown exceptional response to disasters and crisis situations in Africa.",
      criteria: ["Rapid and effective response", "Lives saved and improved", "Resource mobilization", "Sustainable recovery support"],
      icon: "🛟"
    },
    {
      title: "Health & Wellbeing",
      description: "Recognizing outstanding contributions to improving healthcare access and wellbeing across African communities.",
      criteria: ["Healthcare access improvements", "Disease prevention initiatives", "Mental health support", "Innovative health solutions"],
      icon: "🏥"
    },
    {
      title: "Environmental Sustainability",
      description: "Honoring individuals and organizations championing environmental conservation and sustainable practices in Africa.",
      criteria: ["Environmental protection initiatives", "Community involvement", "Sustainable resource management", "Climate action leadership"],
      icon: "🌍"
    },
    {
      title: "Education & Capacity Building",
      description: "Celebrating exceptional contributions to education and skills development across Africa.",
      criteria: ["Educational access improvements", "Quality of education initiatives", "Skills development programs", "Educational infrastructure"],
      icon: "📚"
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
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="h-24 bg-tpahla-darkgreen flex items-center justify-center">
                  <span className="text-5xl">{category.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-darkgreen">{category.title}</h3>
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
      
      <Footer />
    </div>
  );
};

export default Awards;
