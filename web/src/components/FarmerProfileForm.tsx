// web/src/components/FarmerProfileForm.tsx
'use client'

import { useMemo, useState } from 'react'
import { api } from '../api' // keep your working relative path

type FarmerCreate = {
  name?: string
  phone?: string
  language?: string
  latitude?: number
  longitude?: number
  land_size_acres?: number // UI unit
  soil_type?: string
  irrigation_type?: string
  crops?: string
}

const ACRE_TO_HA = 0.404685642

// Small helper to wrap browser geolocation in a Promise
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
      (err) => reject(err),
      { enableHighAccuracy: true, timeout, maximumAge: 0 }
    )
  })
}

export default function FarmerProfileForm() {
  const [form, setForm] = useState<FarmerCreate>({ language: 'en' })
  const [locStatus, setLocStatus] = useState<'idle' | 'fetching' | 'ok' | 'error'>('idle')
  const [locMsg, setLocMsg] = useState<string>('Not fetched')

  // Convert UI acres -> hectares for API
  const landSizeHa = useMemo(() => {
    const a = form.land_size_acres
    if (a == null || isNaN(a)) return undefined
    return Number((a * ACRE_TO_HA).toFixed(4))
  }, [form.land_size_acres])

  // Button handler: GPS first, then backend /geo/ip as fallback
  async function fetchLocation() {
    setLocStatus('fetching')
    setLocMsg('Fetching…')

    try {
      // 1) Try precise browser location
      const gps = await getBrowserLocation()
      setForm((f) => ({ ...f, latitude: gps.latitude, longitude: gps.longitude }))
      setLocStatus('ok')
      setLocMsg('High-accuracy location set (browser) ✅')
      try {
        localStorage.setItem('ks:lastLocation', JSON.stringify(gps))
      } catch {}
      return
    } catch (e: any) {
      console.warn('Browser geolocation failed, falling back to /geo/ip', e?.message || e)
    }

    try {
      // 2) Fallback: your backend IP geolocation
      // Expected shape: { latitude, longitude, source, ... }
      const ip = await api<any>('/geo/ip', { method: 'GET' })
      if (typeof ip?.latitude === 'number' && typeof ip?.longitude === 'number') {
        setForm((f) => ({ ...f, latitude: ip.latitude, longitude: ip.longitude }))
        setLocStatus('ok')
        setLocMsg(`Using approximate IP-based location (${ip.source || 'ip'}) ✅`)
        return
      }
      throw new Error('Response missing coordinates')
    } catch (e: any) {
      setLocStatus('error')
      setLocMsg(`Failed to get location: ${e?.message || e}`)
    }
  }

  async function save() {
    if (!form.name) return alert('Please enter a name')
    const payload = {
      name: form.name,
      phone: form.phone,
      language: form.language,
      latitude: form.latitude,
      longitude: form.longitude,
      land_size_ha: landSizeHa, // convert to hectares for API
      soil_type: form.soil_type,
      irrigation_type: form.irrigation_type,
      crops: form.crops,
    }
    const created = await api<any>('/farmers/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    alert(`Saved farmer #${created.id}`)
  }

  function refreshPage() {
    location.reload()
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <input
          className="input"
          placeholder="Name"
          value={form.name ?? ''}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Phone"
          value={form.phone ?? ''}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="input"
          placeholder="Language (ml/en/hi)"
          value={form.language ?? ''}
          onChange={(e) => setForm({ ...form, language: e.target.value })}
        />

        {/* Latitude with manual fetch button */}
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Latitude"
            type="number"
            step="any"
            value={form.latitude ?? ''}
            onChange={(e) =>
              setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : undefined })
            }
          />
          <button
            className="btn whitespace-nowrap"
            onClick={fetchLocation}
            disabled={locStatus === 'fetching'}
            title="Get My Location"
          >
            {locStatus === 'fetching' ? 'Fetching…' : 'Get My Location'}
          </button>
        </div>

        <input
          className="input"
          placeholder="Longitude"
          type="number"
          step="any"
          value={form.longitude ?? ''}
          onChange={(e) =>
            setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : undefined })
          }
        />

        {/* Acres input + helper */}
        <div className="flex flex-col">
          <input
            className="input"
            placeholder="Land size (acres)"
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
          <span className="text-xs opacity-70 mt-1">
            {form.land_size_acres != null && !isNaN(form.land_size_acres)
              ? `≈ ${landSizeHa} ha`
              : 'Not fetched'}
          </span>
        </div>

        <input
          className="input"
          placeholder="Soil type"
          value={form.soil_type ?? ''}
          onChange={(e) => setForm({ ...form, soil_type: e.target.value })}
        />
        <input
          className="input"
          placeholder="Irrigation"
          value={form.irrigation_type ?? ''}
          onChange={(e) => setForm({ ...form, irrigation_type: e.target.value })}
        />
        <input
          className="input col-span-2"
          placeholder="Crops (comma separated)"
          value={form.crops ?? ''}
          onChange={(e) => setForm({ ...form, crops: e.target.value })}
        />
      </div>

      <div className="text-xs mt-2 opacity-70">{locMsg}</div>

      <div className="mt-3 flex gap-3">
        <button className="btn" onClick={save}>Save Farmer</button>
        <button className="btn" onClick={refreshPage}>Refresh</button>
      </div>
    </div>
  )
}
