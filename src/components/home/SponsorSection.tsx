
const SponsorSection = () => {
  const sponsorTiers = [
    {
      name: "Platinum",
      price: "$25,000",
      description: "Premier sponsorship with maximum visibility and exclusive benefits",
      benefits: [
        "Prominent logo placement on all event materials",
        "VIP table (10 seats) at Awards Gala Dinner",
        "Speaking opportunity during the main ceremony",
        "Full-page advertisement in event program",
        "Exclusive sponsor of one award category",
        "Premium exhibition space throughout the event",
        "Feature article in post-event publication",
        "10 branded social media posts",
        "Logo on event livestream",
        "Access to VIP networking reception"
      ],
      featured: true
    },
    {
      name: "Gold",
      price: "$15,000",
      description: "Enhanced visibility and comprehensive brand integration",
      benefits: [
        "Logo on all event materials and website",
        "5 VIP tickets to Awards Gala Dinner",
        "Half-page advertisement in event program",
        "Exhibition space throughout the event",
        "Recognition during awards ceremony",
        "5 branded social media posts",
        "Logo on event livestream",
        "Access to VIP networking reception"
      ]
    },
    {
      name: "Silver",
      price: "$7,500",
      description: "Strong presence with quality brand exposure",
      benefits: [
        "Logo on select event materials and website",
        "3 tickets to Awards Gala Dinner",
        "Quarter-page advertisement in event program",
        "Shared exhibition space",
        "Recognition during awards ceremony",
        "3 branded social media posts"
      ]
    },
    {
      name: "Bronze",
      price: "$3,500",
      description: "Entry-level sponsorship with valuable benefits",
      benefits: [
        "Logo on event website",
        "2 tickets to Awards Gala Dinner",
        "Recognition in event program",
        "Recognition during awards ceremony",
        "1 branded social media post"
      ]
    }
  ];

  return (
    <section id="sponsors" className="section-container">
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h2 className="section-title relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-tpahla-gold">
          Sponsorship Opportunities
        </h2>
        <p className="section-subtitle text-gray-600">
          Partner with TPAHLA to support humanitarian excellence while gaining valuable visibility for your organization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sponsorTiers.map((tier, index) => (
          <div 
            key={index} 
            className={`
              rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col
              ${tier.featured ? 'border-2 border-tpahla-gold shadow-lg relative transform hover:-translate-y-1' : 'border border-gray-200 shadow-md'}
            `}
          >
            {tier.featured && (
              <div className="absolute top-0 right-0">
                <div className="bg-tpahla-gold text-white text-xs font-bold px-3 py-1 transform translate-x-6 translate-y-3 rotate-45">
                  POPULAR
                </div>
              </div>
            )}
            
            <div className={`p-6 ${tier.featured ? 'bg-tpahla-gold text-white' : 'bg-white'}`}>
              <h3 className="text-xl font-serif font-bold mb-1">{tier.name}</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{tier.price}</span>
              </div>
              <p className={`mt-2 text-sm ${tier.featured ? 'text-white/90' : 'text-gray-600'}`}>{tier.description}</p>
            </div>
            
            <div className="bg-white p-6 flex-grow">
              <ul className="space-y-3">
                {tier.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-baseline">
                    <svg className="h-5 w-5 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button className={`
                w-full py-2 px-4 rounded-md transition-colors
                ${tier.featured 
                  ? 'bg-tpahla-gold hover:bg-amber-600 text-white' 
                  : 'bg-white border border-tpahla-purple text-tpahla-purple hover:bg-tpahla-purple hover:text-white'}
              `}>
                Select {tier.name}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-tpahla-purple/10 p-8 rounded-lg max-w-3xl mx-auto">
        <h3 className="text-2xl font-serif font-bold mb-4 text-center">Custom Sponsorship</h3>
        <p className="text-gray-600 text-center mb-6">
          Don't see a package that fits your needs? We offer customized sponsorship opportunities tailored to your organization's specific objectives.
        </p>
        <div className="flex justify-center">
          <button className="btn-primary">
            Contact for Custom Package
          </button>
        </div>
      </div>
      
      <div className="mt-16">
        <h3 className="text-2xl font-serif font-bold text-center mb-8">Current Sponsors</h3>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">Logo 1</div>
          <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">Logo 2</div>
          <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">Logo 3</div>
          <div className="w-32 h-16 bg-gray-200 rounded flex items-center justify-center">Logo 4</div>
        </div>
      </div>
    </section>
  );
};

export default SponsorSection;
