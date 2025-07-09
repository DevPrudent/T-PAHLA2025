
import { Globe } from 'lucide-react';

const FloatingIHSDPopup = () => {
  return (
    <a
      className="fixed bottom-5 right-5 z-50 p-3 bg-tpahla-neutral-light/80 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-tpahla-gold/50 transition-shadow duration-300 group animate-pulse-slow border border-tpahla-gold/30"
      title="Nominations Deadline"
    >
      <div className="flex items-center space-x-2">
        <Globe className="h-5 w-5 text-tpahla-gold transition-colors" />
        <p className="text-xs text-tpahla-text-primary group-hover:text-tpahla-gold transition-colors">
          Nominations close on <span className="font-semibold">1st September, 2025</span>
        </p>
      </div>
    </a>
  );
};

export default FloatingIHSDPopup;
