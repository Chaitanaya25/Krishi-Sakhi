'use client'
import { useEffect, useState } from 'react'
import { api } from '../api'


type Farmer = { id: number, name: string }


type Advisory = { id: number, farmer_id: number, text: string, severity: string, source: string }


export default function AdvisoryFeed() {
const [farmers, setFarmers] = useState<Farmer[]>([])
const [selected, setSelected] = useState<number|undefined>(undefined)
const [feed, setFeed] = useState<Advisory[]>([])


useEffect(() => { api<Farmer[]>('/farmers/').then(setFarmers) }, [])


async function generate() {
if (!selected) return alert('Select farmer with lat/lon set')
const data = await api<Advisory[]>(`/advisories/for/${selected}`)
setFeed(data)
}


return (
<div>
<div className="flex gap-3 items-center">
<select className="input" value={selected||''} onChange={e=>setSelected(Number(e.target.value))}>
<option value='' disabled>Select Farmer</option>
{farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
</select>
<button className="btn" onClick={generate}>Generate Advisories</button>
</div>


<div className="grid md:grid-cols-2 gap-3 mt-4">
{feed.map(item => (
<div key={item.id} className="p-4 rounded-2xl border backdrop-blur bg-white/70 dark:bg-white/10">
<div className="text-sm opacity-70">{item.source.toUpperCase()} • {item.severity}</div>
<div className="mt-2 font-medium">{item.text}</div>
</div>
))}
</div>
</div>
)
}