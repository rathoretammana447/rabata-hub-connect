# Rabata website

## Working now
- Eleven public pages with individual search and sharing metadata.
- Logo-matched navy, green and gold design, phone navigation and supplied community posters.
- Contact, student and volunteer forms validate input in the browser and on the server, then store it privately in Lovable Cloud.
- View received enquiries in Lovable: More → Database → enquiries. The public website cannot read these records. No public admin account is created.
- Fixed-recipient email links open a visitor’s email app addressed to rabataofficial111@gmail.com.
- New enquiries trigger a private notification from the connected Gmail account to the fixed owner email. Storage succeeds independently of email; if Gmail is unavailable, review the enquiry in Lovable Cloud.
- Both supplied Instagram accounts are linked exactly as requested.
- Free publisher resources support search, subject, class and type filters. A selected video opens a privacy-enhanced YouTube embed; PDF links open the publisher’s files.

## Remaining configuration
- Keep the Gmail connection authorized with permission to send. Gmail notifications use the connected account and do not require a separate sender domain. No visitor can choose the notification recipient or access your inbox through the website.
- No YouTube, Facebook or WhatsApp organization profile was provided. Send the real URLs to add them; no profiles have been invented.
- No payment account or donation details were provided. Financial support is discussed via contact, not collected online.
- Review safeguarding and privacy wording before public launch, and verify permissions for supplied poster imagery.
- Publish when ready. This project has not been published automatically.

## Updating content
Ask Lovable to add a learning resource with its title, source URL, publisher, subject, class and type. Entries are maintained in `src/lib/resources.ts`. Ask Lovable to update the community page with a supplied announcement or activity. Avoid unverified totals and obtain guardian consent before identifying children.

## Information protection
Enquiries are server-only, with row-level security, no browser grants and no public read policies. The intake function restricts repeated submissions to three per email in 15 minutes and uses a honeypot. This is baseline abuse protection, not comprehensive bot prevention; add a verified CAPTCHA before high-traffic promotion. Review stored enquiries and delete those no longer needed. Never publish children's identifying information without consent.

## Imagery
The homepage classroom photo was supplied by the organization and is used with parent or guardian permission. Posters and the room-layout concept were supplied by the organization. No generated illustration is presented as documentary proof of Rabata's activity.
