
import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import ModalDetailItem from '../ModalDetailItem';
import { SectionEData } from '../../NominationDetailsModal'; // Importing from the original modal

interface SectionEContentRendererProps {
  data: SectionEData | null;
}

const SectionEContentRenderer: React.FC<SectionEContentRendererProps> = ({ data }) => {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No data provided for this section.</p>;
  }

  let dateSignedFormatted = 'N/A';
    if (data.date_signed && typeof data.date_signed === 'string') {
        try {
            const dateValue = parseISO(data.date_signed);
            dateSignedFormatted = isValid(dateValue) ? format(dateValue, 'PPP') : String(data.date_signed);
        } catch (e) { dateSignedFormatted = String(data.date_signed); }
    } else if (data.date_signed) { // If it's already a Date object or other non-string truthy
        dateSignedFormatted = String(data.date_signed);
    }
  
  return (
    <div className="space-y-3 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        <ModalDetailItem label="Confirm Accuracy" value={data.confirm_accuracy} />
        <ModalDetailItem label="Confirm Nominee Contact" value={data.confirm_nominee_contact} />
        <ModalDetailItem label="Confirm Data Use" value={data.confirm_data_use} />
        <ModalDetailItem label="Nominator Signature" value={data.nominator_signature} />
        <ModalDetailItem label="Date Signed" value={dateSignedFormatted} />

        {/* Render other fields from Section E if any */}
        {Object.entries(data)
          .filter(([key]) => ![
            'confirm_accuracy', 'confirm_nominee_contact', 'confirm_data_use',
            'nominator_signature', 'date_signed'
          ].includes(key))
          .map(([key, value]) => {
            const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            return <ModalDetailItem key={key} label={formattedKey} value={String(value ?? 'N/A')} />;
        })}
      </div>
    </div>
  );
};

export default SectionEContentRenderer;
