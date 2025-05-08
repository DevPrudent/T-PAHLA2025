import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
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
  const navLinks = [{
    name: 'Home',
    href: '/'
  }, {
    name: 'About',
    href: '/about'
  }, {
    name: 'Awards',
    href: '/awards'
  }, {
    name: 'Nominations',
    href: '/nominations'
  }, {
    name: 'Event',
    href: '/event'
  }, {
    name: 'Sponsors',
    href: '/sponsors'
  }, {
    name: 'Register',
    href: '/register'
  }, {
    name: 'Contact',
    href: '/contact'
  }];
  const isActive = path => {
    return location.pathname === path;
  };
  return <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img alt="TPAHLA Logo" className="h-12 md:h-16" src="/lovable-uploads/62fe4193-0108-4af1-94b9-a45993de1c9d.png" />
            <span className="sr-only">TPAHLA</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-1">
          {navLinks.map(link => <Link key={link.name} to={link.href} className={`px-3 py-2 text-sm font-medium transition-colors ${isActive(link.href) ? 'text-tpahla-darkgreen font-bold border-b-2 border-tpahla-gold' : 'text-gray-700 hover:text-tpahla-darkgreen'}`}>
              {link.name}
            </Link>)}
        </nav>

        {/* Mobile Nav Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav Menu */}
        {isOpen && <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4">
            <div className="flex flex-col space-y-2 px-4">
              {navLinks.map(link => <Link key={link.name} to={link.href} className={`block py-2 transition-colors ${isActive(link.href) ? 'text-tpahla-darkgreen font-bold' : 'text-gray-700 hover:text-tpahla-darkgreen'}`} onClick={() => setIsOpen(false)}>
                  {link.name}
                </Link>)}
            </div>
          </div>}
      </div>
    </header>;
};
export default Navbar;