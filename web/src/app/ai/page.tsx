'use client'
import { useState } from 'react'
import AIAdvisor from '../../components/AIAdvisor'
import AdvisoryFeed from '../../components/AdvisoryFeed'

export default function AiPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAdvisoryGenerated = () => {
    // Trigger advisory feed refresh
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">
          🤖 AI Advisor
        </h1>
        <p className="text-lg text-black font-medium">
          Get intelligent farming advice powered by Ollama AI
        </p>
      </div>
      
      {/* AI Advisory and Chat */}
      <AIAdvisor onAdvisoryGenerated={handleAdvisoryGenerated} />
      
      {/* Advisory Feed - automatically refreshes when new advisory is generated */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-black mb-6">
          📋 Recent Advisories
        </h2>
        <AdvisoryFeed key={refreshKey} />
      </div>
    </div>
  )
}
