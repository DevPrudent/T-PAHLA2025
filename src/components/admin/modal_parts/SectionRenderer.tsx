
import React from 'react';

interface SectionRendererProps {
  title: string;
  children: React.ReactNode;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ title, children }) => (
  <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 break-inside-avoid print:border-gray-300 print:shadow-none">
    <h3 className="text-lg font-semibold mb-3 text-tpahla-gold border-b pb-2">{title}</h3>
    {children}
  </div>
);

export default SectionRenderer;
