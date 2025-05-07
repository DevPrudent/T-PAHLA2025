
const NominationSection = () => {
  const nominationSteps = [
    {
      number: "01",
      title: "Review Eligibility Criteria",
      description: "Ensure your nominee meets all the requirements for their chosen award category."
    },
    {
      number: "02",
      title: "Complete Nomination Form",
      description: "Fill out the detailed nomination form with accurate information about the nominee."
    },
    {
      number: "03",
      title: "Submit Supporting Documents",
      description: "Upload all required evidence and documentation to strengthen the nomination."
    },
    {
      number: "04",
      title: "Verification Process",
      description: "Our team reviews and verifies all submitted information for accuracy."
    },
  ];

  return (
    <section id="nominations" className="section-container">
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h2 className="section-title relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-tpahla-gold">
          Nomination Process
        </h2>
        <p className="section-subtitle text-gray-600">
          Nominate outstanding leaders, organizations, and institutions making significant humanitarian impact across Africa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-serif font-bold mb-6 pb-3 border-b border-gray-200">Nomination Form</h3>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="nominator_name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  id="nominator_name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="nominator_email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input 
                  type="email" 
                  id="nominator_email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label htmlFor="nominee_name" className="block text-sm font-medium text-gray-700 mb-1">Nominee Name</label>
                <input 
                  type="text" 
                  id="nominee_name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                  placeholder="Enter nominee's full name"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Award Category</label>
                <select 
                  id="category" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                >
                  <option value="">Select a category</option>
                  <option value="leadership">Humanitarian Leadership & Legacy</option>
                  <option value="youth">Youth Empowerment & Gender Equality</option>
                  <option value="disaster">Disaster Relief & Crisis Management</option>
                  <option value="health">Health & Social Welfare Excellence</option>
                  <option value="environment">Environmental Sustainability</option>
                  <option value="education">Education & Capacity Building</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Reason for Nomination</label>
                <textarea 
                  id="reason" 
                  rows={4} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                  placeholder="Explain why this nominee deserves recognition"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-tpahla-purple transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-tpahla-purple hover:text-tpahla-darkpurple">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-tpahla-purple hover:bg-tpahla-darkpurple text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tpahla-purple"
                >
                  Submit Nomination
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-serif font-bold mb-6">How the Process Works</h3>
          
          <div className="space-y-8">
            {nominationSteps.map((step, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-tpahla-gold text-white font-bold font-serif">
                    {step.number}
                  </div>
                </div>
                <div className="pt-1">
                  <h4 className="text-xl font-serif font-bold mb-2">{step.title}</h4>
                  <p className="text-gray-600">{step.description}</p>
                  {index !== nominationSteps.length - 1 && (
                    <div className="h-10 border-l-2 border-dashed border-gray-300 ml-6 my-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-tpahla-purple/10 rounded-lg border-l-4 border-tpahla-purple">
            <h4 className="text-lg font-serif font-bold mb-2">Judging Criteria</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Impact and Reach of Initiative</li>
              <li>Innovation and Creativity</li>
              <li>Sustainability and Scalability</li>
              <li>Leadership and Vision</li>
              <li>Community Involvement</li>
            </ul>
          </div>
          
          <div className="mt-8 text-center">
            <p className="font-medium text-tpahla-purple text-lg">
              Nomination Deadline: August 15, 2025
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NominationSection;
