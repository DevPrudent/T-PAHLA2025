
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const NotificationBanner = () => {
  return (
    <div className="bg-tpahla-neutral border-t-4 border-tpahla-gold p-4 md:p-6 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Info className="text-tpahla-gold h-8 w-8 mr-3" />
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
          className="border-tpahla-gold text-tpahla-gold hover:bg-tpahla-gold hover:text-tpahla-darkgreen"
        >
          Visit IHSD Website
        </Button>
      </div>
    </div>
  );
};

export default NotificationBanner;
