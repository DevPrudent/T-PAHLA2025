import { z } from 'zod';

export const nominationStepASchema = z.object({
  nominee_full_name: z.string().min(1, "Full name is required"),
  nominee_gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender." })
  }).optional(),
  nominee_dob: z.string().refine(val => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), { // Expecting YYYY-MM-DD from date picker
    message: "Date of Birth must be a valid date (YYYY-MM-DD) or empty.",
  }).optional(),
  nominee_nationality: z.string().min(1, "Nationality is required"),
  nominee_country_of_residence: z.string().min(1, "Country of residence is required"),
  nominee_organization: z.string().optional(),
  nominee_title_position: z.string().min(1, "Title/Position is required"),
  nominee_email: z.string().email("Invalid email address").min(1, "Email is required"),
  nominee_phone: z.string().min(1, "Phone number is required")
    .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format. Include country code e.g., +234..."),
  nominee_social_media: z.string().optional(),
});

export type NominationStepAData = z.infer<typeof nominationStepASchema>;

export const nominationStepBSchema = z.object({
  award_category: z.string().min(1, "Award category is required."),
  specific_award: z.string().min(1, "Specific award is required."),
});

export type NominationStepBData = z.infer<typeof nominationStepBSchema>;

export const nominationStepCSchema = z.object({
  justification: z.string().min(1, "Justification is required.").max(2500, "Justification should be concise (approx. 400-500 words)."), // Max length as proxy for word count
  notable_recognitions: z.string().optional(),
  media_links: z.array(z.object({ value: z.string().url("Please enter a valid URL.").min(1, "Link cannot be empty.") })).optional(),
  // Placeholder for file uploads - will be handled later
  // cv_resume: z.any().optional(), 
  // photos_media: z.any().optional(),
  // other_documents: z.any().optional(),
});

export type NominationStepCData = z.infer<typeof nominationStepCSchema>;

// Add other step schemas here as we build them
// export const nominationStepDSchema = z.object({...});
// export type NominationStepDData = z.infer<typeof nominationStepDSchema>;
