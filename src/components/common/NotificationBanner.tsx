
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const NotificationBanner = () => {
  return (
    <div className="h-20 bg-tpahla-neutral border-t-4 border-tpahla-gold p-4 md:p-6 shadow-lg rounded-b-lg flex items-center"> {/* Added h-20 and flex items-center */}
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0 md:mr-4"> {/* Added md:mr-4 for spacing */}
          <Info className="text-tpahla-gold h-8 w-8 mr-3 flex-shrink-0" /> {/* Added flex-shrink-0 */}
          <p className="text-tpahla-text-primary text-sm md:text-base">
            This event is proudly organized by the{" "}
            <a 
              href="https://ihsd-ng.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-tpahla-gold hover:underline"
            >
              Institute for Humanitarian Studies and Social Development (IHSD)
            </a>.
          </p>
        </div>
        <Button
          variant="tpahla-outline"
          size="sm"
          onClick={() => window.open("https://ihsd-ng.org/", "_blank")}
          className="border-tpahla-gold text-tpahla-gold hover:bg-tpahla-gold hover:text-tpahla-darkgreen flex-shrink-0" /* Added flex-shrink-0 */
        >
          Visit IHSD Website
        </Button>
      </div>
    </div>
  );
};

export default NotificationBanner;
