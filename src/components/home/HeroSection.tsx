
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/70 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473163928189-364b2c4e1135?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center z-[-1]"></div>
      
      {/* African pattern overlay */}
      <div className="absolute inset-0 african-pattern opacity-30 z-[-1]"></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img 
              src="/lovable-uploads/0782cd19-ebc3-4e7c-8099-2ffc6e08289e.png" 
              alt="TPAHLA Gold Logo" 
              className="h-32 md:h-40 animate-fade-in"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-4 animate-fade-in">
            The Pan-African Humanitarian Leadership Award
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="font-serif italic">Honoring Heroes, Forging Forward</span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/nominations" className="btn-primary bg-tpahla-darkgreen hover:bg-tpahla-brightgreen">
              Nominate Now
            </Link>
            <Link to="/register" className="btn-secondary bg-tpahla-gold hover:bg-amber-600">
              Register for Event
            </Link>
            <Link to="/sponsors" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900">
              Become a Sponsor
            </Link>
          </div>
          
          {/* Event Date */}
          <div className="inline-block animate-fade-in bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20" style={{ animationDelay: '0.6s' }}>
            <p className="text-white font-medium">
              Awards Ceremony: <span className="text-tpahla-gold font-bold">October 18, 2025</span> | Abuja, Nigeria
            </p>
          </div>
        </div>
      </div>
      
      {/* Scroll down indicator */}
      <a 
        href="#about" 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-pulse-slow"
      >
        <ArrowDown size={32} strokeWidth={1} />
      </a>
    </section>
  );
};

export default HeroSection;
