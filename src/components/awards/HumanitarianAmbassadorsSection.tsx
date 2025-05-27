
import React from 'react';

const HumanitarianAmbassadorsSection: React.FC = () => {
  return (
    <section className="py-16 bg-tpahla-neutral-light">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-tpahla-emerald">
            Unveiling of Humanitarian Ambassadors
          </h2>
          <p className="text-xl text-tpahla-text-secondary mb-8">
            A Key Highlight of the TPAHLA 2025 Programme
          </p>
          <div className="bg-tpahla-neutral p-8 rounded-lg shadow-xl border-t-4 border-tpahla-gold">
            <p className="text-tpahla-text-secondary text-left leading-relaxed">
              As part of the Pan-African Humanitarian Leadership Award (TPAHLA) programme, the unveiling of Humanitarian Ambassadors will be a key highlight. These ambassadors are outstanding individuals selected for their unwavering commitment to humanitarian service and their ability to advocate for and drive change across the continent. Their leadership qualities, impactful work in various humanitarian causes, and influence will serve as an inspiration to others and reinforce the spirit of altruism across Africa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HumanitarianAmbassadorsSection;

