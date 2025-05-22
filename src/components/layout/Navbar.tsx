import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Awards', href: '/awards' },
    { name: 'Nominations', href: '/nominations' },
    { name: 'Event', href: '/event' },
    { name: 'Sponsors', href: '/sponsors' },
    { name: 'Register', href: '/register' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`sticky top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background shadow-lg py-2 border-b border-tpahla-gold/20' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img alt="TPAHLA Logo" className="h-12 md:h-16" src="/lovable-uploads/62fe4193-0108-4af1-94b9-a45993de1c9d.png" />
          </Link>
        </div>

        <nav className="hidden md:flex space-x-1">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md
                ${isActive(link.href) 
                  ? 'text-tpahla-darkgreen bg-tpahla-gold font-semibold' 
                  : 'text-tpahla-text-secondary hover:text-tpahla-gold hover:bg-tpahla-neutral-light'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-tpahla-text-primary focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background shadow-lg py-4 border-t-2 border-tpahla-gold">
            <div className="flex flex-col space-y-2 px-4">
              {navLinks.map(link => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`block py-3 px-3 rounded-md transition-colors text-center
                    ${isActive(link.href) 
                      ? 'text-tpahla-darkgreen bg-tpahla-gold font-semibold' 
                      : 'text-tpahla-text-secondary hover:text-tpahla-gold hover:bg-tpahla-neutral-light'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
