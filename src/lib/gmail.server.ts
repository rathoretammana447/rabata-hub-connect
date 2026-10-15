import type { Enquiry } from './enquiry-schema'
import { site } from './site'

export async function notifyEnquiry(enquiry: Enquiry, reference: string) {
  const apiKey = process.env['LOVABLE_API_KEY']
  const connectionKey = process.env['GOOGLE_MAIL_API_KEY']
  if (!apiKey || !connectionKey) return { sent: false, status: 503, error: 'Email notification is not configured.' }
  const { website: _website, ...safe } = enquiry
  const body = `A new ${enquiry.kind} enquiry was received by Rabata.\nReference: ${reference}\n\n${Object.entries(safe).map(([key,value])=>`${key}: ${value}`).join('\n')}\n\nThis information is private. Please handle student and guardian details with care.`
  const message = [`To: ${site.email}`, `Reply-To: ${enquiry.email}`, `Subject: Rabata - new ${enquiry.kind} enquiry`, 'MIME-Version: 1.0', 'Content-Type: text/plain; charset="UTF-8"', '', body].join('\r\n')
  const bytes = new TextEncoder().encode(message)
  const raw = btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join('')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const response = await fetch('https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'X-Connection-Api-Key': connectionKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  })
  if (!response.ok) {
    const errorBody = await response.text()
    console.error(`Gmail notification failed [${response.status}]: ${errorBody}`)
    return { sent: false, status: response.status, error: errorBody }
  }
  return { sent: true }
}