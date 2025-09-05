'use client'

import { useState, useEffect } from 'react'
import { api } from '../api'

interface Farmer {
  id: number
  name: string
  phone: string
  village: string
  crops?: string
}

interface Activity {
  id: number
  farmer_id: number
  type: string
  notes?: string
  quantity?: number
  unit?: string
}

export default function ActivityLogForm() {
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [selected, setSelected] = useState<number|undefined>(undefined)
  const [list, setList] = useState<Activity[]>([])
  const [form, setForm] = useState<Partial<Activity>>({ type: 'sowing' })
  const [loading, setLoading] = useState(false)
  const [activitiesLoading, setActivitiesLoading] = useState(false)

  useEffect(() => { api<Farmer[]>('/farmers/').then(setFarmers) }, [])
  
  useEffect(() => { 
    if (selected) {
      setActivitiesLoading(true)
      api<Activity[]>(`/activities/by-farmer/${selected}`)
        .then(setList)
        .finally(() => setActivitiesLoading(false))
    } else {
      setList([])
    }
  }, [selected])

  async function add() {
    if (!selected) return alert('Please select a farmer first')
    if (!form.type) return alert('Please enter activity type')
    
    setLoading(true)
    try {
      const created = await api<Activity>('/activities/', {
        method: 'POST',
        body: JSON.stringify({ ...form, farmer_id: selected }),
      })
      setForm({ type: 'sowing' })
      const refreshed = await api<Activity[]>(`/activities/by-farmer/${selected}`)
      setList(refreshed)
      alert(`✅ Activity logged successfully! ID: ${created.id}`)
    } catch (e: any) {
      alert(`❌ Error logging activity: ${e?.message || e}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Farmer Selection */}
      <div className="card">
        <h3 className="text-teal text-lg font-semibold mb-4">Select Farmer</h3>
        <div className="flex flex-col gap-1">
          <select 
            className="select" 
            value={selected||''} 
            onChange={e=>setSelected(Number(e.target.value))}
          >
            <option value='' disabled>Choose a farmer...</option>
            {farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
      </div>

      {/* Activity Form */}
      <div className="card">
        <h3 className="text-teal text-lg font-semibold mb-4">Log New Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Activity Type</label>
            <select 
              className="select" 
              value={form.type||''} 
              onChange={e=>setForm({ ...form, type:e.target.value })} 
            >
              <option value="" disabled>Select activity type</option>
              <option value="sowing">Sowing</option>
              <option value="irrigation">Irrigation</option>
              <option value="spray">Spray</option>
              <option value="pest">Pest Control</option>
              <option value="harvest">Harvest</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <input 
              className="input" 
              placeholder="Enter amount" 
              type="number"
              value={form.quantity||''} 
              onChange={e=>setForm({ ...form, quantity:Number(e.target.value) })} 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Unit</label>
            <input 
              className="input" 
              placeholder="kg, liters, etc." 
              value={form.unit||''} 
              onChange={e=>setForm({ ...form, unit:e.target.value })} 
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea 
              className="input min-h-[80px]" 
              placeholder="Add any additional details here..." 
              value={form.notes||''} 
              onChange={e=>setForm({ ...form, notes:e.target.value })} 
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button 
            className="btn-primary w-full" 
            onClick={add}
            disabled={!selected || !form.type || loading}
          >
            {loading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Logging Activity...
              </>
            ) : (
              '📝 Log Activity'
            )}
          </button>
        </div>
      </div>

      {/* Activity List */}
      {activitiesLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
          <p className="mt-2 text-muted">Loading activities...</p>
        </div>
      )}

      {!activitiesLoading && list.length > 0 && (
        <div className="card">
          <h3 className="text-teal text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-soft">
              <thead className="bg-navy/5 border-b border-navy/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Unit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-navy uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map(a => (
                  <tr key={a.id} className="hover:bg-navy/5 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.quantity || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{a.unit || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate" title={a.notes || 'No notes'}>
                      {a.notes || 'No notes'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!activitiesLoading && list.length === 0 && selected && (
        <div className="card text-center py-8">
          <div className="text-teal text-4xl mb-2">📝</div>
          <h3 className="text-teal text-lg font-semibold mb-2">No Activities Yet</h3>
          <p className="text-muted">No activities logged yet for this farmer.</p>
          <p className="text-sm text-muted mt-1">Start by logging an activity above!</p>
        </div>
      )}

      {!selected && (
        <div className="card text-center py-8">
          <div className="text-teal text-4xl mb-2">👨‍🌾</div>
          <h3 className="text-teal text-lg font-semibold mb-2">Select a Farmer</h3>
          <p className="text-muted">Please select a farmer to view and log activities.</p>
        </div>
      )}
    </div>
  )
}