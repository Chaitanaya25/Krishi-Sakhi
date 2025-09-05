'use client'
import FarmerProfileForm from '@/components/FarmerProfileForm'

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-teal mb-2">🌾 Krishi Sakhi</h1>
        <p className="text-lg text-muted">Your Personal Farming Assistant</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6 text-teal flex items-center gap-2">
            👨‍🌾 Farmer Profile
          </h2>
          <FarmerProfileForm />
        </div>
      </div>

      <div className="card text-center p-4">
        <p className="text-teal font-medium">Use the navigation menu above to access other features:</p>
        <p className="text-sm mt-2 text-muted">
          <span className="inline-block mx-2 px-3 py-1 bg-lightblue/10 rounded-lg">🤖 AI Advisor</span> • 
          <span className="inline-block mx-2 px-3 py-1 bg-teal/10 rounded-lg">📝 Activity Log</span> • 
          <span className="inline-block mx-2 px-3 py-1 bg-yellow/10 rounded-lg">📋 Advisory Feed</span>
        </p>
      </div>
    </div>
  )
}