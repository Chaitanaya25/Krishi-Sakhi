'use client'
import { useEffect, useState } from 'react'
import { api } from '../api'

type Farmer = { id: number, name: string }
type Advisory = { id: number, farmer_id: number, text: string, severity: string, source: string }

export default function AdvisoryFeed() {
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [selected, setSelected] = useState<number|undefined>(undefined)
  const [feed, setFeed] = useState<Advisory[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { 
    api<Farmer[]>('/farmers/').then(setFarmers).catch(console.error)
  }, [])

  async function generate() {
    if (!selected) return alert('Please select a farmer first')
    
    setLoading(true)
    try {
      const data = await api<Advisory[]>(`/advisories/for/${selected}`)
      setFeed(data)
    } catch (e: any) {
      alert(`Error generating advisories: ${e?.message || e}`)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-teal">Advisory Feed</h2>
      </div>
      {/* Farmer Selection and Generate Button */}
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="flex-1">
          <label className="block text-sm font-medium text-black mb-2">Select Farmer</label>
          <select 
            className="select text-black" 
            value={selected||''} 
            onChange={e=>setSelected(Number(e.target.value))}
          >
            <option value='' disabled>Choose a farmer...</option>
            {farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        <button 
          className="btn-secondary" 
          onClick={generate}
          disabled={!selected || loading}
        >
          {loading ? 'Generating...' : '🔄 Generate Advisories'}
        </button>
      </div>

      {/* Advisories Display */}
      {feed.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-black">
            Farming Advisories ({feed.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {feed.map(item => {
              const severityColor = 
                item.severity.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                item.severity.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800';
              
              return (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-lg border card ${getSeverityColor(item.severity)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-teal">
                      {item.source}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColor}`}>
                      {item.severity}
                    </span>
                  </div>
                  <div className="text-sm leading-relaxed">{item.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {feed.length === 0 && selected && !loading && (
        <div className="card text-center py-8">
          <div className="text-teal text-4xl mb-2">📋</div>
          <h3 className="text-teal text-lg font-semibold mb-2">No Advisories</h3>
          <p className="text-muted">No advisories available for this farmer.</p>
          <p className="text-sm text-muted mt-1">Generate advisories to see them here!</p>
        </div>
      )}

      {!selected && (
        <div className="card text-center py-8">
          <div className="text-teal text-4xl mb-2">👨‍🌾</div>
          <h3 className="text-teal text-lg font-semibold mb-2">Select a Farmer</h3>
          <p className="text-muted">Select a farmer to view their personalized advisories.</p>
        </div>
      )}
    </div>
  )
}

