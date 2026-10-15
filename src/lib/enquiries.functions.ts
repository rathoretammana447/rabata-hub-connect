import { createServerFn } from '@tanstack/react-start'
import { enquirySchema } from './enquiry-schema'

export const submitEnquiry = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { kind, name, email, consent, website: _website, ...details } = data
    const { data: id, error } = await supabaseAdmin.rpc('submit_enquiry', {
      p_kind: kind, p_name: name, p_email: email.toLowerCase(), p_details: details, p_consent: consent,
    })
    if (error) return { success: false, message: error.message.includes('rate_limit') ? 'Please wait 15 minutes before sending another message.' : 'Your message could not be saved. Please try again or email us directly.' }
    try {
      const { notifyEnquiry } = await import('./gmail.server')
      const notification = await notifyEnquiry(data, id)
      return { success: true, reference: id, notificationSent: notification.sent }
    } catch {
      return { success: true, reference: id, notificationSent: false }
    }
  })