
import { z } from "zod";

export const registrationFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  organization: z.string().optional(),
  position: z.string().optional(),
  country: z.string().min(1, "Please select your country"),
  category: z.string().min(1, "Please select a registration category"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  addOns: z.array(z.string()).default([]),
  specialRequests: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

export type RegistrationFormData = z.infer<typeof registrationFormSchema>;
