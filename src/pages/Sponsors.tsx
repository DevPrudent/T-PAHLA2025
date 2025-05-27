// Navbar and Footer imports are removed
import SponsorSection from "../components/home/SponsorSection";

const Sponsors = () => {
  const brochureUrl = "https://zrutcdhfqahfduxppudv.supabase.co/storage/v1/object/public/documents/TPAHLA%202025%20BROCHURE%2033";

  return (
    <>
      {/* Page Header: Adjusted pb-8 from pb-12 */}
      <div className="pb-8 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Sponsorship Opportunities</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Partner with TPAHLA to Support Humanitarian Excellence in Africa
          </p>
        </div>
      </div>
      
      {/* Content area will now inherit bg-background from PublicLayout */}
      <div>
        {/* Sponsorship Overview: Adjusted pt-8 from py-12 */}
        <section className="container mx-auto px-4 pt-8 pb-12 mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold">Why Sponsor TPAHLA?</h2>
            <p className="text-tpahla-text-secondary">
              By sponsoring The Pan-African Humanitarian Leadership Award, your organization demonstrates commitment to sustainable development and humanitarian excellence across Africa while gaining valuable visibility among key stakeholders.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {/* Card 1 */}
            <div className="bg-card p-6 rounded-lg shadow-md text-center border border-border">
              <div className="w-16 h-16 bg-tpahla-darkgreen rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-text-primary">Brand Visibility</h3>
              <p className="text-tpahla-text-secondary">
                Showcase your brand to influential leaders, organizations, and media from across Africa and beyond.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-card p-6 rounded-lg shadow-md text-center border border-border">
              <div className="w-16 h-16 bg-tpahla-darkgreen rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-text-primary">Networking</h3>
              <p className="text-tpahla-text-secondary">
                Connect with government officials, humanitarian leaders, and potential partners in a prestigious setting.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-card p-6 rounded-lg shadow-md text-center border border-border">
              <div className="w-16 h-16 bg-tpahla-darkgreen rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-tpahla-text-primary">Corporate Social Responsibility</h3>
              <p className="text-tpahla-text-secondary">
                Demonstrate your organization's commitment to social development and humanitarian causes in Africa.
              </p>
            </div>
          </div>
        </section>
        
        <SponsorSection /> {/* Assuming SponsorSection is dark-theme compatible or will be updated separately */}
        
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-tpahla-darkgreen text-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Ready to Become a Sponsor?</h2>
              <p className="mb-6">
                Contact our sponsorship team to discuss package options and custom opportunities for your organization.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-tpahla-gold mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>sponsors@tpahla.org</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-tpahla-gold mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+234 123 456 7890</span>
                </div>
              </div>
              <div className="mt-8">
                <a 
                  href={brochureUrl} 
                  download="TPAHLA_2025_Sponsorship_Brochure.pdf" // Suggests a filename to the browser
                  target="_blank" // Opens in a new tab, good for PDFs
                  rel="noopener noreferrer" // Security best practice for target="_blank"
                  className="inline-block bg-tpahla-gold text-tpahla-darkgreen font-medium py-2 px-6 rounded-md hover:bg-opacity-80 hover:text-tpahla-darkgreen transition-colors"
                >
                  Download Sponsorship Brochure
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Sponsors;
