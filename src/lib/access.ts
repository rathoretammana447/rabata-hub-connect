import { supabase } from '@/integrations/supabase/client'

export const ADMIN_EMAIL = 'rabataofficial111@gmail.com'
export type RoleRow = { id: string; user_id: string; role: 'admin' | 'mentor' | 'student'; status: 'pending' | 'active' | 'rejected'; requested_at: string }

export function friendlyError(message: string) {
  if (message.includes('verified_rabata_email_required')) return 'Only the confirmed Rabata inbox can become the first administrator.'
  if (message.includes('initial_admin_already_claimed')) return 'The first administrator has already been set up.'
  if (message.includes('admin_required')) return 'Only an administrator can do this.'
  if (message.includes('pending_role_request_not_found')) return 'This request was already reviewed.'
  return 'Something went wrong. Please try again.'
}

export async function myRoles(userId: string) {
  const { data, error } = await supabase.from('user_roles').select('id,user_id,role,status,requested_at').eq('user_id', userId)
  if (error) throw error
  return (data ?? []) as RoleRow[]
}