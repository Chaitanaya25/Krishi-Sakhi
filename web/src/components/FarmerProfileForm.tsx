// web/src/components/FarmerProfileForm.tsx
'use client'

import { useMemo, useState } from 'react'
import { api } from '../api'

type FarmerCreate = {
  name?: string
  phone?: string
  language?: string
  latitude?: number
  longitude?: number
  land_size_acres?: number
  soil_type?: string
  irrigation_type?: string
  crops?: string
}

const ACRE_TO_HA = 0.404685642

// Enhanced browser geolocation with better error handling
function getBrowserLocation(timeout = 20000): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      return reject(new Error('Geolocation not supported by this browser'))
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = Number(pos.coords.latitude.toFixed(6))
        const longitude = Number(pos.coords.longitude.toFixed(6))
        resolve({ latitude, longitude })
      },
      (err) => {
        let errorMessage = 'Unknown error'
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied'
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case err.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        reject(new Error(errorMessage))
      },
      { 
        enableHighAccuracy: true, 
        timeout, 
        maximumAge: 5 * 60 * 1000 // 5 minutes
      }
    )
  })
}

export default function FarmerProfileForm() {
  const [form, setForm] = useState<FarmerCreate>({ language: 'en' })
  const [locStatus, setLocStatus] = useState<'idle' | 'fetching' | 'gps_success' | 'ip_success' | 'error'>('idle')
  const [locMsg, setLocMsg] = useState<string>('Click "Get My Location" to fetch coordinates')

  // Convert UI acres -> hectares for API
  const landSizeHa = useMemo(() => {
    const a = form.land_size_acres
    if (a == null || isNaN(a)) return undefined
    return Number((a * ACRE_TO_HA).toFixed(4))
  }, [form.land_size_acres])

  // Enhanced location fetching with better user feedback
  async function fetchLocation() {
    if (locStatus === 'fetching') return
    
    setLocStatus('fetching')
    setLocMsg('🔍 Attempting to get your location...')

    try {
      // 1) Try precise browser GPS location
      console.log('Attempting browser GPS location...')
      const gps = await getBrowserLocation()
      setForm((f) => ({ ...f, latitude: gps.latitude, longitude: gps.longitude }))
      setLocStatus('gps_success')
      setLocMsg('✅ Using high-accuracy GPS location')
      console.log('GPS location successful:', gps)
      
      // Save to localStorage for future use
      try {
        localStorage.setItem('ks:lastLocation', JSON.stringify(gps))
      } catch {}
      return
    } catch (e: any) {
      console.warn('Browser GPS failed:', e.message)
      setLocMsg(`⚠️ GPS failed: ${e.message}. Trying IP-based location...`)
    }

    try {
      // 2) Fallback: backend IP geolocation
      console.log('Attempting IP-based geolocation...')
      const ip = await api<any>('/geo/ip', { method: 'GET' })
      console.log('IP geolocation response:', ip)
      
      if (typeof ip?.latitude === 'number' && typeof ip?.longitude === 'number') {
        setForm((f) => ({ ...f, latitude: ip.latitude, longitude: ip.longitude }))
        setLocStatus('ip_success')
        const cityInfo = ip.city ? ` (${ip.city})` : ''
        setLocMsg(`✅ Using approximate IP location${cityInfo}`)
        console.log('IP location successful:', ip)
        return
      }
      throw new Error('Response missing coordinates')
    } catch (e: any) {
      setLocStatus('error')
      let errorMessage = 'Unknown error'
      
      if (e?.detail?.error) {
        errorMessage = e.detail.error
      } else if (e?.message) {
        errorMessage = e.message
      } else if (typeof e === 'string') {
        errorMessage = e
      }
      
      setLocMsg(`❌ Failed to get location: ${errorMessage}`)
      console.error('IP geolocation failed:', e)
    }
  }

  async function save() {
    if (!form.name) return alert('Please enter a name')
    if (!form.latitude || !form.longitude) return alert('Please fetch your location first')
    
    const payload = {
      name: form.name,
      phone: form.phone,
      language: form.language,
      latitude: form.latitude,
      longitude: form.longitude,
      land_size_ha: landSizeHa,
      soil_type: form.soil_type,
      irrigation_type: form.irrigation_type,
      crops: form.crops,
    }
    
    try {
      const created = await api<any>('/farmers/', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      alert(`✅ Farmer saved successfully! ID: ${created.id}`)
    } catch (e: any) {
      alert(`❌ Error saving farmer: ${e?.message || e}`)
    }
  }

  function refreshPage() {
    location.reload()
  }

  // Get status icon and color
  const getStatusDisplay = () => {
    switch (locStatus) {
      case 'gps_success':
        return { icon: '✅', color: 'text-green-600', bg: 'bg-green-50' }
      case 'ip_success':
        return { icon: '📍', color: 'text-blue-600', bg: 'bg-blue-50' }
      case 'error':
        return { icon: '❌', color: 'text-red-600', bg: 'bg-red-50' }
      case 'fetching':
        return { icon: '🔍', color: 'text-yellow-600', bg: 'bg-yellow-50' }
      default:
        return { icon: '📍', color: 'text-gray-600', bg: 'bg-gray-50' }
    }
  }

  const statusDisplay = getStatusDisplay()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Farmer Name *</label>
          <input
            className="input"
            placeholder="Enter farmer's full name"
            value={form.name ?? ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Phone Number</label>
          <input
            className="input"
            placeholder="Enter contact number"
            value={form.phone ?? ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Language</label>
          <select
            className="select"
            value={form.language ?? ''}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          >
            <option value="" disabled>Select language</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ml">Malayalam</option>
          </select>
        </div>

        {/* Latitude with location fetch button */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Latitude</label>
          <div className="flex gap-2">
            <input
              className="input flex-1"
              placeholder="Enter latitude coordinates"
              type="number"
              step="any"
              value={form.latitude ?? ''}
              onChange={(e) =>
                setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : undefined })
              }
            />
            <button
              className="btn-primary whitespace-nowrap"
              onClick={fetchLocation}
              disabled={locStatus === 'fetching'}
              title="Get My Location"
            >
              {locStatus === 'fetching' ? '🔍 Fetching...' : '📍 Get Location'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Longitude</label>
          <input
            className="input"
            placeholder="Enter longitude coordinates"
            type="number"
            step="any"
            value={form.longitude ?? ''}
            onChange={(e) =>
              setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>

        {/* Land size input with conversion helper */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Land Size (acres)</label>
          <div className="flex flex-col">
            <input
              className="input"
              placeholder="Enter land size"
              type="number"
              step="any"
              value={form.land_size_acres ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  land_size_acres: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
            {form.land_size_acres != null && !isNaN(form.land_size_acres) && (
              <span className="text-sm text-muted mt-1">
                ≈ {landSizeHa} hectares
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Soil Type</label>
          <select
            className="select"
            value={form.soil_type ?? ''}
            onChange={(e) => setForm({ ...form, soil_type: e.target.value })}
          >
            <option value="" disabled>Select soil type</option>
            <option value="clay">Clay</option>
            <option value="sandy">Sandy</option>
            <option value="loamy">Loamy</option>
            <option value="silty">Silty</option>
            <option value="peaty">Peaty</option>
            <option value="chalky">Chalky</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Irrigation Type</label>
          <select
            className="select"
            value={form.irrigation_type ?? ''}
            onChange={(e) => setForm({ ...form, irrigation_type: e.target.value })}
          >
            <option value="" disabled>Select irrigation type</option>
            <option value="drip">Drip Irrigation</option>
            <option value="sprinkler">Sprinkler</option>
            <option value="flood">Flood Irrigation</option>
            <option value="furrow">Furrow Irrigation</option>
            <option value="rainfed">Rainfed (No Irrigation)</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Crops</label>
          <input
            className="input"
            placeholder="Enter crops (comma separated)"
            value={form.crops ?? ''}
            onChange={(e) => setForm({ ...form, crops: e.target.value })}
          />
          <span className="text-xs text-muted mt-1">Example: rice, wheat, vegetables</span>
        </div>
      </div>

      {/* Enhanced location status display */}
      <div className={`p-3 rounded-lg ${statusDisplay.bg} border border-gray-200`}>
        <div className={`flex items-center gap-2 ${statusDisplay.color}`}>
          <span className="text-lg">{statusDisplay.icon}</span>
          <span className="text-sm font-medium">{locMsg}</span>
        </div>
        {locStatus === 'gps_success' && (
          <p className="text-xs text-green-700 mt-1">
            High accuracy GPS coordinates obtained
          </p>
        )}
        {locStatus === 'ip_success' && (
          <p className="text-xs text-blue-700 mt-1">
            Using approximate location based on IP address
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button 
          className="btn-primary flex-1" 
          onClick={save}
          disabled={!form.name || !form.latitude || !form.longitude}
        >
          💾 Save Farmer Profile
        </button>
        <button className="btn-secondary" onClick={refreshPage}>
          🔄 Refresh
        </button>
      </div>
    </div>
  )
}
