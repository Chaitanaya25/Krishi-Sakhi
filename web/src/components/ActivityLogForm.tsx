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

  useEffect(() => { api<Farmer[]>('/farmers/').then(setFarmers) }, [])
  useEffect(() => { if (selected) api<Activity[]>(`/activities/by-farmer/${selected}`).then(setList) }, [selected])

  async function add() {
    if (!selected) return alert('Select farmer')
    const created = await api<Activity>('/activities/', {
      method: 'POST',
      body: JSON.stringify({ ...form, farmer_id: selected }),
    })
    setForm({ type: 'sowing' })
    const refreshed = await api<Activity[]>(`/activities/by-farmer/${selected}`)
    setList(refreshed)
    alert(`Logged activity #${created.id}`)
  }

  return (
    <div>
      <select className="input" value={selected||''} onChange={e=>setSelected(Number(e.target.value))}>
        <option value='' disabled>Select Farmer</option>
        {farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <input className="input" placeholder="Type (sowing/irrigation/spray/pest/harvest)" value={form.type||''} onChange={e=>setForm({ ...form, type:e.target.value })} />
        <input className="input" placeholder="Quantity" value={form.quantity||''} onChange={e=>setForm({ ...form, quantity:Number(e.target.value) })} />
        <input className="input" placeholder="Unit" value={form.unit||''} onChange={e=>setForm({ ...form, unit:e.target.value })} />
        <input className="input col-span-2" placeholder="Notes" value={form.notes||''} onChange={e=>setForm({ ...form, notes:e.target.value })} />
      </div>

      <div className="mt-3 flex gap-3">
        <button className="btn" onClick={add}>Add Activity</button>
      </div>

      {list.length > 0 && (
        <ul className="mt-4 space-y-2 max-h-60 overflow-auto">
          {list.map(a => (
            <li key={a.id} className="p-3 rounded-xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10">
              <div className="font-semibold">{a.type}</div>
              <div className="text-sm opacity-80">{a.notes || '—'} ({a.quantity||'-'} {a.unit||''})</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}