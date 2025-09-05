'use client'
import AdvisoryFeed from '../../components/AdvisoryFeed'

export default function AdvisoriesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-teal mb-2">📋 Advisory Feed</h1>
        <p className="text-lg text-muted">View and manage farming advisories</p>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="card">
          <AdvisoryFeed />
        </div>
      </div>
    </div>
  )
}
