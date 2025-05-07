
import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Nominations = () => {
  const [isNominationOpen, setIsNominationOpen] = useState(false);
  
  useEffect(() => {
    const currentDate = new Date();
    const nominationsOpenDate = new Date(currentDate.getFullYear(), 5, 1); // June 1st
    setIsNominationOpen(currentDate >= nominationsOpenDate);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Nominations</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Submit Your Nominations for The Pan-African Humanitarian Leadership Award
          </p>
        </div>
      </div>
      
      <main className="py-12">
        {/* Nomination Process */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen text-center">Nomination Process</h2>
            
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-tpahla-darkgreen rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">1</div>
                  <h3 className="text-lg font-bold">Submit Nomination</h3>
                  <p className="text-gray-600 text-sm">Complete the nomination form with all required information about the nominee.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-tpahla-darkgreen rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">2</div>
                  <h3 className="text-lg font-bold">Evaluation</h3>
                  <p className="text-gray-600 text-sm">Our panel of judges reviews all nominations based on the established criteria.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-tpahla-darkgreen rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">3</div>
                  <h3 className="text-lg font-bold">Selection</h3>
                  <p className="text-gray-600 text-sm">Finalists are selected and winners are chosen in each category.</p>
                </div>
              </div>
              
              <div className="mt-10 p-4 bg-yellow-50 border-l-4 border-tpahla-gold rounded">
                <p className="font-medium text-tpahla-darkgreen">Nominations Deadline: August 15, 2025</p>
                <p className="text-sm text-gray-600">All nominations must be submitted by this date to be considered for the 2025 awards.</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen text-center">Eligibility Criteria</h2>
            
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Nominees must be individuals, organizations, or institutions that have made significant contributions to humanitarian service in Africa.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Contributions must have been made within the past five years (2020-2025).</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Nominees must demonstrate tangible impact and results from their humanitarian efforts.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Self-nominations are accepted, but must include references from at least two independent sources.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">All required documentation must be submitted along with the nomination form.</span>
                </li>
              </ul>
            </div>
            
            {/* Nomination Form or Notice */}
            <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen text-center">Nomination Form</h2>
            
            {isNominationOpen ? (
              <form className="bg-white rounded-lg shadow-md p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="nomineeName" className="block text-gray-700 font-medium mb-2">Nominee Name*</label>
                    <input type="text" id="nomineeName" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required />
                  </div>
                  <div>
                    <label htmlFor="nomineeType" className="block text-gray-700 font-medium mb-2">Nominee Type*</label>
                    <select id="nomineeType" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required>
                      <option value="">Select an option</option>
                      <option value="individual">Individual</option>
                      <option value="organization">Organization</option>
                      <option value="institution">Institution</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="awardCategory" className="block text-gray-700 font-medium mb-2">Award Category*</label>
                  <select id="awardCategory" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required>
                    <option value="">Select a category</option>
                    <option value="leadership">Humanitarian Leadership & Legacy</option>
                    <option value="youth">Youth Empowerment & Gender Equality</option>
                    <option value="disaster">Disaster Relief & Crisis Management</option>
                    <option value="health">Health & Wellbeing</option>
                    <option value="environment">Environmental Sustainability</option>
                    <option value="education">Education & Capacity Building</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="achievement" className="block text-gray-700 font-medium mb-2">Summary of Achievement*</label>
                  <textarea id="achievement" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required></textarea>
                  <p className="text-sm text-gray-500 mt-1">Briefly describe the nominee's contributions and impact (max 500 words).</p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="evidence" className="block text-gray-700 font-medium mb-2">Supporting Evidence*</label>
                  <input type="file" id="evidence" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required />
                  <p className="text-sm text-gray-500 mt-1">Upload documents, photos, or other evidence supporting the nomination (PDF, JPG, PNG formats, max 10MB).</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="nominator" className="block text-gray-700 font-medium mb-2">Your Name*</label>
                    <input type="text" id="nominator" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Your Email*</label>
                    <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required />
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <input type="checkbox" id="terms" className="h-4 w-4 text-tpahla-darkgreen focus:ring-tpahla-darkgreen border-gray-300 rounded" required />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I confirm that all information provided is accurate and complete.
                  </label>
                </div>
                
                <button type="submit" className="w-full py-3 px-4 bg-tpahla-darkgreen text-white font-medium rounded-md hover:bg-tpahla-brightgreen transition-colors">
                  Submit Nomination
                </button>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  * Required fields
                </p>
              </form>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8">
                <Alert className="bg-tpahla-purple/10 border-tpahla-purple mb-6">
                  <AlertCircle className="h-4 w-4 text-tpahla-purple" />
                  <AlertDescription>
                    <span className="font-medium">Nominations are not yet open.</span> The nomination period will begin in June 2025.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="h-10 w-10 text-tpahla-purple" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Nominations Opening Soon</h3>
                  <p className="text-gray-600 mb-6">
                    The nomination period for the 2025 Pan-African Humanitarian Leadership Awards will open in June 2025.
                    Please check back then to submit your nominations.
                  </p>
                  
                  <div className="py-4 px-6 bg-gray-50 rounded-lg inline-block">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-tpahla-darkgreen mr-2" />
                      <span className="font-medium">Nominations Open: <span className="text-tpahla-darkgreen">June 1, 2025</span></span>
                    </div>
                    <div className="flex items-center mt-2">
                      <CalendarIcon className="h-5 w-5 text-tpahla-red mr-2" />
                      <span className="font-medium">Nominations Close: <span className="text-tpahla-red">August 15, 2025</span></span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button variant="tpahla-secondary" className="px-8">
                      Get Notified When Nominations Open
                    </Button>
                  </div>
                </div>
                
                <div className="mt-10 border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-bold mb-4">Prepare for Nominations</h4>
                  <p className="text-gray-600 mb-4">
                    While you wait for nominations to open, you can prepare by:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Researching potential nominees' humanitarian contributions</li>
                    <li>Gathering supporting documentation and evidence</li>
                    <li>Reviewing the award categories and eligibility criteria</li>
                    <li>Reaching out to potential referees for your nomination</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Nominations;
