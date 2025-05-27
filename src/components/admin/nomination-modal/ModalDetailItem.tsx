
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ModalDetailItemProps {
  label: string;
  value: React.ReactNode;
  isLink?: boolean;
  fullWidth?: boolean;
}

const ModalDetailItem: React.FC<ModalDetailItemProps> = ({ label, value, isLink, fullWidth }) => (
  <div className={`mb-2 print:mb-1 ${fullWidth ? 'sm:col-span-2' : ''}`}>
    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 print:text-black">{label}:</p>
    <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words print:text-black">
      {isLink && typeof value === 'string' ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
          {value} <ExternalLink size={12} className="inline ml-1" />
        </a>
      ) : typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value ?? 'N/A'}
    </div>
  </div>
);

export default ModalDetailItem;
