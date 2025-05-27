
import React from 'react';
import DetailItemDisplay from '@/components/admin/DetailItemDisplay';
import { CheckCircle, XCircle } from 'lucide-react'; // Using Circle variants for visual
import { format, parseISO, isValid } from 'date-fns';

// Assuming SectionEData structure
interface SectionEData {
  confirm_accuracy?: boolean;
  confirm_nominee_contact?: boolean;
  confirm_data_use?: boolean;
  nominator_signature?: string;
  date_signed?: string | Date; // string from DB (ISO), Date from form
  [key: string]: any;
}

interface SectionEDisplayProps {
  data: SectionEData | null | undefined;
}

const ConfirmationItem: React.FC<{ label: string; confirmed?: boolean }> = ({ label, confirmed }) => (
  <div className="flex items-center mb-2">
    {confirmed ? <CheckCircle size={20} className="text-green-500 mr-2" /> : <XCircle size={20} className="text-red-500 mr-2" />}
    <span className={confirmed ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"}>{label}</span>
  </div>
);

const SectionEDisplay: React.FC<SectionEDisplayProps> = ({ data }) => {
  if (!data) return <p className="text-sm text-gray-500 dark:text-gray-400 col-span-2">No confirmation details provided.</p>;
  
  let dateSignedFormatted = 'N/A';
  if (data.date_signed) {
    const dateObj = typeof data.date_signed === 'string' ? parseISO(data.date_signed) : data.date_signed;
    if (isValid(dateObj)) {
      dateSignedFormatted = format(dateObj, 'PPP');
    } else if (typeof data.date_signed === 'string') {
        dateSignedFormatted = data.date_signed; // Show original string if not parsable
    }
  }
  
  return (
    <div className="col-span-2 space-y-3"> {/* Ensures these items take full width and stack nicely */}
      <ConfirmationItem label="Information accuracy confirmed." confirmed={data.confirm_accuracy} />
      <ConfirmationItem label="Nominee contact acknowledgement confirmed." confirmed={data.confirm_nominee_contact} />
      <ConfirmationItem label="Permission for TPAHLA data use confirmed." confirmed={data.confirm_data_use} />
      <hr className="my-3 dark:border-gray-700"/>
      <DetailItemDisplay label="Nominator Signature (Typed Name)" value={data.nominator_signature} fullWidth className="mb-0"/>
      <DetailItemDisplay label="Date Signed" value={dateSignedFormatted} fullWidth className="mb-0"/>
    </div>
  );
};

export default SectionEDisplay;
