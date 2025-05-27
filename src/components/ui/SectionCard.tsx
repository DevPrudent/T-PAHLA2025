
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming Card components are available
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  onEdit?: () => void; // Placeholder for future edit functionality
  // Add more props as needed for inline editing state, save handlers etc.
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, onEdit }) => {
  return (
    <Card className="mb-6 shadow-lg dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-tpahla-darkgreen dark:text-tpahla-gold">{title}</CardTitle>
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit} className="text-tpahla-emerald hover:text-tpahla-darkgreen dark:text-tpahla-gold dark:hover:text-white">
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionCard;
