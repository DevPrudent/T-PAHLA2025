
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Registration = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Registration</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Register to Attend The Pan-African Humanitarian Leadership Award Ceremony
          </p>
        </div>
      </div>
      
      <main className="py-12">
        {/* Registration Information */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-4 text-tpahla-darkgreen">Event Registration</h2>
                <p className="text-gray-700 mb-4">
                  Join us for the prestigious Pan-African Humanitarian Leadership Award ceremony and conference from October 15-19, 2025. Registration includes access to all event activities, including:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-6">
                  <li>Welcome reception</li>
                  <li>Conference sessions and workshops</li>
                  <li>Networking opportunities</li>
                  <li>Awards ceremony</li>
                  <li>Gala dinner</li>
                  <li>Conference materials</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-tpahla-gold p-4 rounded-r">
                  <p className="font-medium text-gray-800">
                    Early Bird Registration Deadline: June 30, 2025
                  </p>
                  <p className="text-sm text-gray-600">
                    Standard registration continues until October 1, 2025, or until capacity is reached.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-tpahla-darkgreen text-white p-6">
                  <h3 className="text-xl font-bold">Registration Fees</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">Early Bird (Until June 30)</h4>
                        <p className="text-sm text-gray-600">Full access to all events</p>
                      </div>
                      <span className="text-xl font-bold text-tpahla-darkgreen">$450</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">Standard Registration</h4>
                        <p className="text-sm text-gray-600">Full access to all events</p>
                      </div>
                      <span className="text-xl font-bold text-tpahla-darkgreen">$600</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">Group Rate (5+ people)</h4>
                        <p className="text-sm text-gray-600">Per person, full access</p>
                      </div>
                      <span className="text-xl font-bold text-tpahla-darkgreen">$400</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-800">Awards Ceremony Only</h4>
                        <p className="text-sm text-gray-600">October 18 ceremony & dinner</p>
                      </div>
                      <span className="text-xl font-bold text-tpahla-darkgreen">$250</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Registration Form */}
            <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen text-center">Registration Form</h2>
            
            <form className="bg-white rounded-lg shadow-md p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name*</label>
                  <input type="text" id="firstName" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name*</label>
                  <input type="text" id="lastName" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address*</label>
                  <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number*</label>
                  <input type="tel" id="phone" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="organization" className="block text-gray-700 font-medium mb-2">Organization/Institution</label>
                  <input type="text" id="organization" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" />
                </div>
                <div>
                  <label htmlFor="position" className="block text-gray-700 font-medium mb-2">Position/Title</label>
                  <input type="text" id="position" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="country" className="block text-gray-700 font-medium mb-2">Country*</label>
                <select id="country" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required>
                  <option value="">Select your country</option>
                  <option value="nigeria">Nigeria</option>
                  <option value="ghana">Ghana</option>
                  <option value="kenya">Kenya</option>
                  <option value="southafrica">South Africa</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="registrationType" className="block text-gray-700 font-medium mb-2">Registration Type*</label>
                <select id="registrationType" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen" required>
                  <option value="">Select registration type</option>
                  <option value="early">Early Bird - $450</option>
                  <option value="standard">Standard Registration - $600</option>
                  <option value="group">Group Rate (5+ people) - $400 per person</option>
                  <option value="ceremony">Awards Ceremony Only - $250</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="dietaryRestrictions" className="block text-gray-700 font-medium mb-2">Dietary Restrictions</label>
                <textarea id="dietaryRestrictions" rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-darkgreen"></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Will you attend the following events?</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="welcomeReception" className="h-4 w-4 text-tpahla-darkgreen focus:ring-tpahla-darkgreen border-gray-300 rounded" />
                    <label htmlFor="welcomeReception" className="ml-2 block text-gray-700">Welcome Reception (Oct 15)</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="conference" className="h-4 w-4 text-tpahla-darkgreen focus:ring-tpahla-darkgreen border-gray-300 rounded" />
                    <label htmlFor="conference" className="ml-2 block text-gray-700">Conference & Workshops (Oct 16)</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="culturalEvening" className="h-4 w-4 text-tpahla-darkgreen focus:ring-tpahla-darkgreen border-gray-300 rounded" />
                    <label htmlFor="culturalEvening" className="ml-2 block text-gray-700">Cultural Evening (Oct 16)</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="galaDinner" className="h-4 w-4 text-tpahla-darkgreen focus:ring-tpahla-darkgreen border-gray-300 rounded" />
                    <label htmlFor="galaDinner" className="ml-2 block text-gray-700">Pre-Award Gala Dinner (Oct 17)</label>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Payment Method*</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <input type="radio" id="creditCard" name="paymentMethod" className="h-4 w-4 text-tpahla-darkgreen focus:ring-tpahla-darkgreen border-gray-300" />
                    <label htmlFor="creditCard" className="ml-2 block text-gray-700">Credit Card</label>
                  </div>
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <input type="radio" id="bankTransfer" name="paymentMethod" className="h-4 w-4 text-tpahla-darkgreen focus:ring-tpahla-darkgreen border-gray-300" />
                    <label htmlFor="bankTransfer" className="ml-2 block text-gray-700">Bank Transfer</label>
                  </div>
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <input type="radio" id="mobileMoney" name="paymentMethod" className="h-4 w-4 text-tpahla-darkgreen focus:ring-tpahla-darkgreen border-gray-300" />
                    <label htmlFor="mobileMoney" className="ml-2 block text-gray-700">Mobile Money</label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <input type="checkbox" id="terms" className="h-4 w-4 text-tpahla-darkgreen focus:ring-tpahla-darkgreen border-gray-300 rounded" required />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the terms and conditions of the event. I understand that registration fees are non-refundable but transferable up to September 15, 2025.
                </label>
              </div>
              
              <button type="submit" className="w-full py-3 px-4 bg-tpahla-darkgreen text-white font-medium rounded-md hover:bg-tpahla-brightgreen transition-colors">
                Complete Registration
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                * Required fields
              </p>
            </form>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Registration;
