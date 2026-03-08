import { useState, useEffect } from 'react'
import './PipelineView.css'

const PIPELINE_STAGES = [
  {
    id: 'code',
    name: 'Code',
    icon: '📝',
    color: '#002050',
    steps: ['git commit -m "feat: add feature"', 'git push origin feature/my-feature', 'Open Pull Request → code review', 'PR checks pass → merge to main'],
    tool: 'GitHub / Azure Repos',
    duration: '~5 min',
  },
  {
    id: 'build',
    name: 'Build',
    icon: '🔨',
    color: '#0078D4',
    steps: ['npm ci (clean install)', 'npm run lint (ESLint)', 'npm run build (Vite)', 'docker build -t myapp:$SHA .'],
    tool: 'GitHub Actions / Azure Pipelines',
    duration: '~3 min',
  },
  {
    id: 'test',
    name: 'Test',
    icon: '🧪',
    color: '#68217A',
    steps: ['npm test (Jest / Vitest)', 'Code coverage > 80%', 'Integration tests', 'Security scan (Trivy)'],
    tool: 'GitHub Actions',
    duration: '~4 min',
  },
  {
    id: 'publish',
    name: 'Publish',
    icon: '📦',
    color: '#00BCF2',
    steps: ['docker push to Azure ACR', 'Tag: v1.2.3 + git SHA', 'Upload build artifact', 'Generate SBOM (supply chain)'],
    tool: 'Azure Container Registry',
    duration: '~2 min',
  },
  {
    id: 'staging',
    name: 'Deploy Dev',
    icon: '🌿',
    color: '#00B74A',
    steps: ['Deploy to dev environment', 'kubectl apply -f manifests/', 'Wait for rollout ready', 'Smoke tests pass'],
    tool: 'AKS / App Service / SWA',
    duration: '~3 min',
  },
  {
    id: 'prod',
    name: 'Deploy Prod',
    icon: '🚀',
    color: '#FF8C00',
    steps: ['Manual approval required', 'Blue/green or canary deploy', 'Health check probes pass', 'Monitor for 5 min post-deploy'],
    tool: 'AKS + Azure Monitor',
    duration: '~5 min',
  },
]

const STATUS_CYCLE = ['idle', 'running', 'success', 'failed']

export default function PipelineView() {
  const [runState, setRunState] = useState({}) // stageId -> status
  const [running, setRunning] = useState(false)
  const [activeStage, setActiveStage] = useState(null)

  async function simulatePipeline() {
    if (running) return
    setRunning(true)
    setRunState({})

    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      const stage = PIPELINE_STAGES[i]
      // Fail randomly on test stage for demo effect sometimes
      const willFail = stage.id === 'test' && Math.random() < 0.2

      setRunState(prev => ({ ...prev, [stage.id]: 'running' }))
      await sleep(1200 + Math.random() * 600)

      if (willFail) {
        setRunState(prev => ({ ...prev, [stage.id]: 'failed' }))
        setRunning(false)
        return
      }

      setRunState(prev => ({ ...prev, [stage.id]: 'success' }))
    }
    setRunning(false)
  }

  function resetPipeline() {
    setRunState({})
    setRunning(false)
  }

  const allSuccess = PIPELINE_STAGES.every(s => runState[s.id] === 'success')
  const anyFailed  = PIPELINE_STAGES.some(s => runState[s.id] === 'failed')

  return (
    <div className="pipeline-root">
      <div className="pipeline-toolbar">
        <h2 className="section-title">CI/CD Pipeline Simulator</h2>
        <div className="pipeline-controls">
          <button
            className="btn btn-primary"
            onClick={simulatePipeline}
            disabled={running}
          >
            {running ? '⏳ Running...' : '▶ Run Pipeline'}
          </button>
          <button className="btn btn-secondary" onClick={resetPipeline} disabled={running}>
            ↺ Reset
          </button>
        </div>
      </div>

      {allSuccess && (
        <div className="pipeline-banner success">
          ✅ Pipeline succeeded! Your app is live on Azure.
        </div>
      )}
      {anyFailed && (
        <div className="pipeline-banner failed">
          ❌ Pipeline failed at <strong>{PIPELINE_STAGES.find(s => runState[s.id] === 'failed')?.name}</strong>. Fix and re-push.
        </div>
      )}

      {/* Stage track */}
      <div className="stages-track">
        {PIPELINE_STAGES.map((stage, i) => {
          const status = runState[stage.id] || 'idle'
          return (
            <div key={stage.id} className="stage-wrapper">
              <button
                className={`stage-card status-${status}`}
                style={{ '--color': stage.color }}
                onClick={() => setActiveStage(activeStage?.id === stage.id ? null : stage)}
              >
                <div className="stage-icon">{stage.icon}</div>
                <div className="stage-name">{stage.name}</div>
                <div className={`stage-status-badge status-${status}`}>
                  {status === 'running' && <span className="spinner" />}
                  {status === 'success' && '✓'}
                  {status === 'failed'  && '✗'}
                  {status === 'idle'    && '○'}
                  {' '}{status}
                </div>
              </button>
              {i < PIPELINE_STAGES.length - 1 && (
                <div className={`stage-arrow ${runState[stage.id] === 'success' ? 'active' : ''}`}>
                  →
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Detail panel */}
      {activeStage && (
        <div className="stage-detail" style={{ borderTopColor: activeStage.color }}>
          <div className="detail-header" style={{ background: activeStage.color }}>
            <span>{activeStage.icon} {activeStage.name}</span>
            <div className="detail-meta">
              <span>🛠 {activeStage.tool}</span>
              <span>⏱ {activeStage.duration}</span>
            </div>
          </div>
          <div className="detail-steps">
            {activeStage.steps.map((step, i) => (
              <div key={i} className="detail-step">
                <span className="step-num">{i + 1}</span>
                <code>{step}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* YAML snippet */}
      <div className="yaml-section">
        <div className="yaml-header">
          <span>📄 .github/workflows/deploy.yml</span>
          <span className="yaml-badge">GitHub Actions</span>
        </div>
        <pre className="yaml-code">{YAML_SNIPPET}</pre>
      </div>
    </div>
  )
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const YAML_SNIPPET = `name: Build and Deploy to Azure

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with: { node-version: '20' }

      - name: Install & Build
        run: |
          npm ci
          npm run build

      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: \${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: \${{ secrets.GITHUB_TOKEN }}
          action: upload
          app_location: /
          output_location: dist`
