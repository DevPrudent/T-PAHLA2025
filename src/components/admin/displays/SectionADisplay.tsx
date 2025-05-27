
import React from 'react';
import DetailItemDisplay from '@/components/admin/DetailItemDisplay';
import { getCountryNameByCode } from '@/lib/africanCountries'; // Assuming this utility exists
import { format, parseISO, isValid } from 'date-fns';
import { Mail, Phone, Linkedin, /* X / Twitter icon */ Instagram } from 'lucide-react'; // Need to ensure X is available or use a placeholder
// import { Twitter as XIcon } from 'lucide-react'; // If 'X' is not directly available

// Assuming SectionAData structure from NominationDetailsModal or similar
// For simplicity, using 'any' for now, but should be typed properly with NominationStepAData
interface SectionAData {
  nominee_full_name?: string;
  nominee_gender?: string;
  nominee_dob?: string; // Expect YYYY-MM-DD string
  nominee_nationality?: string; // Country code
  nominee_country_of_residence?: string; // Country code
  nominee_organization?: string;
  nominee_title_position?: string;
  nominee_email?: string;
  nominee_phone?: string;
  nominee_social_media?: string; // This might need parsing or be structured data
  [key: string]: any;
}

interface SectionADisplayProps {
  data: SectionAData | null | undefined;
}

// Helper to render social media links (very basic for now)
const renderSocialMedia = (socialMediaString?: string) => {
  if (!socialMediaString) return <DetailItemDisplay label="Social Media" value="N/A" fullWidth />;

  // This is a simplified parser. Real-world might need more robust logic
  // or the data should be stored in a structured format.
  const links = socialMediaString.split(',').map(link => link.trim()).filter(link => link);
  
  return (
    <DetailItemDisplay 
      label="Social Media" 
      value={
        links.length > 0 ? (
          <ul className="space-y-1">
            {links.map((link, index) => {
              let IconComponent;
              if (link.toLowerCase().includes('linkedin')) IconComponent = Linkedin;
              // else if (link.toLowerCase().includes('twitter') || link.toLowerCase().includes('x.com')) IconComponent = XIcon; // Or your X icon
              else if (link.toLowerCase().includes('instagram')) IconComponent = Instagram;
              
              return (
                <li key={index} className="flex items-center">
                  {IconComponent && <IconComponent size={16} className="mr-2 text-gray-500" />}
                  <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {link}
                  </a>
                </li>
              );
            })}
          </ul>
        ) : "N/A"
      }
      fullWidth 
    />
  );
};


const SectionADisplay: React.FC<SectionADisplayProps> = ({ data }) => {
  if (!data) return <p className="text-sm text-gray-500 dark:text-gray-400 col-span-2">No nominee information provided.</p>;

  const dob = data.nominee_dob ? parseISO(data.nominee_dob) : null;
  const formattedDob = dob && isValid(dob) ? format(dob, 'PPP') : data.nominee_dob || 'N/A';
  
  // Basic phone formatting idea (can be enhanced)
  const formattedPhone = (phone?: string) => {
    if (!phone) return 'N/A';
    // Add more sophisticated formatting if needed
    return phone;
  };

  return (
    <>
      <DetailItemDisplay label="Full Name" value={data.nominee_full_name} />
      <DetailItemDisplay label="Gender" value={data.nominee_gender ? data.nominee_gender.charAt(0).toUpperCase() + data.nominee_gender.slice(1) : 'N/A'} />
      <DetailItemDisplay label="Date of Birth" value={formattedDob} />
      <DetailItemDisplay label="Nationality" value={data.nominee_nationality ? `${getCountryNameByCode(data.nominee_nationality) || data.nominee_nationality}` : 'N/A'} /> {/* TODO: Add flag icon */}
      <DetailItemDisplay label="Country of Residence" value={data.nominee_country_of_residence ? `${getCountryNameByCode(data.nominee_country_of_residence) || data.nominee_country_of_residence}` : 'N/A'} /> {/* TODO: Add flag icon */}
      <DetailItemDisplay label="Organization/Institution" value={data.nominee_organization} />
      <DetailItemDisplay label="Title/Position" value={data.nominee_title_position} />
      <DetailItemDisplay 
        label="Email Address" 
        value={data.nominee_email ? (
          <span className="flex items-center">
            <Mail size={16} className="mr-2 text-gray-500" />
            <a href={`mailto:${data.nominee_email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              {data.nominee_email}
            </a>
          </span>
        ) : 'N/A'}
      />
      <DetailItemDisplay 
        label="Phone Number" 
        value={data.nominee_phone ? (
          <span className="flex items-center">
            <Phone size={16} className="mr-2 text-gray-500" /> {/* TODO: Add country code icon */}
            {formattedPhone(data.nominee_phone)}
          </span>
        ) : 'N/A'}
      />
      {renderSocialMedia(data.nominee_social_media)}
    </>
  );
};

export default SectionADisplay;
