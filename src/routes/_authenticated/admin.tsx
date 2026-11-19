import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeading } from '@/components/site-shell'
import { supabase } from '@/integrations/supabase/client'
import { friendlyError, type RoleRow } from '@/lib/access'

export const Route = createFileRoute('/_authenticated/admin')({ head: () => ({ meta: [{ title: 'Administrator | Rabata' }, { name: 'robots', content: 'noindex' }] }), component: Admin })

function Admin() {
  const qc = useQueryClient(); const [msg, setMsg] = useState('')
  const q = useQuery({ queryKey: ['admin-roles'], queryFn: async () => {
    const { data: u } = await supabase.auth.getUser()
    const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: u.user!.id, _role: 'admin' })
    if (!isAdmin) return { isAdmin: false, roles: [] as RoleRow[], names: {} as Record<string, string> }
    const { data: roles } = await supabase.from('user_roles').select('id,user_id,role,status,requested_at').order('requested_at', { ascending: false })
    const { data: profiles } = await supabase.from('app_profiles').select('user_id,display_name')
    return { isAdmin: true, roles: (roles ?? []) as RoleRow[], names: Object.fromEntries((profiles ?? []).map(p => [p.user_id, p.display_name])) as Record<string, string> }
  } })
  if (q.isLoading || !q.data) return <section className="section"><div className="container">Loading…</div></section>
  if (!q.data.isAdmin) return <section className="section"><div className="container"><h2>Administrators only</h2><p className="section-copy">Your account does not have administrator access.</p><Link to="/account" className="text-link mt-4">Back to my account</Link></div></section>
  const { roles, names } = q.data
  const count = (role: string, status: string) => roles.filter(r => r.role === role && r.status === status).length
  async function review(id: string, decision: 'active' | 'rejected') {
    const { error } = await supabase.rpc('review_app_role', { p_role_id: id, p_decision: decision })
    setMsg(error ? friendlyError(error.message) : decision === 'active' ? 'Access approved.' : 'Request rejected.'); qc.invalidateQueries({ queryKey: ['admin-roles'] })
  }
  return <><PageHeading eyebrow="Administrator" title="Rabata dashboard" description="Review who can access Rabata records. All counts come from real accounts." />
    <section className="section"><div className="container">
      <div className="impact-mini">
        <div><strong>{count('mentor', 'active')}</strong><span>approved mentors</span></div>
        <div><strong>{count('student', 'active')}</strong><span>approved students</span></div>
        <div><strong>{roles.filter(r => r.status === 'pending').length}</strong><span>pending requests</span></div>
        <div><strong>{count('admin', 'active')}</strong><span>administrators</span></div>
      </div>
      {msg && <div role="status" className="form-status mt-6">{msg}</div>}
      <h2 className="mt-10">Access requests</h2>
      {roles.filter(r => r.role !== 'admin').length === 0 ? <div className="empty-state mt-6">No accounts have requested access yet.</div> :
        <div className="mt-6 grid gap-3">{roles.filter(r => r.role !== 'admin').map(r => <div key={r.id} className="form-panel flex flex-wrap items-center justify-between gap-3" style={{ padding: 16 }}>
          <div><strong>{names[r.user_id] || 'Unnamed account'}</strong> <span className="capitalize">· {r.role}</span> <small className="text-muted-foreground">· {r.status === 'active' ? 'approved' : r.status}</small></div>
          {r.status === 'pending' && <div className="flex gap-2"><Button size="sm" onClick={() => review(r.id, 'active')}>Approve</Button><Button size="sm" variant="outline" onClick={() => review(r.id, 'rejected')}>Reject</Button></div>}
        </div>)}</div>}
      <p className="form-fine mt-6">Contact, student and volunteer form submissions are still saved privately and emailed to the Rabata inbox.</p>
    </div></section></>
}