'use client'

import { useEffect, useState } from 'react'
import { api } from '../api'

type Farmer = { id: number; name: string }

export default function AiAdvisor() {
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [farmerId, setFarmerId] = useState<number | undefined>(undefined)
  const [advice, setAdvice] = useState<string>('')
  const [question, setQuestion] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api<Farmer[]>('/farmers/').then(setFarmers).catch(console.error)
  }, [])

  async function getAdvisory(save = false) {
    if (!farmerId) return alert('Select a farmer')
    setLoading(true); setAdvice(''); setAnswer('')
    try {
      const r = await api<{ text: string; advisory_id?: number }>(
        `/ai/advise/${farmerId}?save=${save}`,
        { method: 'POST' }
      )
      setAdvice(r.text + (r.advisory_id ? `\n\n(Saved as advisory #${r.advisory_id})` : ''))
    } catch (e: any) {
      setAdvice(`Error: ${e?.message || e}`)
    } finally {
      setLoading(false)
    }
  }

  async function ask() {
    if (!question.trim()) return alert('Type a question')
    setLoading(true); setAnswer(''); setAdvice('')
    try {
      const r = await api<{ text: string }>(`/ai/chat`, {
        method: 'POST',
        body: JSON.stringify({ question, farmer_id: farmerId ?? null }),
      })
      setAnswer(r.text)
    } catch (e: any) {
      setAnswer(`Error: ${e?.message || e}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <select
          className="input"
          value={farmerId ?? ''}
          onChange={(e) => setFarmerId(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="" disabled>Select Farmer</option>
          {farmers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <button className="btn" onClick={() => getAdvisory(false)} disabled={loading}>
          {loading ? 'Generating…' : 'Weather-aware Advisory (AI)'}
        </button>
        <button className="btn" onClick={() => getAdvisory(true)} disabled={loading}>
          {loading ? 'Saving…' : 'Generate & Save'}
        </button>
      </div>

      {advice && (
        <pre className="p-4 rounded-xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10 whitespace-pre-wrap">
          {advice}
        </pre>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-start">
        <textarea
          className="input min-h-[120px]"
          placeholder="Ask the AI about your farm, crop schedule, pest management, etc."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="btn h-full" onClick={ask} disabled={loading}>
          {loading ? 'Asking…' : 'Ask AI'}
        </button>
      </div>

      {answer && (
        <pre className="p-4 rounded-xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10 whitespace-pre-wrap">
          {answer}
        </pre>
      )}
    </div>
  )
}
