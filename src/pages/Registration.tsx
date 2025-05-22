
// Removed Navbar and Footer imports

const Registration = () => {
  return (
    // Root div no longer needs min-h-screen or bg-white, PublicLayout handles this.
    <>
      {/* Page Header: Removed pt-24 */}
      <div className="pb-12 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Registration</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Register to Attend The Pan-African Humanitarian Leadership Award Ceremony
          </p>
        </div>
      </div>
      
      {/* main tag removed, using default from PublicLayout which includes py-12 equivalent spacing via pt-24 on main and page-specific pb-12 or section py */}
      <div className="py-12"> {/* Added py-12 for consistency with original main tag */}
        {/* Registration Information */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-4 text-tpahla-gold">Event Registration</h2>
                <p className="text-tpahla-text-secondary mb-4">
                  Join us for the prestigious Pan-African Humanitarian Leadership Award ceremony and conference from October 15-19, 2025. Registration includes access to all event activities, including:
                </p>
                <ul className="list-disc pl-5 text-tpahla-text-secondary space-y-2 mb-6">
                  <li>Welcome reception</li>
                  <li>Conference sessions and workshops</li>
                  <li>Networking opportunities</li>
                  <li>Awards ceremony</li>
                  <li>Gala dinner</li>
                  <li>Conference materials</li>
                </ul>
                <div className="bg-muted border-l-4 border-tpahla-gold p-4 rounded-r">
                  <p className="font-medium text-tpahla-text-primary">
                    Early Bird Registration Deadline: June 30, 2025
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Standard registration continues until October 1, 2025, or until capacity is reached.
                  </p>
                </div>
              </div>
              <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
                <div className="bg-tpahla-darkgreen text-white p-6">
                  <h3 className="text-xl font-bold">Registration Fees</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <div>
                        <h4 className="font-bold text-tpahla-text-primary">Early Bird (Until June 30)</h4>
                        <p className="text-sm text-muted-foreground">Full access to all events</p>
                      </div>
                      <span className="text-xl font-bold text-tpahla-gold">$450</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <div>
                        <h4 className="font-bold text-tpahla-text-primary">Standard Registration</h4>
                        <p className="text-sm text-muted-foreground">Full access to all events</p>
                      </div>
                      <span className="text-xl font-bold text-tpahla-gold">$600</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <div>
                        <h4 className="font-bold text-tpahla-text-primary">Group Rate (5+ people)</h4>
                        <p className="text-sm text-muted-foreground">Per person, full access</p>
                      </div>
                      <span className="text-xl font-bold text-tpahla-gold">$400</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-tpahla-text-primary">Awards Ceremony Only</h4>
                        <p className="text-sm text-muted-foreground">October 18 ceremony & dinner</p>
                      </div>
                      <span className="text-xl font-bold text-tpahla-gold">$250</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Registration Form */}
            <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold text-center">Registration Form</h2>
            
            <form className="bg-card rounded-lg shadow-md p-8 border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-tpahla-text-primary font-medium mb-2">First Name*</label>
                  <input type="text" id="firstName" className="w-full px-4 py-2 border border-input rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-tpahla-text-primary font-medium mb-2">Last Name*</label>
                  <input type="text" id="lastName" className="w-full px-4 py-2 border border-input rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-tpahla-text-primary font-medium mb-2">Email Address*</label>
                  <input type="email" id="email" className="w-full px-4 py-2 border border-input rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-tpahla-text-primary font-medium mb-2">Phone Number*</label>
                  <input type="tel" id="phone" className="w-full px-4 py-2 border border-input rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="organization" className="block text-tpahla-text-primary font-medium mb-2">Organization/Institution</label>
                  <input type="text" id="organization" className="w-full px-4 py-2 border border-input rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label htmlFor="position" className="block text-tpahla-text-primary font-medium mb-2">Position/Title</label>
                  <input type="text" id="position" className="w-full px-4 py-2 border border-input rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="country" className="block text-tpahla-text-primary font-medium mb-2">Country*</label>
                <select id="country" className="w-full px-4 py-2 border border-input rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" required>
                  <option value="">Select your country</option>
                  <option value="nigeria">Nigeria</option>
                  <option value="ghana">Ghana</option>
                  <option value="kenya">Kenya</option>
                  <option value="southafrica">South Africa</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="registrationType" className="block text-tpahla-text-primary font-medium mb-2">Registration Type*</label>
                <select id="registrationType" className="w-full px-4 py-2 border border-input rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" required>
                  <option value="">Select registration type</option>
                  <option value="early">Early Bird - $450</option>
                  <option value="standard">Standard Registration - $600</option>
                  <option value="group">Group Rate (5+ people) - $400 per person</option>
                  <option value="ceremony">Awards Ceremony Only - $250</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="dietaryRestrictions" className="block text-tpahla-text-primary font-medium mb-2">Dietary Restrictions</label>
                <textarea id="dietaryRestrictions" rows={2} className="w-full px-4 py-2 border border-input rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-tpahla-text-primary font-medium mb-2">Will you attend the following events?</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="welcomeReception" className="h-4 w-4 text-tpahla-gold focus:ring-ring border-input rounded" />
                    <label htmlFor="welcomeReception" className="ml-2 block text-tpahla-text-secondary">Welcome Reception (Oct 15)</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="conference" className="h-4 w-4 text-tpahla-gold focus:ring-ring border-input rounded" />
                    <label htmlFor="conference" className="ml-2 block text-tpahla-text-secondary">Conference & Workshops (Oct 16)</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="culturalEvening" className="h-4 w-4 text-tpahla-gold focus:ring-ring border-input rounded" />
                    <label htmlFor="culturalEvening" className="ml-2 block text-tpahla-text-secondary">Cultural Evening (Oct 16)</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="galaDinner" className="h-4 w-4 text-tpahla-gold focus:ring-ring border-input rounded" />
                    <label htmlFor="galaDinner" className="ml-2 block text-tpahla-text-secondary">Pre-Award Gala Dinner (Oct 17)</label>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-tpahla-text-primary font-medium mb-2">Payment Method*</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center p-4 border border-border rounded-lg bg-input">
                    <input type="radio" id="creditCard" name="paymentMethod" className="h-4 w-4 text-tpahla-gold focus:ring-ring border-input" />
                    <label htmlFor="creditCard" className="ml-2 block text-tpahla-text-secondary">Credit Card</label>
                  </div>
                  <div className="flex items-center p-4 border border-border rounded-lg bg-input">
                    <input type="radio" id="bankTransfer" name="paymentMethod" className="h-4 w-4 text-tpahla-gold focus:ring-ring border-input" />
                    <label htmlFor="bankTransfer" className="ml-2 block text-tpahla-text-secondary">Bank Transfer</label>
                  </div>
                  <div className="flex items-center p-4 border border-border rounded-lg bg-input">
                    <input type="radio" id="mobileMoney" name="paymentMethod" className="h-4 w-4 text-tpahla-gold focus:ring-ring border-input" />
                    <label htmlFor="mobileMoney" className="ml-2 block text-tpahla-text-secondary">Mobile Money</label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <input type="checkbox" id="terms" className="h-4 w-4 text-tpahla-gold focus:ring-ring border-input rounded" required />
                <label htmlFor="terms" className="ml-2 block text-sm text-tpahla-text-secondary">
                  I agree to the terms and conditions of the event. I understand that registration fees are non-refundable but transferable up to September 15, 2025.
                </label>
              </div>
              
              <button type="submit" className="w-full py-3 px-4 bg-tpahla-darkgreen text-white font-medium rounded-md hover:bg-tpahla-emerald transition-colors">
                Complete Registration
              </button>
              
              <p className="text-center text-sm text-muted-foreground mt-4">
                * Required fields
              </p>
            </form>
          </div>
        </section>
      </div>
      {/* Footer is handled by PublicLayout */}
    </>
  );
};

export default Registration;
