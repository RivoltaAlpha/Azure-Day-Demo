import { useState } from 'react'
import './JourneyView.css'

const STEPS = [
  {
    number: '01',
    phase: 'Write Code',
    color: '#002050',
    icon: '💻',
    azure_tools: ['VS Code + Azure Extensions', 'Azure CLI (az login)', 'Azurite (local emulator)', 'Dev Containers'],
    what_happens: 'A developer writes the feature locally. They use the Azure CLI to authenticate and test against Azure services. Dev Containers ensure consistent environments across the team.',
    commands: ['az login', 'az account set --subscription "My Sub"', 'npm run dev', 'git add . && git commit -m "feat: new feature"'],
    devops_tip: 'Use branch naming conventions (feat/, fix/, hotfix/) and link commits to work items in Azure Boards.',
  },
  {
    number: '02',
    phase: 'Pull Request',
    color: '#0078D4',
    icon: '🔁',
    azure_tools: ['Azure Repos / GitHub', 'Branch policies', 'Required reviewers', 'Status checks'],
    what_happens: 'A PR is opened against main. Branch protection policies require at least 1 reviewer approval and all CI checks to pass before merging.',
    commands: ['git push origin feat/my-feature', '# Open PR in GitHub / Azure DevOps', '# Request reviewers', '# Wait for CI + review approvals'],
    devops_tip: 'Lock the main branch: require PRs, CI passing, and link to a work item. This is your quality gate.',
  },
  {
    number: '03',
    phase: 'CI — Build & Test',
    color: '#68217A',
    icon: '🔨',
    azure_tools: ['GitHub Actions', 'Azure Pipelines', 'Azure Container Registry', 'SonarCloud (optional)'],
    what_happens: 'On every push, CI automatically installs dependencies, lints, runs tests, builds a Docker image, and pushes it to Azure Container Registry (ACR). Artifacts are versioned by git SHA.',
    commands: ['npm ci', 'npm run lint && npm run test', 'docker build -t myapp:${{ github.sha }} .', 'docker push myregistry.azurecr.io/myapp:$SHA'],
    devops_tip: 'Tag images with both the git SHA (immutable) and a semantic version. Never use "latest" in production.',
  },
  {
    number: '04',
    phase: 'Deploy to Dev',
    color: '#00B74A',
    icon: '🌿',
    azure_tools: ['Azure App Service', 'Azure Static Web Apps', 'AKS (dev namespace)', 'Slot deployments'],
    what_happens: 'After CI passes, the pipeline automatically deploys to a development environment. For web apps, Azure Static Web Apps creates a unique preview URL per PR — teams can review the live app before merging.',
    commands: ['# GitHub Actions auto-deploys on PR', 'az webapp deploy --resource-group rg-dev \\', '  --name myapp-dev --src-path ./dist', '# Preview URL: https://jolly-wave-abc123.1.azurestaticapps.net'],
    devops_tip: 'Preview URLs on every PR are a game-changer. QA and stakeholders can review real deployments without any extra effort.',
  },
  {
    number: '05',
    phase: 'Approval Gate',
    color: '#FF8C00',
    icon: '🔐',
    azure_tools: ['GitHub Environments', 'Azure Pipelines Environments', 'Required reviewers', 'Azure DevOps approvals'],
    what_happens: 'Promoting to production requires a manual approval from a designated reviewer. This creates an audit trail and ensures a human reviews the changes before they reach real users.',
    commands: ['# Configure in GitHub:', 'Settings → Environments → production', '→ Required reviewers: [DevOps Lead]', '# Pipeline pauses here and sends notification'],
    devops_tip: 'Pair approval gates with change management policies. In regulated industries, this is often a compliance requirement.',
  },
  {
    number: '06',
    phase: 'Deploy to Production',
    color: '#D13438',
    icon: '🚀',
    azure_tools: ['Azure Static Web Apps', 'AKS rolling update', 'App Service deployment slots', 'Azure Traffic Manager'],
    what_happens: 'The approved build artifact (pinned by git SHA) is deployed to production. For zero-downtime, App Service uses deployment slots (blue/green). AKS uses rolling updates with health checks.',
    commands: ['# Swap staging slot to production:', 'az webapp deployment slot swap \\', '  --name myapp --slot staging', '  --target-slot production'],
    devops_tip: 'Always deploy the same artifact that was tested in CI. Never rebuild for production — re-use the image tagged with the git SHA.',
  },
  {
    number: '07',
    phase: 'Monitor & Observe',
    color: '#00BCF2',
    icon: '📊',
    azure_tools: ['Application Insights', 'Azure Monitor', 'Log Analytics (KQL)', 'Azure Alerts + Action Groups'],
    what_happens: 'After deployment, Application Insights tracks requests, performance, and errors in real-time. Alerts notify the on-call engineer if error rate or latency spikes. KQL queries let you investigate issues fast.',
    commands: ['// KQL in Log Analytics:', 'exceptions', '| where timestamp > ago(30m)', '| where cloud_RoleName == "myapp"', '| summarize count() by type'],
    devops_tip: 'Set up availability tests (ping tests) in App Insights. You\'ll know about downtime before your users do.',
  },
]

export default function JourneyView() {
  const [expanded, setExpanded] = useState(0)

  return (
    <div className="journey-root">
      <h2 className="section-title">From Code to Production on Azure</h2>
      <p className="journey-intro">
        A complete walkthrough of the modern DevOps lifecycle — every step from a developer's laptop to a running production service on Azure.
      </p>

      <div className="journey-steps">
        {STEPS.map((step, i) => {
          const isOpen = expanded === i
          return (
            <div key={i} className={`journey-card ${isOpen ? 'open' : ''}`} style={{ '--color': step.color }}>
              <button className="journey-card-header" onClick={() => setExpanded(isOpen ? -1 : i)}>
                <div className="journey-num" style={{ background: step.color }}>
                  {step.number}
                </div>
                <span className="journey-icon">{step.icon}</span>
                <span className="journey-phase">{step.phase}</span>
                <div className="journey-tools-preview">
                  {step.azure_tools.slice(0, 2).map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                  {step.azure_tools.length > 2 && (
                    <span className="tag tag-more">+{step.azure_tools.length - 2}</span>
                  )}
                </div>
                <span className="journey-chevron">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="journey-card-body">
                  <div className="journey-cols">
                    <div className="journey-col">
                      <h4>What Happens</h4>
                      <p>{step.what_happens}</p>

                      <h4 style={{ marginTop: '16px' }}>Azure Tools</h4>
                      <ul className="tools-list">
                        {step.azure_tools.map(t => <li key={t}>{t}</li>)}
                      </ul>
                    </div>

                    <div className="journey-col">
                      <h4>Commands / Config</h4>
                      <div className="cmd-block">
                        {step.commands.map((cmd, ci) => (
                          <div key={ci} className={`cmd-line ${cmd.startsWith('#') || cmd.startsWith('//') ? 'comment' : ''}`}>
                            {cmd}
                          </div>
                        ))}
                      </div>

                      <div className="devops-tip">
                        <span className="tip-label">DevOps Tip</span>
                        <p>{step.devops_tip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {i < STEPS.length - 1 && <div className="journey-connector" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
