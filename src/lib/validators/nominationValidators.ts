
import { z } from 'zod';

export const nominationStepASchema = z.object({
  nominee_full_name: z.string().min(1, "Full name is required"),
  nominee_gender: z.enum(["male", "female", "other"]).optional(),
  nominee_dob: z.string().optional(), // Assuming string input for date, can be refined
  nominee_nationality: z.string().optional(),
  nominee_country_of_residence: z.string().optional(),
  nominee_organization: z.string().optional(),
  nominee_title_position: z.string().optional(),
  nominee_email: z.string().email("Invalid email address").optional(),
  nominee_phone: z.string().optional(),
  nominee_social_media: z.string().optional(),
});

export type NominationStepAData = z.infer<typeof nominationStepASchema>;

// Add other step schemas here as we build them
// export const nominationStepBSchema = z.object({...});
// export type NominationStepBData = z.infer<typeof nominationStepBSchema>;

