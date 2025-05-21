
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { CalendarDays, Info, MapPinIcon, Users } from "lucide-react";

const EventDetails = () => {
  const schedule = [{
    date: "October 15, 2025",
    title: "Arrivals & Welcome Reception",
    events: [{
      time: "All Day",
      name: "Finalist & Guest Arrivals",
      description: "Welcome to Abuja, Nigeria. Check-in at the Abuja Continental Hotel."
    }, {
      time: "18:00 - 20:00",
      name: "Welcome Reception",
      description: "An informal networking event for early arrivals. Cocktails and light refreshments will be served."
    }]
  }, {
    date: "October 16, 2025",
    title: "Conference & Workshops",
    events: [{
      time: "09:00 - 10:30",
      name: "Opening Ceremony",
      description: "Official welcome and opening remarks from TPAHLA organizers and distinguished guests."
    }, {
      time: "11:00 - 13:00",
      name: "Panel Discussion: The Future of Humanitarian Leadership in Africa",
      description: "Leading experts discuss emerging trends and challenges in humanitarian work across the continent."
    }, {
      time: "14:00 - 16:00",
      name: "Workshops",
      description: "Specialized workshops on various aspects of humanitarian work, leadership, and sustainable development."
    }, {
      time: "19:00 - 21:00",
      name: "Cultural Evening",
      description: "Celebration of African cultural heritage with performances, art, and cuisine."
    }]
  }, {
    date: "October 17, 2025",
    title: "Site Visits & Pre-Award Gala",
    events: [{
      time: "09:00 - 12:00",
      name: "Site Visits",
      description: "Optional visits to humanitarian projects in and around Abuja."
    }, {
      time: "14:00 - 16:00",
      name: "Finalists' Presentations",
      description: "Award finalists share their work, impact, and vision for the future."
    }, {
      time: "19:00 - 22:00",
      name: "Pre-Award Gala Dinner",
      description: "Semi-formal dinner with special performances and keynote address."
    }]
  }, {
    date: "October 18, 2025",
    title: "Award Ceremony",
    events: [{
      time: "10:00 - 12:00",
      name: "Media Interviews",
      description: "Press opportunities with finalists and organizers."
    }, {
      time: "14:00 - 16:00",
      name: "Final Preparations",
      description: "Rehearsals and preparation time for all participants."
    }, {
      time: "18:00 - 22:00",
      name: "TPAHLA Awards Ceremony & Gala Dinner",
      description: "The main event: awards presentation, dinner, entertainment, and celebration of humanitarian excellence."
    }]
  }, {
    date: "October 19, 2025",
    title: "Departures",
    events: [{
      time: "All Day",
      name: "Departures",
      description: "Check-out and departures. Optional city tour for those with later flights."
    }]
  }];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 bg-tpahla-darkgreen text-tpahla-text-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 text-tpahla-gold">Event Details - TPAHLA 2025</h1>
          <p className="text-lg max-w-3xl mx-auto text-tpahla-text-secondary">
            The Pan-African Humanitarian Leadership Awards Ceremony & Conference
          </p>
        </div>
      </div>
      
      <main className="py-12">
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-gold flex items-center">
                  <Info size={28} className="mr-3 text-tpahla-emerald" /> Event Overview
                </h2>
                <p className="text-tpahla-text-secondary mb-4">
                  The 2025 Pan-African Humanitarian Leadership Award ceremony will take place at the prestigious Abuja Continental Hotel in Nigeria. The event brings together humanitarian leaders, organizations, policymakers, and stakeholders from across Africa to celebrate excellence and inspire future action.
                </p>
                <p className="text-tpahla-text-secondary mb-4">
                  Beyond the awards ceremony, attendees will benefit from a comprehensive program including workshops, panel discussions, networking opportunities, and cultural experiences.
                </p>
                <div className="bg-tpahla-neutral p-4 rounded-lg border-l-4 border-tpahla-gold mt-6">
                  <p className="font-medium text-tpahla-text-primary flex items-center">
                    <CalendarDays size={20} className="mr-2 text-tpahla-gold"/> Mark your calendar: October 15-19, 2025
                  </p>
                </div>
              </div>
              <div>
                <img alt="Abuja Continental Hotel" className="rounded-lg shadow-xl border-2 border-tpahla-gold/30" src="/lovable-uploads/f6e12c6c-8ef9-4703-9637-d933aa55e1cc.png" />
              </div>
            </div>
            
            <div className="bg-tpahla-neutral rounded-lg shadow-xl p-8 mb-12 border border-tpahla-gold/20">
              <h3 className="text-2xl font-serif font-bold mb-6 text-tpahla-gold flex items-center">
                <MapPinIcon size={24} className="mr-3 text-tpahla-emerald" /> Venue Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-tpahla-text-primary mb-2">Abuja Continental Hotel</h4>
                  <p className="text-tpahla-text-secondary mb-4 text-sm">
                    Plot 701 Ahmadu Bello Way<br />
                    Cadastral Zone, Central Business District<br />
                    Abuja, FCT<br />
                    Nigeria
                  </p>
                  <p className="text-tpahla-text-secondary mb-2 text-sm">
                    <span className="font-medium text-tpahla-text-primary">Phone:</span> +234 708 060 3000
                  </p>
                  <p className="text-tpahla-text-secondary text-sm">
                    <span className="font-medium text-tpahla-text-primary">Email:</span> reservations@abujacontiental.com
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-tpahla-text-primary mb-2">Accommodations</h4>
                  <p className="text-tpahla-text-secondary mb-4 text-sm">
                    Special rates are available for TPAHLA attendees. Use code "TPAHLA2025" when booking. Rooms should be reserved by September 15, 2025 to ensure availability and special pricing.
                  </p>
                  <a href="#" className="btn-outline-gold inline-block text-sm">
                    Book Accommodation
                  </a>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-serif font-bold mb-8 text-tpahla-gold text-center relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-tpahla-emerald">Event Schedule</h2>
            
            <div className="space-y-8 mb-12">
              {schedule.map((day, index) => (
                <div key={index} className="bg-tpahla-neutral rounded-lg shadow-xl overflow-hidden border border-tpahla-gold/20">
                  <div className="bg-gradient-to-r from-tpahla-emerald to-green-700 text-white p-4">
                    <h3 className="text-xl font-medium">{day.date} - <span className="font-bold">{day.title}</span></h3>
                  </div>
                  <div className="p-6">
                    {day.events.map((event, idx) => (
                      <div key={idx} className={`${idx !== 0 ? 'border-t border-tpahla-gold/10 pt-4' : ''} ${idx !== day.events.length - 1 ? 'pb-4' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                          <p className="font-bold text-tpahla-gold text-sm mb-1 sm:mb-0">{event.time}</p>
                          <h4 className="text-lg font-semibold text-tpahla-text-primary sm:text-right">{event.name}</h4>
                        </div>
                        <p className="text-tpahla-text-secondary text-sm">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-tpahla-neutral-light rounded-lg p-8 border-t-4 border-tpahla-emerald">
              <h3 className="text-2xl font-serif font-bold mb-6 text-tpahla-gold flex items-center">
                <Users size={24} className="mr-3 text-tpahla-emerald" /> Additional Activities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-tpahla-neutral p-6 rounded-lg shadow-lg border border-tpahla-gold/10">
                  <h4 className="font-bold text-tpahla-text-primary mb-2">Guided Abuja City Tour</h4>
                  <p className="text-tpahla-text-secondary mb-2 text-sm">
                    Experience the beauty and culture of Nigeria's capital city with a guided tour of key landmarks and cultural sites.
                  </p>
                  <p className="text-xs text-tpahla-gold">Available: October 16 & 19, 2025 | Duration: 3 hours</p>
                </div>
                <div className="bg-tpahla-neutral p-6 rounded-lg shadow-lg border border-tpahla-gold/10">
                  <h4 className="font-bold text-tpahla-text-primary mb-2">Networking Reception</h4>
                  <p className="text-tpahla-text-secondary mb-2 text-sm">
                    Connect with humanitarian leaders, sponsors, and distinguished guests in a relaxed setting.
                  </p>
                  <p className="text-xs text-tpahla-gold">Date: October 17, 2025 | Time: 16:30 - 18:30</p>
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
export default EventDetails;
