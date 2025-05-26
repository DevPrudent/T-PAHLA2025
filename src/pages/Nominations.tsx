import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NominationProvider, useNomination } from "@/contexts/NominationContext";
import NominationStepA from "@/components/nominations/NominationStepA";
import NominationStepB from "@/components/nominations/NominationStepB"; // Import NominationStepB
import { Button } from "@/components/ui/button";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EligibilityProcessSection = () => (
  <div className="max-w-4xl mx-auto text-gray-700 dark:text-gray-300">
    <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen dark:text-tpahla-gold text-center">Nomination Process</h2>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-tpahla-darkgreen dark:bg-tpahla-gold rounded-full flex items-center justify-center text-white dark:text-tpahla-darkgreen text-2xl font-bold mx-auto">1</div>
          <h3 className="text-lg font-bold">Submit Nomination</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Complete the nomination form with all required information about the nominee.</p>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 bg-tpahla-darkgreen dark:bg-tpahla-gold rounded-full flex items-center justify-center text-white dark:text-tpahla-darkgreen text-2xl font-bold mx-auto">2</div>
          <h3 className="text-lg font-bold">Evaluation</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Our panel of judges reviews all nominations based on the established criteria.</p>
        </div>
        <div className="space-y-4">
          <div className="w-16 h-16 bg-tpahla-darkgreen dark:bg-tpahla-gold rounded-full flex items-center justify-center text-white dark:text-tpahla-darkgreen text-2xl font-bold mx-auto">3</div>
          <h3 className="text-lg font-bold">Selection</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Finalists are selected and winners are chosen in each category.</p>
        </div>
      </div>
      
      <div className="mt-10 p-4 bg-yellow-50 dark:bg-yellow-400/10 border-l-4 border-tpahla-gold rounded">
        <p className="font-medium text-tpahla-darkgreen dark:text-tpahla-gold">Nominations Deadline: August 15, 2025</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">All nominations must be submitted by this date to be considered for the 2025 awards.</p>
      </div>
    </div>
    
    <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen dark:text-tpahla-gold text-center">Eligibility Criteria</h2>
    
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
      <ul className="space-y-4">
        <li className="flex items-start">
          <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">Nominees must be individuals, organizations, or institutions that have made significant contributions to humanitarian service in Africa.</span>
        </li>
        <li className="flex items-start">
          <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">Contributions must have been made within the past five years (2020-2025).</span>
        </li>
        <li className="flex items-start">
          <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">Nominees must demonstrate tangible impact and results from their humanitarian efforts.</span>
        </li>
        <li className="flex items-start">
          <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">Self-nominations are accepted, but must include references from at least two independent sources.</span>
        </li>
        <li className="flex items-start">
          <svg className="h-6 w-6 text-tpahla-gold flex-shrink-0 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">All required documentation must be submitted along with the nomination form.</span>
        </li>
      </ul>
    </div>
  </div>
);

const CallToActionSection = () => (
  <section className="py-16 bg-gray-800 dark:bg-gray-900 text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-tpahla-gold mb-6">
        Ready to Nominate an African Hero?
      </h2>
      <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
        Your nomination can shine a light on extraordinary individuals and organizations making a significant impact.
        Click the button below to start the nomination process.
      </p>
      <Link to="/nomination-form">
        <Button variant="tpahla-primary" size="lg" className="px-12 py-4 text-xl">
          START A NOMINATION NOW
        </Button>
      </Link>
    </div>
  </section>
);

const Nominations = () => {
  return (
    <>
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Nominations</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Submit Your Nominations for The Pan-African Humanitarian Leadership Award
          </p>
        </div>
      </div>
      
      <main className="bg-background dark:bg-gray-900">
        <section className="container mx-auto px-4 py-12 mb-16">
          <EligibilityProcessSection />
        </section>

        {/* CTA Section added here, before the footer would be rendered by PublicLayout */}
        <CallToActionSection />
      </main>
    </>
  );
};

export default Nominations;
