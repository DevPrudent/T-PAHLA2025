
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const EventDetails = () => {
  const schedule = [
    {
      date: "October 15, 2025",
      title: "Arrivals & Welcome Reception",
      events: [
        {
          time: "All Day",
          name: "Finalist & Guest Arrivals",
          description: "Welcome to Abuja, Nigeria. Check-in at the Abuja Continental Hotel."
        },
        {
          time: "18:00 - 20:00",
          name: "Welcome Reception",
          description: "An informal networking event for early arrivals. Cocktails and light refreshments will be served."
        }
      ]
    },
    {
      date: "October 16, 2025",
      title: "Conference & Workshops",
      events: [
        {
          time: "09:00 - 10:30",
          name: "Opening Ceremony",
          description: "Official welcome and opening remarks from TPAHLA organizers and distinguished guests."
        },
        {
          time: "11:00 - 13:00",
          name: "Panel Discussion: The Future of Humanitarian Leadership in Africa",
          description: "Leading experts discuss emerging trends and challenges in humanitarian work across the continent."
        },
        {
          time: "14:00 - 16:00",
          name: "Workshops",
          description: "Specialized workshops on various aspects of humanitarian work, leadership, and sustainable development."
        },
        {
          time: "19:00 - 21:00",
          name: "Cultural Evening",
          description: "Celebration of African cultural heritage with performances, art, and cuisine."
        }
      ]
    },
    {
      date: "October 17, 2025",
      title: "Site Visits & Pre-Award Gala",
      events: [
        {
          time: "09:00 - 12:00",
          name: "Site Visits",
          description: "Optional visits to humanitarian projects in and around Abuja."
        },
        {
          time: "14:00 - 16:00",
          name: "Finalists' Presentations",
          description: "Award finalists share their work, impact, and vision for the future."
        },
        {
          time: "19:00 - 22:00",
          name: "Pre-Award Gala Dinner",
          description: "Semi-formal dinner with special performances and keynote address."
        }
      ]
    },
    {
      date: "October 18, 2025",
      title: "Award Ceremony",
      events: [
        {
          time: "10:00 - 12:00",
          name: "Media Interviews",
          description: "Press opportunities with finalists and organizers."
        },
        {
          time: "14:00 - 16:00",
          name: "Final Preparations",
          description: "Rehearsals and preparation time for all participants."
        },
        {
          time: "18:00 - 22:00",
          name: "TPAHLA Awards Ceremony & Gala Dinner",
          description: "The main event: awards presentation, dinner, entertainment, and celebration of humanitarian excellence."
        }
      ]
    },
    {
      date: "October 19, 2025",
      title: "Departures",
      events: [
        {
          time: "All Day",
          name: "Departures",
          description: "Check-out and departures. Optional city tour for those with later flights."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Event Details</h1>
          <p className="text-lg max-w-3xl mx-auto">
            The Pan-African Humanitarian Leadership Awards Ceremony & Conference
          </p>
        </div>
      </div>
      
      <main className="py-12">
        {/* Event Overview */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-4 text-tpahla-darkgreen">Event Overview</h2>
                <p className="text-gray-700 mb-4">
                  The 2025 Pan-African Humanitarian Leadership Award ceremony will take place at the prestigious Abuja Continental Hotel in Nigeria. The event brings together humanitarian leaders, organizations, policymakers, and stakeholders from across Africa to celebrate excellence and inspire future action.
                </p>
                <p className="text-gray-700 mb-4">
                  Beyond the awards ceremony, attendees will benefit from a comprehensive program including workshops, panel discussions, networking opportunities, and cultural experiences.
                </p>
                <div className="bg-tpahla-gold/10 p-4 rounded-lg border-l-4 border-tpahla-gold">
                  <p className="font-medium text-gray-800">
                    Mark your calendar: October 15-19, 2025
                  </p>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
                  alt="Abuja Continental Hotel" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
            
            {/* Venue Information */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-12">
              <h3 className="text-2xl font-serif font-bold mb-4 text-tpahla-darkgreen">Venue Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Abuja Continental Hotel</h4>
                  <p className="text-gray-700 mb-4">
                    Plot 701 Ahmadu Bello Way<br/>
                    Cadastral Zone, Central Business District<br/>
                    Abuja, FCT<br/>
                    Nigeria
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Phone:</span> +234 708 060 3000
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> reservations@abujacontiental.com
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Accommodations</h4>
                  <p className="text-gray-700 mb-4">
                    Special rates are available for TPAHLA attendees. Use code "TPAHLA2025" when booking. Rooms should be reserved by September 15, 2025 to ensure availability and special pricing.
                  </p>
                  <a href="#" className="btn-outline inline-block">
                    Book Accommodation
                  </a>
                </div>
              </div>
            </div>
            
            {/* Event Schedule */}
            <h2 className="text-3xl font-serif font-bold mb-6 text-tpahla-darkgreen text-center">Event Schedule</h2>
            
            <div className="space-y-8 mb-12">
              {schedule.map((day, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-tpahla-darkgreen text-white p-4">
                    <h3 className="text-xl font-medium">{day.date} - {day.title}</h3>
                  </div>
                  <div className="p-6">
                    {day.events.map((event, idx) => (
                      <div key={idx} className={`${idx !== 0 ? 'border-t border-gray-200 pt-4' : ''} ${idx !== day.events.length - 1 ? 'mb-4' : ''}`}>
                        <div className="flex flex-wrap justify-between items-start">
                          <p className="font-medium text-tpahla-gold mb-1">{event.time}</p>
                          <h4 className="text-lg font-bold text-gray-800">{event.name}</h4>
                        </div>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Additional Activities */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-serif font-bold mb-4 text-tpahla-darkgreen">Additional Activities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded shadow">
                  <h4 className="font-bold text-gray-800 mb-2">Guided Abuja City Tour</h4>
                  <p className="text-gray-700 mb-2">
                    Experience the beauty and culture of Nigeria's capital city with a guided tour of key landmarks and cultural sites.
                  </p>
                  <p className="text-sm text-gray-600">Available: October 16 & 19, 2025 | Duration: 3 hours</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <h4 className="font-bold text-gray-800 mb-2">Networking Reception</h4>
                  <p className="text-gray-700 mb-2">
                    Connect with humanitarian leaders, sponsors, and distinguished guests in a relaxed setting.
                  </p>
                  <p className="text-sm text-gray-600">Date: October 17, 2025 | Time: 16:30 - 18:30</p>
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
