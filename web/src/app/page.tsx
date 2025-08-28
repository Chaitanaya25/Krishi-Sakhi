'use client'
import FarmerProfileForm from '@/components/FarmerProfileForm'
import ActivityLogForm from '@/components/ActivityLogForm'
import AdvisoryFeed from '@/components/AdvisoryFeed'



export default function Home() {
return (
<div className="grid md:grid-cols-2 gap-6">
<section className="card">
<h2 className="text-2xl font-semibold mb-4">Farmer Profile</h2>
<FarmerProfileForm />
</section>


<section className="card">
<h2 className="text-2xl font-semibold mb-4">Activity Log</h2>
<ActivityLogForm />
</section>


<section className="md:col-span-2 card">
<h2 className="text-2xl font-semibold mb-4">Advisory Feed</h2>
<AdvisoryFeed />
</section>
</div>
)
}