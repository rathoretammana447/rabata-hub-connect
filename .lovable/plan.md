# Rabata Education, Mentorship, Transparency and Impact Platform

## Goal
Extend the existing Rabata website in stages, preserving its branding, public pages, learning resources, private enquiries and existing email notifications. Build usable, secure features only when their supporting backend and access rules are complete; never publish invented financial figures, testimonials, student details or impact claims.

## Phase 1 — Account foundation and secure access
- Enable the selected account sign-in method after confirming auth settings; create account profiles for user names and contact details, and keep roles in a separate protected role registry.
- Establish Admin, Mentor and Student access through verified backend and database policies, not frontend-only checks. Prevent public self-assignment of administrator status.
- Add the public account entry points and protected role-aware pages, with administrator management of account approvals and assignments.
- Provide a protected, one-time bootstrap for the initial administrator account `rabataofficial111@gmail.com`; verify that no public visitor can claim this role.
- Use an initial administrator account, invitations or another confirmed process before exposing staff or child records. Preserve public enquiry forms and email notices.

## Phase 2 — Mentor and student records
- Add private mentor profiles, student records, mentor-to-student assignments, progress updates and attendance using the least sensitive fields needed.
- Enforce and verify that administrators can manage all records, mentors can access only their profiles and assigned students, and students can access only their permitted own records.
- Link new student enrollment requests to the existing consent-aware intake workflow, retaining submission consent and private owner notification.
- Build role-appropriate dashboards for registrations, approvals, mentor allocations and progress; show only counts derived from real records.

## Phase 3 — Learning library and recorded lectures
- Preserve the existing public publisher-attributed resources and search/filter experience.
- Add lecture records, subjects, grades, topics, thumbnails, playlists and access controls, with private uploads and administrative management.
- Verify upload authorization, file size/type limits and playback behavior before accepting videos; do not expose private recordings.

## Phase 4 — Fund transparency
- Add donation, planned allocation, expenditure, public proof and audit records with administrator-only edits and private handling of donor details.
- Show real received, spent and available totals; show zero or clearly marked empty states until verified entries exist.
- Permit only intentionally public supporting documents; restrict sensitive files and bank/donor details.
- Test totals and audit history against recorded entries before publishing any figures.

## Phase 5 — Verified impact and public presentation
- Add an administrator-managed, consent-aware success-story workflow supporting anonymous publication.
- Refresh homepage sections for verified mentors, activities and achievements only when real records and appropriate permissions exist.
- Add navigation to funded transparency, learning and impact pages without disrupting current URLs or content.

## Phase 6 — Security and end-to-end validation
- Test signed-out and wrong-role access to every protected page, server function, record query and file; test mentor-to-mentor and student-to-student isolation.
- Verify form validation, guardian consent, upload restrictions, mobile layouts, data-derived totals, empty states and email behavior.
- Document implemented capabilities, access boundaries, configuration and any remaining work; leave unsupported or unverified functions clearly unfinished rather than simulated.

## Technical approach
- Keep the current TanStack Start, React, Tailwind, existing design tokens, shared site shell, Zod enquiry schema, secure enquiry RPC and Gmail integration.
- Use Lovable Cloud authentication and database migrations for additive application schema; keep all public-table grants, row-level security and policies aligned in the same migration.
- Store application roles separately from profiles and verify roles server-side. Keep privileged database access inside server handlers after authorization.
- Use the Cloud Storage tools for uploads and narrowly scoped policies; keep student records, private lectures, donor data and non-public proofs inaccessible to anonymous visitors.
- Ask for approval of the initial administrator bootstrap method and account setup before enabling any privileged account. Do not invent credentials or auto-confirm email without explicit approval.

## Settled requirements and pending choices
- Account profiles are required.
- Proposed initial administrator email: `rabataofficial111@gmail.com`.
- The uploaded specification requests admin, mentor and student roles; financial transparency and audited edits; mentor/student management; recorded lectures; consent-based or anonymous success stories; and responsive updates that retain the existing site identity.
- Authentication provider and confirmation behavior, mentor/student onboarding and approvals, donation/payment collection, public document visibility, video hosting/upload limits and administrator-bootstrap authorization still need decisions before those capabilities are enabled.
- No fake records, money, progress, testimonials, photos, statistics or success claims.