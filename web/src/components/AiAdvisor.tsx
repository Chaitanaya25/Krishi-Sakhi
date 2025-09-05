'use client'

import { useEffect, useState } from 'react'
import { api } from '../api'

type Farmer = { id: number; name: string }
type Advisory = { id: number; text: string; source: string; severity: string }
type ChatResponse = { answer: string; farmer_id: number }
type WeatherData = { temperature: number; conditions: string; humidity: number; wind_speed: number; advisory: string }

interface AIAdvisorProps {
  onAdvisoryGenerated?: () => void // Callback to refresh advisory feed
}

export default function AIAdvisor({ onAdvisoryGenerated }: AIAdvisorProps) {
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [farmerId, setFarmerId] = useState<number | undefined>(undefined)
  const [advisoryText, setAdvisoryText] = useState<string>('')
  const [chatResponse, setChatResponse] = useState<string>('')
  const [question, setQuestion] = useState<string>('')
  const [advisoryLoading, setAdvisoryLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  useEffect(() => {
    api<Farmer[]>('/farmers/').then(setFarmers).catch(console.error)
  }, [])

  async function generateAdvisory() {
    if (!farmerId) {
      alert('Please select a farmer first')
      return
    }
    setAdvisoryLoading(true)
    setAdvisoryText('')
    try {
      const response = await api<Advisory>(`/ai/advise/${farmerId}`, { method: 'POST' })
      setAdvisoryText(response.text)
      onAdvisoryGenerated?.()
    } catch (error: any) {
      setAdvisoryText('Could not connect to AI service. Please ensure Ollama is running.')
      console.error('Advisory generation error:', error)
    } finally {
      setAdvisoryLoading(false)
    }
  }

  async function askAI() {
    if (!question.trim()) {
      alert('Please type a question')
      return
    }
    if (!farmerId) {
      alert('Please select a farmer first')
      return
    }
    setChatLoading(true)
    setChatResponse('')
    try {
      const response = await api<ChatResponse>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ question: question.trim(), farmer_id: farmerId })
      })
      setChatResponse(response.answer)
      setQuestion('')
    } catch (error: any) {
      setChatResponse('Could not connect to AI service. Please ensure Ollama is running.')
      console.error('AI chat error:', error)
    } finally {
      setChatLoading(false)
    }
  }

  async function fetchWeather() {
    if (!farmerId) {
      alert('Please select a farmer first')
      return
    }
    setWeatherLoading(true)
    setWeatherData(null)
    try {
      const response = await api<WeatherData>(`/ai/weather/${farmerId}`, { method: 'GET' })
      setWeatherData(response)
    } catch (error: any) {
      alert('Could not fetch weather data. Please try again later.')
      console.error('Weather fetch error:', error)
    } finally {
      setWeatherLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      askAI()
    }
  }

  return (
    <div className="space-y-6">
      {/* Farmer Selection */}
      <div className="card">
        <h3 className="text-teal text-lg font-semibold mb-4">
          Select Farmer
        </h3>
        <div className="flex flex-col gap-1">
          <select
            className="select w-full"
            value={farmerId ?? ''}
            onChange={(e) => setFarmerId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="" disabled>Choose a farmer...</option>
            {farmers.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Advisory Section */}
      <div className="card">
        <h3 className="text-teal text-lg font-semibold mb-4">
          Generate AI Advisory
        </h3>
        <div className="space-y-4">
          <button
            className="btn-primary w-full sm:w-auto"
            onClick={generateAdvisory}
            disabled={advisoryLoading || !farmerId}
          >
            {advisoryLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Generating...
              </>
            ) : (
              '🌱 Generate Advisory'
            )}
          </button>

          {advisoryText && (
            <div className="rounded-xl bg-teal/10 p-4 border border-teal/20">
              <h4 className="text-teal font-semibold mb-2">
                AI Advisory
              </h4>
              <div className="text-sm text-gray-700 leading-relaxed">
                {advisoryText}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weather Advisory Section */}
      <div className="card">
        <h3 className="text-teal text-lg font-semibold mb-4">
          Weather Advisory
        </h3>
        <div className="space-y-4">
          <button
            className="btn-secondary w-full sm:w-auto"
            onClick={fetchWeather}
            disabled={weatherLoading || !farmerId}
          >
            {weatherLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Fetching...
              </>
            ) : (
              '☁️ Get Weather Forecast'
            )}
          </button>

          {weatherData && (
            <div className="rounded-xl bg-lightblue/10 p-4 border border-lightblue/20">
              <h4 className="text-teal font-semibold mb-2">
                Weather Forecast
              </h4>
              <div className="text-sm text-gray-700 leading-relaxed">
                <p><strong>Temperature:</strong> {weatherData.temperature}°C</p>
                <p><strong>Conditions:</strong> {weatherData.conditions}</p>
                <p><strong>Humidity:</strong> {weatherData.humidity}%</p>
                <p><strong>Wind:</strong> {weatherData.wind_speed} km/h</p>
                <p className="mt-2"><strong>Advisory:</strong> {weatherData.advisory}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Chat Section */}
      <div className="card">
        <h3 className="text-teal text-lg font-semibold mb-4">
          AI Chat
        </h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Ask a farming question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askAI()}
            />
            <button
              className="btn-primary px-4"
              onClick={askAI}
              disabled={chatLoading || !farmerId || !question.trim()}
            >
              {chatLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                '💬 Ask'
              )}
            </button>
          </div>

          {chatResponse && (
            <div className="rounded-xl bg-background p-4 border border-gray-200 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                <h4 className="text-teal font-semibold">
                  AI Response
                </h4>
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-xl px-3 py-2 bg-teal text-white shadow-sm">
                    <div className="text-sm leading-relaxed">
                      {chatResponse}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="card bg-background border border-lightblue/20 text-sm">
        <h3 className="text-teal text-lg font-semibold mb-2">
          💡 Tips for Better AI Responses
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Be specific with your questions</li>
          <li>Mention your crops, soil type, or specific farming challenges</li>
          <li>Ask about seasonal advice relevant to your region</li>
          <li>For complex issues, provide background information</li>
        </ul>
      </div>

      {!farmerId && (
        <div className="text-center py-4 text-black">
          <p>Select a farmer to start using AI advisory and chat features.</p>
        </div>
      )}
    </div>
  )
}

