
const RegistrationSection = () => {
  const ticketOptions = [
    {
      name: "VIP Pass",
      price: "$350",
      features: [
        "Access to all event sessions",
        "VIP reserved seating at the Awards Gala",
        "Exclusive networking reception",
        "Welcome gift package",
        "Certificate of participation",
        "Access to digital content library",
        "VIP lounge access"
      ]
    },
    {
      name: "General Admission",
      price: "$150",
      features: [
        "Access to all event sessions",
        "Standard seating at the Awards Gala",
        "Certificate of participation",
        "Access to digital content library"
      ]
    },
    {
      name: "Digital Pass",
      price: "$50",
      features: [
        "Live stream access to all sessions",
        "Digital program materials",
        "Certificate of participation",
        "30-day access to event recordings"
      ]
    }
  ];

  return (
    <section id="register" className="py-20 bg-tpahla-purple/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="section-title relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-tpahla-gold">
            Register for the Event
          </h2>
          <p className="section-subtitle text-gray-600">
            Secure your spot at the prestigious Pan-African Humanitarian Leadership Awards ceremony
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {ticketOptions.map((ticket, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-serif font-bold mb-2">{ticket.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-tpahla-purple">{ticket.price}</span>
                  <span className="ml-1 text-gray-500">per person</span>
                </div>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3">
                  {ticket.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-baseline">
                      <svg className="h-5 w-5 text-tpahla-gold mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button className="w-full py-2 px-4 bg-tpahla-purple hover:bg-tpahla-darkpurple text-white font-medium rounded-md transition-colors">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-serif font-bold mb-3">Registration Form</h3>
              <p className="text-gray-600">Please fill out the form below to register for the TPAHLA event</p>
            </div>
            
            <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    id="first_name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    id="last_name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input 
                  type="text" 
                  id="organization" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                  placeholder="Enter your organization name"
                />
              </div>
              
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position/Title</label>
                <input 
                  type="text" 
                  id="position" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                  placeholder="Enter your position or title"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select 
                  id="country" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                >
                  <option value="">Select your country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="ticket_type" className="block text-sm font-medium text-gray-700 mb-1">Ticket Type</label>
                <select 
                  id="ticket_type" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                >
                  <option value="">Select ticket type</option>
                  <option value="vip">VIP Pass ($350)</option>
                  <option value="general">General Admission ($150)</option>
                  <option value="digital">Digital Pass ($50)</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="special_requirements" className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                <textarea 
                  id="special_requirements" 
                  rows={3} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tpahla-purple focus:border-transparent transition-colors"
                  placeholder="Please specify any dietary requirements, accessibility needs, or other special requests"
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input 
                      id="terms" 
                      type="checkbox" 
                      className="focus:ring-tpahla-purple h-4 w-4 text-tpahla-purple border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-600">
                      I agree to the <a href="#" className="text-tpahla-purple hover:underline">terms and conditions</a> and <a href="#" className="text-tpahla-purple hover:underline">privacy policy</a>.
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <button 
                  type="submit" 
                  className="w-full bg-tpahla-purple hover:bg-tpahla-darkpurple text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tpahla-purple"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
