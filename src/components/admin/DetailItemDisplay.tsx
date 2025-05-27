
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface DetailItemDisplayProps {
  label: string;
  value: React.ReactNode;
  isLink?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const DetailItemDisplay: React.FC<DetailItemDisplayProps> = ({ label, value, isLink, fullWidth, className }) => (
  <div className={`mb-3 ${fullWidth ? 'sm:col-span-2' : ''} ${className}`}>
    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}:</p>
    <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
      {isLink && typeof value === 'string' ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
          {value} <ExternalLink size={12} className="inline ml-1" />
        </a>
      ) : typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value ?? <span className="text-gray-500 dark:text-gray-500">N/A</span>}
    </div>
  </div>
);

export default DetailItemDisplay;
