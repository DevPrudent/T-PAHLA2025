
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface PageBreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

const PageBreadcrumb = ({ items }: PageBreadcrumbProps) => {
  return (
    <div className="relative py-12 mb-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/03228de8-44fb-4855-8faf-8056be807730.png"
          alt="TPAHLA Stage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
          {items[items.length - 1].label}
        </h1>
        
        {/* Breadcrumb Trail */}
        <Breadcrumb>
          <BreadcrumbList className="text-white">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center text-tpahla-gold hover:text-white">
                  <Home className="h-4 w-4 mr-1" />
                  <span>Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator className="text-white/70" />
                <BreadcrumbItem>
                  {index === items.length - 1 || !item.href ? (
                    <BreadcrumbPage className="text-white">{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={item.href} className="text-tpahla-gold hover:text-white">
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default PageBreadcrumb;
