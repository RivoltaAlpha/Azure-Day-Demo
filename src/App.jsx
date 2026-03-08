import { useState } from 'react'
import './App.css'
import ServicesGrid from './components/ServicesGrid'
import PipelineView from './components/PipelineView'
import JourneyView from './components/JourneyView'

const TABS = [
  { id: 'services', label: 'Azure Services' },
  { id: 'pipeline', label: 'CI/CD Pipeline' },
  { id: 'journey',  label: 'Code → Deploy' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('services')

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-group">
            <AzureLogo />
            <div>
              <h1>Azure Cloud Explorer</h1>
              <p className="tagline">Cloud &amp; DevOps — From Code to Production</p>
            </div>
          </div>
          <div className="header-badge">Live Demo</div>
        </div>
      </header>

      <nav className="tab-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === 'services' && <ServicesGrid />}
        {activeTab === 'pipeline' && <PipelineView />}
        {activeTab === 'journey'  && <JourneyView />}
      </main>

      <footer className="app-footer">
        Deployed on <strong>Azure Static Web Apps</strong> via GitHub Actions &nbsp;•&nbsp; Built with React + Vite
      </footer>
    </div>
  )
}

function AzureLogo() {
  return (
    <svg width="42" height="42" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M33.34 5.01L11.09 52.5l14.09 25.06H51.4L33.34 5.01z" fill="#0078D4"/>
      <path d="M37.5 9.84L22.04 50.33l28.1 27.23H84.9L37.5 9.84z" fill="#00BCF2"/>
      <path d="M51.4 77.56H84.9L51.4 40.98v36.58z" fill="#0078D4" opacity=".5"/>
    </svg>
  )
}
