
import { Calendar, Clock, MapPin } from 'lucide-react';

const EventSection = () => {
  const eventSchedule = [
    {
      day: "Day 1",
      date: "October 15, 2025",
      events: [
        { time: "10:00 AM - 2:00 PM", title: "Arrival and Check-in", description: "Registration of finalists and delegates" },
        { time: "4:00 PM - 6:00 PM", title: "Welcome Reception", description: "Networking event for all participants" }
      ]
    },
    {
      day: "Day 2",
      date: "October 16, 2025",
      events: [
        { time: "9:00 AM - 12:00 PM", title: "Humanitarian Leadership Forum", description: "Panel discussions and keynote speeches" },
        { time: "2:00 PM - 5:00 PM", title: "Site Visits", description: "Tours to local humanitarian projects" }
      ]
    },
    {
      day: "Day 3",
      date: "October 17, 2025",
      events: [
        { time: "10:00 AM - 12:00 PM", title: "Finalists Presentations", description: "Shortlisted nominees showcase their work" },
        { time: "2:00 PM - 4:00 PM", title: "Masterclass Sessions", description: "Skill-building workshops for delegates" },
        { time: "7:00 PM - 9:00 PM", title: "Cultural Evening", description: "Celebrating African heritage through arts" }
      ]
    },
    {
      day: "Day 4",
      date: "October 18, 2025",
      events: [
        { time: "10:00 AM - 12:00 PM", title: "Pre-Award Conference", description: "Final keynote address and plenary session" },
        { time: "6:00 PM - 10:00 PM", title: "Awards Gala Dinner", description: "The main awards ceremony and celebration" }
      ]
    }
  ];

  return (
    <section id="event" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="section-title relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-tpahla-gold">
            Event Details
          </h2>
          <p className="section-subtitle text-gray-600">
            Join us for four days of inspiration, recognition, and celebration of humanitarian excellence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Event Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-tpahla-purple p-6">
                <h3 className="text-2xl font-serif font-bold text-white">TPAHLA 2025</h3>
                <p className="text-white/80 mt-1">The Pan-African Humanitarian Leadership Awards</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-6 w-6 mr-3 text-tpahla-purple flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Event Dates</h4>
                    <p className="text-gray-600">October 15-18, 2025</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-6 w-6 mr-3 text-tpahla-purple flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Awards Ceremony</h4>
                    <p className="text-gray-600">October 18, 2025 | 6:00 PM - 10:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 mr-3 text-tpahla-purple flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Venue</h4>
                    <p className="text-gray-600">Abuja Continental Hotel, Nigeria</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h4 className="font-medium mb-3">Venue Facilities</h4>
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-tpahla-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Conference Halls
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-tpahla-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    5-Star Accommodation
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-tpahla-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Business Center
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-tpahla-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Multiple Restaurants
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-tpahla-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Free Wi-Fi
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 text-tpahla-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Airport Shuttle
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.3035561326!2d7.483338714342075!3d9.049476891008858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0ba5345430c1%3A0xfa8d0f794ad7b154!2sAbuja%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1627563772081!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  title="Event Location Map"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>
          </div>
          
          {/* Event Schedule */}
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold border-b pb-3 border-gray-200">Event Schedule</h3>
            
            <div className="space-y-6">
              {eventSchedule.map((day, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-tpahla-purple/10 p-4 border-l-4 border-tpahla-purple">
                    <h4 className="font-serif font-bold">{day.day} <span className="text-gray-600 font-normal">- {day.date}</span></h4>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {day.events.map((event, eventIndex) => (
                      <div key={eventIndex} className="flex items-start pb-4 last:pb-0 last:mb-0 border-b last:border-0 border-dashed border-gray-200">
                        <div className="bg-tpahla-purple/10 text-tpahla-purple px-3 py-1 rounded text-sm font-medium w-32 text-center flex-shrink-0">
                          {event.time.split('-')[0]}
                        </div>
                        <div className="ml-4">
                          <h5 className="font-medium">{event.title}</h5>
                          <p className="text-gray-600 text-sm">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-tpahla-gold/10 p-6 rounded-lg border-l-4 border-tpahla-gold">
              <h4 className="font-serif font-bold mb-3">Additional Activities</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-tpahla-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Guided tour of Abuja cultural landmarks</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-tpahla-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Networking breakfast with industry leaders</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-tpahla-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Workshops on sustainable humanitarian practices</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-tpahla-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Post-award networking reception</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventSection;
