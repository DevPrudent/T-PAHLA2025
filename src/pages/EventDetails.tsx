import React, { useState } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Hotel, 
  Clock, 
  Globe, 
  Music, 
  Camera, 
  Award, 
  Mic, 
  BookOpen, 
  Zap, 
  Laptop, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const EventDetails = () => {
  const [activeDay, setActiveDay] = useState("day1");
  
  const eventDays = [
    {
      id: "day1",
      date: "October 15, 2025",
      title: "Arrival & Cultural Reception",
      description: "The city comes alive with the arrival of a diverse mix of finalists, dignitaries, innovators, activists, and development stakeholders from across Africa and the Diaspora. It marks the beginning of a powerful convergence of change-makers.",
      image: "https://zrutcdhfqahfduxppudv.supabase.co/storage/v1/object/public/category_images//1747913267029-Disasters.jpg",
      events: [
        {
          time: "All Day",
          title: "Arrival of Delegates & Finalists",
          description: "Finalists, speakers, and delegates touch down in the host city to a grand Pan-African welcome."
        },
        {
          time: "16:00 - 19:00",
          title: "Cultural Welcome Reception",
          description: "From the moment they arrive, they are immersed in the spirit of Ubuntu, hospitality, heritage, and honor."
        },
        {
          time: "19:30 - 21:30",
          title: "Informal Networking & Community Building",
          description: "This is where the magic begins - connect with fellow changemakers in a relaxed setting."
        }
      ]
    },
    {
      id: "day2",
      date: "October 16, 2025",
      title: "City Tour & Humanitarian Storytelling",
      description: "A day of discovery and dialogue, offering a guided exploration of the host city's rich tapestry, blending historical tours, innovation hubs, and community visits.",
      image: "/lovable-uploads/photo-1500673922987-e212871fec22.png",
      events: [
        {
          time: "09:00 - 13:00",
          title: "City Tour & Cultural Immersion",
          description: "Delegates will experience a guided tour of the host city, connecting with its vibrant heritage, innovation hubs, and historical landmarks."
        },
        {
          time: "14:00 - 17:00",
          title: "Behind-the-Scenes Interviews with Finalists",
          description: "Intimate sessions where finalists share their journeys, challenges, and visions for humanitarian impact."
        },
        {
          time: "19:00 - 22:00",
          title: "Evening Mixer: \"Voices of Courage\" – A Humanitarian-Themed Soirée",
          description: "A curated experience blending storytelling, music, and networking in a celebration of humanitarian courage."
        }
      ]
    },
    {
      id: "day3",
      date: "October 17, 2025",
      title: "Strategic Engagement With Policy Powerhouse",
      description: "The day opens with engagements at the National Assembly, high-level ministerial roundtables, and thought-provoking keynote lectures. This is where advocacy meets action — ideas take root, policies take shape.",
      image: "/lovable-uploads/photo-1472396961693-142e6e269027.png",
      events: [
        {
          time: "09:00 - 12:00",
          title: "Ministerial & Development Roundtables",
          description: "High-level policy engagements with ministers, development agencies, and legislators designed to drive policy reforms."
        },
        {
          time: "13:30 - 16:00",
          title: "Strategic Dialogue with Policy Makers and Development Partners",
          description: "Focused discussions on humanitarian investment and sustainable development priorities."
        },
        {
          time: "16:30 - 18:30",
          title: "Public-Private Partnership Incubation",
          description: "Specialized sessions to foster collaboration between public institutions and private sector partners."
        }
      ]
    },
    {
      id: "day4",
      date: "October 18, 2025",
      title: "Knowledge Exchange, Leadership Showcase & Gala Night",
      description: "The week crescendos at the TPAHLA 2025 Gala Night & Awards Ceremony, an elegant, world-class evening where spotlights shine on Africa's finest humanitarian champions.",
      image: "/lovable-uploads/photo-1500673922987-e212871fec22.png",
      events: [
        {
          time: "09:00 - 12:30",
          title: "Morning: Ideas That Move Nations",
          description: "Keynote lectures from global and African icons addressing Africa's most pressing humanitarian challenges."
        },
        {
          time: "14:00 - 16:00",
          title: "High-Level Panel Sessions",
          description: "Interactive discussions on climate, conflict, social development, and the future of humanitarian leadership in Africa."
        },
        {
          time: "18:00 - 22:00",
          title: "The Grand Gala & Awards Night",
          description: "Elegance. Emotion. Excellence. The night of recognition, storytelling, music, and honor featuring red carpet, media interviews, awards ceremony, cultural performances, and gala dinner."
        }
      ]
    },
    {
      id: "day5",
      date: "October 19, 2025",
      title: "Farewell & Departure",
      description: "Delegates, enriched, inspired, and united, begin their journey back to their respective countries. Bonds have been formed, ideas have been sparked, and a continental movement has been reignited.",
      image: "/lovable-uploads/photo-1472396961693-142e6e269027.png",
      events: [
        {
          time: "08:00 - 10:00",
          title: "Farewell Breakfast",
          description: "A final gathering to exchange contacts and solidify connections made during the event."
        },
        {
          time: "All Day",
          title: "Departures",
          description: "Check-out and departures. Optional city tour for those with later flights."
        }
      ]
    }
  ];

  const testimonials = [
    {
      quote: "TPAHLA is more than an award ceremony - it's a transformative experience that connects Africa's most impactful humanitarian leaders.",
      author: "Dr. Amina Mohammed",
      role: "Previous Award Recipient"
    },
    {
      quote: "The connections I made at TPAHLA have transformed my organization's reach and impact across multiple African countries.",
      author: "Emmanuel Osei",
      role: "2023 Humanitarian Leadership Awardee"
    },
    {
      quote: "From the cultural immersion to the policy dialogues, every moment of TPAHLA was carefully crafted to inspire and connect.",
      author: "Fatima Nkosi",
      role: "NGO Director & Participant"
    }
  ];

  const features = [
    {
      icon: <Clock className="h-8 w-8 text-tpahla-gold" />,
      title: "Seamless Online Nominations",
      description: "Nominate and track progress with ease, anytime, anywhere."
    },
    {
      icon: <Zap className="h-8 w-8 text-tpahla-gold" />,
      title: "Instant Notifications",
      description: "Stay informed with automated updates, ensuring you never miss a moment."
    },
    {
      icon: <Globe className="h-8 w-8 text-tpahla-gold" />,
      title: "Global Livestreaming",
      description: "Join the action from anywhere in the world, breaking geographical barriers."
    },
    {
      icon: <Laptop className="h-8 w-8 text-tpahla-gold" />,
      title: "Interactive Digital Q&A",
      description: "Shape the conversation with real-time interactions and gain insights from global leaders."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-tpahla-darkgreen to-tpahla-emerald opacity-90 z-10"></div>
        <img 
          src="/lovable-uploads/f6e12c6c-8ef9-4703-9637-d933aa55e1cc.png" 
          alt="TPAHLA Event" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-tpahla-gold">
            TPAHLA 2025
          </h1>
          <p className="text-2xl md:text-3xl font-serif mb-6">
            An Immersive, Transformational Experience
          </p>
          <p className="max-w-3xl text-lg mb-8">
            From arrival to departure, every moment of TPAHLA 2025 is intentionally curated to enrich minds, foster partnerships, and immortalize heroes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                Register Now
              </Button>
            </Link>
            <Link to="/nominations">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                Submit a Nomination
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Event Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-tpahla-gold">
              Event Overview
            </h2>
            <p className="text-lg text-tpahla-text-secondary">
              The 2025 Pan-African Humanitarian Leadership Award ceremony will take place at the prestigious Abuja Continental Hotel in Nigeria. The event brings together humanitarian leaders, organizations, policymakers, and stakeholders from across Africa to celebrate excellence and inspire future action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-tpahla-neutral border-tpahla-gold/20 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-tpahla-gold-gradient-start to-tpahla-gold-gradient-end"></div>
              <div className="h-40 overflow-hidden">
                <img 
                  src="/lovable-uploads/f6e12c6c-8ef9-4703-9637-d933aa55e1cc.png" 
                  alt="Event Dates" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CalendarDays className="h-8 w-8 text-tpahla-gold mr-3" />
                  <div>
                    <h3 className="font-bold text-tpahla-text-primary text-lg">Event Dates</h3>
                    <p className="text-tpahla-text-secondary">October 15-19, 2025</p>
                  </div>
                </div>
                <p className="text-tpahla-text-secondary text-sm">
                  Five days of inspiration, recognition, and celebration of humanitarian excellence across Africa.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-tpahla-neutral border-tpahla-gold/20 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-tpahla-gold-gradient-start to-tpahla-gold-gradient-end"></div>
              <div className="h-40 overflow-hidden">
                <img 
                  src="/lovable-uploads/eb1ccb9c-bbec-46b8-87e5-2f58868b4b76.png" 
                  alt="Venue" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-8 w-8 text-tpahla-gold mr-3" />
                  <div>
                    <h3 className="font-bold text-tpahla-text-primary text-lg">Venue</h3>
                    <p className="text-tpahla-text-secondary">Abuja Continental Hotel</p>
                  </div>
                </div>
                <p className="text-tpahla-text-secondary text-sm">
                  Nigeria's premier venue for international events, located in the heart of Abuja.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-tpahla-neutral border-tpahla-gold/20 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-2 bg-gradient-to-r from-tpahla-gold-gradient-start to-tpahla-gold-gradient-end"></div>
              <div className="h-40 overflow-hidden">
                <img 
                  src="/lovable-uploads/d6cbd5f9-4bd4-447d-912d-aa8223a71b4f.jpg" 
                  alt="Attendees" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-tpahla-gold mr-3" />
                  <div>
                    <h3 className="font-bold text-tpahla-text-primary text-lg">Attendees</h3>
                    <p className="text-tpahla-text-secondary">500+ Leaders & Changemakers</p>
                  </div>
                </div>
                <p className="text-tpahla-text-secondary text-sm">
                  Connect with humanitarian leaders, policymakers, and stakeholders from across Africa.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-tpahla-neutral p-8 rounded-lg border border-tpahla-gold/20 shadow-xl max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <img 
                  src="/lovable-uploads/f6e12c6c-8ef9-4703-9637-d933aa55e1cc.png" 
                  alt="Abuja Continental Hotel" 
                  className="rounded-lg shadow-md w-full h-auto object-cover"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-serif font-bold mb-4 text-tpahla-gold">Abuja Continental Hotel</h3>
                <div className="space-y-4 text-tpahla-text-secondary">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-tpahla-gold mt-1 mr-3 flex-shrink-0" />
                    <p>
                      Plot 701 Ahmadu Bello Way<br />
                      Cadastral Zone, Central Business District<br />
                      Abuja, FCT, Nigeria
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Hotel className="h-5 w-5 text-tpahla-gold mr-3 flex-shrink-0" />
                    <p>5-Star Accommodation with Special Rates for TPAHLA Attendees</p>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-tpahla-gold mr-3 flex-shrink-0" />
                    <p>International Conference Facilities with State-of-the-Art Technology</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link to="/register">
                    <Button className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                      Book Your Accommodation
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Schedule Section */}
      <section className="py-16 bg-tpahla-neutral-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-tpahla-gold">
              Event Schedule
            </h2>
            <p className="text-lg text-tpahla-text-secondary">
              Experience five days of transformative programming designed to inspire, connect, and celebrate humanitarian excellence.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="day1" value={activeDay} onValueChange={setActiveDay} className="w-full">
              <TabsList className="grid grid-cols-5 mb-8">
                {eventDays.map(day => (
                  <TabsTrigger 
                    key={day.id} 
                    value={day.id}
                    className="data-[state=active]:bg-tpahla-gold data-[state=active]:text-tpahla-darkgreen"
                  >
                    <div className="text-center">
                      <div className="font-medium">{day.date.split(',')[0]}</div>
                      <div className="text-xs opacity-80">{day.title.split(' ')[0]}</div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {eventDays.map(day => (
                <TabsContent key={day.id} value={day.id} className="border-none p-0">
                  <div className="bg-tpahla-neutral rounded-lg shadow-xl overflow-hidden border border-tpahla-gold/20">
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-tpahla-darkgreen/90 z-10"></div>
                      <img 
                        src={day.image} 
                        alt={day.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                        <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2 text-tpahla-gold">
                          {day.date} - {day.title}
                        </h3>
                        <p className="text-white/90 max-w-3xl">{day.description}</p>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <h4 className="text-xl font-serif font-bold text-tpahla-gold border-b border-tpahla-gold/20 pb-2">
                        Day Schedule
                      </h4>
                      <div className="space-y-6">
                        {day.events.map((event, index) => (
                          <div key={index} className="flex flex-col md:flex-row gap-4 md:gap-8">
                            <div className="md:w-1/4">
                              <div className="bg-tpahla-darkgreen text-white px-4 py-2 rounded-md text-center">
                                {event.time}
                              </div>
                            </div>
                            <div className="md:w-3/4">
                              <h5 className="text-lg font-bold text-tpahla-text-primary mb-2">{event.title}</h5>
                              <p className="text-tpahla-text-secondary">{event.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-center mt-8 space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  const currentIndex = eventDays.findIndex(day => day.id === activeDay);
                  if (currentIndex > 0) {
                    setActiveDay(eventDays[currentIndex - 1].id);
                  }
                }}
                disabled={activeDay === eventDays[0].id}
                className="border-tpahla-gold text-tpahla-gold hover:bg-tpahla-gold/10"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Day
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  const currentIndex = eventDays.findIndex(day => day.id === activeDay);
                  if (currentIndex < eventDays.length - 1) {
                    setActiveDay(eventDays[currentIndex + 1].id);
                  }
                }}
                disabled={activeDay === eventDays[eventDays.length - 1].id}
                className="border-tpahla-gold text-tpahla-gold hover:bg-tpahla-gold/10"
              >
                Next Day
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gala Night Highlight */}
      <section className="py-16 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-tpahla-gold text-tpahla-darkgreen mb-4">Highlight Event</Badge>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-tpahla-gold">
                  The Grand Gala & Awards Night
                </h2>
                <p className="text-lg mb-6">
                  <em>Elegance. Emotion. Excellence.</em> The night of recognition, storytelling, music, and honor.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="bg-tpahla-gold/20 p-2 rounded-full mr-4 mt-1">
                      <Award className="h-5 w-5 text-tpahla-gold" />
                    </div>
                    <div>
                      <h4 className="font-bold text-tpahla-gold">Red Carpet & Media Interviews</h4>
                      <p className="text-white/80">Make your grand entrance and share your story with global media</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-tpahla-gold/20 p-2 rounded-full mr-4 mt-1">
                      <Mic className="h-5 w-5 text-tpahla-gold" />
                    </div>
                    <div>
                      <h4 className="font-bold text-tpahla-gold">The Pan-African Humanitarian Awards Ceremony</h4>
                      <p className="text-white/80">Witness the recognition of Africa's most impactful humanitarian leaders</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-tpahla-gold/20 p-2 rounded-full mr-4 mt-1">
                      <Music className="h-5 w-5 text-tpahla-gold" />
                    </div>
                    <div>
                      <h4 className="font-bold text-tpahla-gold">Cultural Performances from Across Africa</h4>
                      <p className="text-white/80">Experience the rich cultural diversity of the African continent</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-tpahla-gold/20 p-2 rounded-full mr-4 mt-1">
                      <Users className="h-5 w-5 text-tpahla-gold" />
                    </div>
                    <div>
                      <h4 className="font-bold text-tpahla-gold">Gala Dinner with Distinguished Leaders</h4>
                      <p className="text-white/80">Dine with government, corporate, and global humanitarian leaders</p>
                    </div>
                  </div>
                </div>
                <p className="text-lg italic">
                  This is more than a ceremony. It's a moment in history. It is where legacies are honored and new chapters begin.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-tpahla-gold/30 to-transparent rounded-lg"></div>
                <img 
                  src="https://zrutcdhfqahfduxppudv.supabase.co/storage/v1/object/public/documents//stageport.jpg" 
                  alt="TPAHLA Gala Night" 
                  className="rounded-lg shadow-2xl border-2 border-tpahla-gold/30 w-full h-auto"
                />
                <div className="absolute -bottom-5 -right-5 bg-tpahla-gold text-tpahla-darkgreen p-4 rounded-lg shadow-xl transform rotate-3">
                  <p className="font-serif font-bold">October 18, 2025</p>
                  <p className="text-sm">18:00 - 22:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-tpahla-gold">
              Voices of Past Participants
            </h2>
            <p className="text-lg text-tpahla-text-secondary">
              Hear from those who have experienced the transformative power of TPAHLA.
            </p>
          </div>

          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="p-6">
                    <div className="bg-tpahla-neutral p-8 rounded-lg shadow-xl border border-tpahla-gold/20 relative">
                      <div className="absolute -top-5 left-10 text-tpahla-gold text-6xl">"</div>
                      <p className="text-xl text-tpahla-text-primary italic mb-6 pt-4">
                        {testimonial.quote}
                      </p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-tpahla-gold rounded-full flex items-center justify-center text-tpahla-darkgreen font-bold text-xl mr-4">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-tpahla-text-primary">{testimonial.author}</p>
                          <p className="text-sm text-tpahla-text-secondary">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="relative static translate-y-0 mr-2" />
              <CarouselNext className="relative static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Digital Experience */}
      <section className="py-16 bg-tpahla-neutral-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-tpahla-gold">
              Digitally Driven - Globally Accessible
            </h2>
            <p className="text-lg text-tpahla-text-secondary">
              TPAHLA 2025 is designed to harness the power of technology, expanding its reach and impact like never before.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="bg-tpahla-neutral border-tpahla-gold/20 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="h-2 bg-gradient-to-r from-tpahla-gold-gradient-start to-tpahla-gold-gradient-end"></div>
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-tpahla-text-primary text-center mb-2">{feature.title}</h3>
                  <p className="text-tpahla-text-secondary text-center text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-12 bg-tpahla-neutral p-8 rounded-lg shadow-xl border border-tpahla-gold/20">
            <h3 className="text-2xl font-serif font-bold mb-6 text-tpahla-gold text-center">
              The Pan-African Humanitarian Resource Centre (PAHRC)
            </h3>
            <p className="text-tpahla-text-secondary mb-6">
              All donations received through the platform will directly support the Pan-African Humanitarian Resource Centre (PAHRC), an initiative dedicated to advancing research, policy development, and capacity-building in humanitarian studies across Africa.
            </p>
            <p className="text-tpahla-text-secondary mb-6">
              PAHRC will be equipped with a comprehensive e-library and digital learning resources, becoming a nerve center for knowledge exchange, innovation, and cross-sector collaboration, ensuring that NGOs, development actors, and humanitarian leaders can collectively tackle Africa's most pressing challenges.
            </p>
            <div className="flex justify-center">
              <Link to="/sponsors">
                <Button className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                  Support PAHRC
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Activities */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-tpahla-gold">
              Additional Activities
            </h2>
            <p className="text-lg text-tpahla-text-secondary">
              Enhance your TPAHLA experience with these special activities and opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-tpahla-neutral border-tpahla-gold/20 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-48 overflow-hidden">
                <img 
                  src="/lovable-uploads/photo-1472396961693-142e6e269027.png" 
                  alt="Guided Abuja City Tour" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-tpahla-text-primary mb-2">Guided Abuja City Tour</h3>
                <p className="text-tpahla-text-secondary mb-4 text-sm">
                  Experience the beauty and culture of Nigeria's capital city with a guided tour of key landmarks and cultural sites.
                </p>
                <div className="flex items-center text-sm text-tpahla-gold">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>October 16 & 19, 2025</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-tpahla-neutral border-tpahla-gold/20 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-48 overflow-hidden">
                <img 
                  src="/lovable-uploads/photo-1500673922987-e212871fec22.png" 
                  alt="Media Interviews" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-tpahla-text-primary mb-2">Media Interviews</h3>
                <p className="text-tpahla-text-secondary mb-4 text-sm">
                  Share your story and insights with international media outlets covering the TPAHLA event.
                </p>
                <div className="flex items-center text-sm text-tpahla-gold">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>Throughout the event</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-tpahla-neutral border-tpahla-gold/20 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-48 overflow-hidden">
                <img 
                  src="/lovable-uploads/d6cbd5f9-4bd4-447d-912d-aa8223a71b4f.jpg" 
                  alt="Networking Sessions" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-tpahla-text-primary mb-2">VIP Networking Sessions</h3>
                <p className="text-tpahla-text-secondary mb-4 text-sm">
                  Exclusive opportunities to connect with government officials, corporate leaders, and humanitarian pioneers.
                </p>
                <div className="flex items-center text-sm text-tpahla-gold">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>October 17, 2025</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-tpahla-darkgreen text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-tpahla-gold">
              Be Part of This Historic Event
            </h2>
            <p className="text-xl mb-8">
              Join us for TPAHLA 2025 - Where Honor Meets Purpose, and Every Contribution Builds Africa's Humanitarian Future.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90">
                  Register Now
                </Button>
              </Link>
              <Link to="/nominations">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                  Submit a Nomination
                </Button>
              </Link>
              <Link to="/sponsors">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                  Become a Sponsor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetails;