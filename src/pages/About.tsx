
import React from 'react';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageBreadcrumb from '../components/layout/PageBreadcrumb';

const About = () => {
  const breadcrumbItems = [
    { label: 'About', href: '/about' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20">
        <PageBreadcrumb items={breadcrumbItems} />
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">About TPAHLA</h2>
              
              <div className="prose max-w-none">
                <p className="text-lg mb-6">
                  The Pan-African Humanitarian Leadership Award (TPAHLA) is a prestigious recognition program honoring outstanding leaders, organizations, and institutions that have made significant contributions to humanitarian service across Africa.
                </p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-serif font-bold mb-4">Our Vision</h3>
                  <p>
                    To inspire and promote humanitarian excellence across Africa by recognizing those who have demonstrated exceptional leadership and service in addressing humanitarian challenges and improving lives.
                  </p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-serif font-bold mb-4">Our Mission</h3>
                  <p>
                    We identify, celebrate, and promote extraordinary humanitarian leadership across Africa, fostering a culture of service, collaboration, and innovation in addressing pressing humanitarian issues.
                  </p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-serif font-bold mb-4">Core Values</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Excellence:</strong> Recognizing and promoting the highest standards of humanitarian service.</li>
                    <li><strong>Integrity:</strong> Upholding ethical principles and transparency in all our operations.</li>
                    <li><strong>Inclusivity:</strong> Embracing diversity and ensuring representation across different regions, sectors, and demographics.</li>
                    <li><strong>Impact:</strong> Focusing on recognizing work that creates meaningful, sustainable change in communities.</li>
                    <li><strong>Innovation:</strong> Celebrating creative approaches to addressing humanitarian challenges.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif font-bold mb-4">Our History</h3>
                  <p>
                    Founded in 2020, TPAHLA emerged from a vision to spotlight the often unrecognized humanitarian heroes across the African continent. What began as a small recognition ceremony has grown into a continent-wide celebration of humanitarian excellence, drawing participants and nominees from all regions of Africa.
                  </p>
                  <p className="mt-4">
                    The awards are organized by the Institute for Humanitarian Studies and Social Development (IHSSD) in partnership with Hempawa Consult, bringing together expertise in humanitarian affairs, social development, and event management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
