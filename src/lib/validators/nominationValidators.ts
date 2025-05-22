
import { z } from 'zod';

export const NomineeTypeEnum = z.enum(['individual', 'organization', 'institution']);

export const nominationStepASchema = z.object({
  nominee_name: z.string().min(1, "Nominee name is required"),
  nominee_type: NomineeTypeEnum.nullable().refine(val => val !== null, "Nominee type is required"),
  award_category_id: z.string().min(1, "Award category is required").nullable(), // Assuming UUID string
  summary_of_achievement: z.string().min(1, "Summary of achievement is required").max(1500, "Max 1500 characters"),
  // form_section_a: For more complex structured data if needed, otherwise individual fields are fine
});

export const nominationStepBSchema = z.object({
  nominator_name: z.string().min(1, "Your name is required"),
  nominator_email: z.string().email("Invalid email address"),
  // form_section_b: For more complex structured data
});

// Placeholder for other steps
export const nominationStepCSchema = z.object({
  form_section_c_notes: z.string().optional(),
});
export const nominationStepDSchema = z.object({
  // Define fields for references/endorsements
});
export const nominationStepESchema = z.object({
  declaration_consent: z.boolean().refine(val => val === true, "You must agree to the declaration"),
});

export const fullNominationSchema = nominationStepASchema
  .merge(nominationStepBSchema)
  .merge(nominationStepCSchema)
  .merge(nominationStepDSchema)
  .merge(nominationStepESchema);

export type NominationStepAData = z.infer<typeof nominationStepASchema>;
export type NominationStepBData = z.infer<typeof nominationStepBSchema>;
export type NominationStepCData = z.infer<typeof nominationStepCSchema>;
// ... types for other steps

