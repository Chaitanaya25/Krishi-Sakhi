'use client'
import ActivityLogForm from '../../components/ActivityLogForm'

export default function ActivitiesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📝 Activity Log</h1>
        <p className="text-lg text-muted">Track and manage farming activities</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <ActivityLogForm />
        </div>
      </div>
    </div>
  )
}
