import { z } from 'zod'

export const enquirySchema = z.object({
  kind: z.enum(['contact', 'student', 'volunteer']),
  name: z.string().trim().min(1, 'Please enter your name.').max(100),
  email: z.string().trim().email('Please enter a valid email address.').max(255),
  message: z.string().trim().min(5, 'Please share a little more information.').max(2000),
  classLevel: z.string().max(30).optional(),
  subjects: z.string().max(200).optional(),
  language: z.string().max(80).optional(),
  format: z.string().max(80).optional(),
  qualifications: z.string().max(300).optional(),
  experience: z.string().max(300).optional(),
  availability: z.string().max(200).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please confirm consent to continue.' }) }),
  website: z.string().max(0, 'Unable to submit this form.').default(''),
}).superRefine((data, ctx) => {
  if (data.kind === 'student' && !data.classLevel) ctx.addIssue({ code: 'custom', path: ['classLevel'], message: 'Please choose a class.' })
  if (data.kind !== 'contact' && !data.subjects?.trim()) ctx.addIssue({ code: 'custom', path: ['subjects'], message: 'Please enter subjects.' })
  if (data.kind === 'volunteer' && !data.qualifications?.trim()) ctx.addIssue({ code: 'custom', path: ['qualifications'], message: 'Please enter qualifications.' })
})
export type Enquiry = z.infer<typeof enquirySchema>