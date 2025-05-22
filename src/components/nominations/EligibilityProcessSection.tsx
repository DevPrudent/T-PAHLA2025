
import React from 'react';

const EligibilityProcessSection = () => {
  return (
    <section className="container mx-auto px-4 mb-16">
      <div className="max-w-4xl mx-auto bg-tpahla-darkgreen/70 p-8 md:p-10 rounded-xl shadow-xl border border-tpahla-gold/30">
        <h2 className="text-3xl font-serif font-bold mb-8 text-tpahla-gold text-center">Eligibility & Process</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-tpahla-gold-light">Eligibility Criteria</h3>
            <ul className="space-y-3 text-gray-300">
              {[
                "Nominees must be individuals, organizations, or institutions that have made significant contributions to humanitarian service in Africa.",
                "Contributions must have been made within the past five years (2020-2025).",
                "Nominees must demonstrate tangible impact and results from their humanitarian efforts.",
                "Self-nominations are accepted, but must include references from at least two independent sources.",
                "All required documentation must be submitted along with the nomination form."
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-tpahla-gold flex-shrink-0 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-tpahla-gold-light">Nomination Process Overview</h3>
             <div className="space-y-4">
                {[
                  {step: 1, title: "Submit Nomination", desc: "Complete the multi-step nomination form with all required information."},
                  {step: 2, title: "Evaluation", desc: "Our panel of judges reviews all nominations based on the established criteria."},
                  {step: 3, title: "Selection", desc: "Finalists are selected and winners are chosen in each category."}
                ].map(item => (
                  <div key={item.step} className="flex items-start">
                    <div className="w-8 h-8 bg-tpahla-gold rounded-full flex items-center justify-center text-tpahla-darkgreen font-bold text-sm mr-3 flex-shrink-0">{item.step}</div>
                    <div>
                      <h4 className="font-semibold text-gray-200">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-6 p-4 bg-tpahla-purple/20 border-l-4 border-tpahla-purple rounded">
                <p className="font-medium text-tpahla-purple-light">Nominations Deadline: <span className="font-bold">August 15, 2025</span></p>
                <p className="text-sm text-gray-400">All nominations must be submitted by this date to be considered.</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EligibilityProcessSection;

