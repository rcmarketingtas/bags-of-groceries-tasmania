import { z } from 'zod'

export const donationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50).trim(),
  lastName: z.string().min(1, 'Last name is required').max(50).trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255)
    .trim()
    .toLowerCase(),
  message: z.string().max(500, 'Message must be under 500 characters').trim().optional(),
  priceId: z.string().min(1, 'Please select a sponsorship package'),
  givingFrequency: z.enum(['monthly', 'one_time']).default('one_time'),
})

export const applicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50).trim(),
  lastName: z.string().min(1, 'Last name is required').max(50).trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255)
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(6, 'Please enter a valid phone number')
    .max(20)
    .trim(),
  address: z.string().min(1, 'Address is required').max(255).trim(),
  suburb: z.string().min(1, 'Suburb is required').max(100).trim(),
  postcode: z
    .string()
    .regex(/^\d{4}$/, 'Please enter a valid 4-digit postcode'),
  adults: z.coerce
    .number({ invalid_type_error: 'Please enter the number of adults' })
    .int()
    .min(1, 'At least 1 adult required')
    .max(20),
  children: z.coerce
    .number({ invalid_type_error: 'Please enter the number of children' })
    .int()
    .min(0)
    .max(20),
  circumstances: z
    .string()
    .min(20, 'Please provide at least 20 characters describing your circumstances')
    .max(1000, 'Please keep your description under 1000 characters')
    .trim(),
  confirmed: z.literal('on', {
    errorMap: () => ({ message: 'You must confirm the information is accurate' }),
  }),
})

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255)
    .trim()
    .toLowerCase(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be under 2000 characters')
    .trim(),
})

export type DonationInput = z.infer<typeof donationSchema>
export type ApplicationInput = z.infer<typeof applicationSchema>
export type ContactInput = z.infer<typeof contactSchema>
