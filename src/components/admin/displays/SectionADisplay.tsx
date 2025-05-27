import React from 'react';
import DetailItemDisplay from '@/components/admin/DetailItemDisplay';
import { getCountryNameByCode } from '@/lib/africanCountries';
import { format, parseISO, isValid } from 'date-fns';
import { Mail, Phone, Linkedin, Instagram, Twitter as XIcon } from 'lucide-react';

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

  const links = socialMediaString.split(',').map(link => link.trim()).filter(link => link.toLowerCase() !== 'n/a' && link.toLowerCase() !== 'na' && link);
  
  if (links.length === 0) {
    return <DetailItemDisplay label="Social Media" value="N/A" fullWidth />;
  }

  return (
    <DetailItemDisplay 
      label="Social Media Links" 
      value={
        <ul className="space-y-1">
          {links.map((link, index) => {
            let IconComponent;
            const lowerLink = link.toLowerCase();
            if (lowerLink.includes('linkedin.com')) IconComponent = Linkedin;
            else if (lowerLink.includes('instagram.com')) IconComponent = Instagram;
            else if (lowerLink.includes('twitter.com') || lowerLink.includes('x.com')) IconComponent = XIcon;
            
            const displayLink = link.length > 40 ? `${link.substring(0, 37)}...` : link;

            return (
              <li key={index} className="flex items-center space-x-2">
                {IconComponent && <IconComponent size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />}
                {!IconComponent && <div className="w-4 h-4 flex-shrink-0"></div>} {/* Placeholder for alignment */}
                <a 
                  href={link.startsWith('http') ? link : `https://${link}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                  title={link}
                >
                  {displayLink}
                </a>
              </li>
            );
          })}
        </ul>
      }
      fullWidth 
    />
  );
};


const SectionADisplay: React.FC<SectionADisplayProps> = ({ data }) => {
  if (!data) return <p className="text-sm text-gray-500 dark:text-gray-400 col-span-2">No nominee information provided.</p>;

  const dob = data.nominee_dob ? parseISO(data.nominee_dob) : null;
  const formattedDob = dob && isValid(dob) ? format(dob, 'PPP') : data.nominee_dob || 'N/A';
  
  const formattedPhone = (phone?: string) => {
    if (!phone) return 'N/A';
    return phone;
  };

  // For flags, a text representation is used. Visual flags would require a flag icon library/assets.
  const nationalityDisplay = data.nominee_nationality ? 
    `${getCountryNameByCode(data.nominee_nationality) || data.nominee_nationality} (${data.nominee_nationality.toUpperCase()})` : 'N/A';
  const residenceDisplay = data.nominee_country_of_residence ? 
    `${getCountryNameByCode(data.nominee_country_of_residence) || data.nominee_country_of_residence} (${data.nominee_country_of_residence.toUpperCase()})` : 'N/A';

  return (
    <>
      <DetailItemDisplay label="Full Name" value={data.nominee_full_name} />
      <DetailItemDisplay label="Gender" value={data.nominee_gender ? data.nominee_gender.charAt(0).toUpperCase() + data.nominee_gender.slice(1) : 'N/A'} />
      <DetailItemDisplay label="Date of Birth" value={formattedDob} />
      <DetailItemDisplay label="Nationality" value={nationalityDisplay} />
      <DetailItemDisplay label="Country of Residence" value={residenceDisplay} />
      <DetailItemDisplay label="Organization/Institution" value={data.nominee_organization} />
      <DetailItemDisplay label="Title/Position" value={data.nominee_title_position} />
      <DetailItemDisplay 
        label="Email Address" 
        value={data.nominee_email ? (
          <span className="flex items-center">
            <Mail size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
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
            <Phone size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
            {formattedPhone(data.nominee_phone)}
          </span>
        ) : 'N/A'}
      />
      {renderSocialMedia(data.nominee_social_media)}
    </>
  );
};

export default SectionADisplay;
