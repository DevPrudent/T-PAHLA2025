
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface DataPairProps {
  label: string;
  value?: string | number | null | React.ReactNode;
  isBadge?: boolean;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

const DataPair: React.FC<DataPairProps> = ({ label, value, isBadge, badgeVariant }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="mb-2 break-inside-avoid">
      <span className="font-semibold text-sm text-gray-600 dark:text-gray-400">{label}:</span>{' '}
      {isBadge ? (
        <Badge variant={badgeVariant || "secondary"}>{String(value)}</Badge>
      ) : (
        <span className="text-sm text-gray-800 dark:text-gray-200">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</span>
      )}
    </div>
  );
};

export default DataPair;
