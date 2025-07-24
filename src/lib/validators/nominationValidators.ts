import { z } from 'zod';

export const nominationStepASchema = z.object({
  nominator_email: z.string().email("Invalid email address").min(1, "Your email is required"),
  nominator_name: z.string().min(1, "Your name is required"),
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
  file_uploads: z.array(z.object({
    file_name: z.string(),
    file_url: z.string().url(),
    file_size: z.number().optional(), // Make size optional as it might not always be present
    file_type: z.string().optional(), // Add file_type if available
  })).optional(),
  // Placeholder for file uploads - will be handled later
  // cv_resume: z.any().optional(),
  // photos_media: z.any().optional(),
  // other_documents: z.any().optional(),
});

export type NominationStepCData = z.infer<typeof nominationStepCSchema>;

export const nominationStepDSchema = z.object({
  nominator_full_name: z.string().min(1, "Full name is required"),
  nominator_relationship_to_nominee: z.string().min(1, "Relationship to nominee is required"),
  nominator_organization: z.string().optional(),
  nominator_email: z.string().email("Invalid email address").min(1, "Email is required"),
  nominator_phone: z.string().min(1, "Phone number is required")
    .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format. Include country code e.g., +234..."),
  nominator_reason: z.string().min(1, "Reason for nomination is required.").max(500, "Reason should be concise (approx. 100 words)."), // Max length as proxy for word count
});

export type NominationStepDData = z.infer<typeof nominationStepDSchema>;

export const nominationStepESchema = z.object({
  confirm_accuracy: z.boolean().refine(val => val === true, {
    message: "You must confirm the accuracy of the information.",
  }),
  confirm_nominee_contact: z.boolean().refine(val => val === true, {
    message: "You must confirm understanding that the nominee may be contacted.",
  }),
  confirm_data_use: z.boolean().refine(val => val === true, {
    message: "You must give permission for TPAHLA to use this data.",
  }),
  nominator_signature: z.string().min(1, "Signature is required. Please type your full name."),
  date_signed: z.date({
    required_error: "Date of signature is required.",
    invalid_type_error: "That's not a valid date!",
  }),
});

export type NominationStepEData = z.infer<typeof nominationStepESchema>;
