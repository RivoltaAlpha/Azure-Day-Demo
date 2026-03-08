import { useState } from 'react'
import './ServicesGrid.css'

const CATEGORIES = [
  {
    name: 'Compute',
    color: '#0078D4',
    icon: '⚙️',
    services: [
      { name: 'Virtual Machines', tier: 'IaaS', desc: 'Full control over Windows/Linux VMs. Lift-and-shift workloads.' },
      { name: 'App Service', tier: 'PaaS', desc: 'Managed web app hosting. Deploy code or containers. Auto-scale built-in.' },
      { name: 'Azure Kubernetes Service', tier: 'PaaS', desc: 'Managed Kubernetes. Run containerized workloads at scale.' },
      { name: 'Azure Functions', tier: 'Serverless', desc: 'Event-driven serverless compute. Pay only per execution.' },
      { name: 'Container Apps', tier: 'Serverless', desc: 'Serverless containers built on Kubernetes + KEDA. Scale to zero.' },
    ],
  },
  {
    name: 'Storage & Data',
    color: '#00BCF2',
    icon: '🗄️',
    services: [
      { name: 'Blob Storage', tier: 'Storage', desc: 'Object storage for unstructured data, backups, media files.' },
      { name: 'Azure SQL', tier: 'PaaS', desc: 'Fully managed SQL Server. Built-in HA, backups, and tuning.' },
      { name: 'Cosmos DB', tier: 'PaaS', desc: 'Globally distributed NoSQL. Multi-model: JSON, graph, table.' },
      { name: 'Azure Files', tier: 'Storage', desc: 'Managed file shares over SMB/NFS. Mount in VMs or containers.' },
      { name: 'Data Lake', tier: 'Storage', desc: 'Petabyte-scale analytics storage. Hierarchical namespace.' },
    ],
  },
  {
    name: 'Networking',
    color: '#002050',
    icon: '🌐',
    services: [
      { name: 'Virtual Network (VNet)', tier: 'IaaS', desc: 'Isolated network in Azure. Subnets, NSGs, peering, VPN.' },
      { name: 'Azure CDN', tier: 'PaaS', desc: 'Global content delivery. Cache static assets close to users.' },
      { name: 'API Management', tier: 'PaaS', desc: 'Publish, secure, and monitor APIs. Rate limiting, auth, analytics.' },
      { name: 'Load Balancer', tier: 'IaaS', desc: 'L4 load balancing for VM and container workloads.' },
      { name: 'Azure DNS', tier: 'PaaS', desc: 'Host DNS domains in Azure. Ultra-low latency resolution.' },
    ],
  },
  {
    name: 'DevOps & Deploy',
    color: '#68217A',
    icon: '🚀',
    services: [
      { name: 'Azure Pipelines', tier: 'DevOps', desc: 'YAML-based CI/CD. Build, test, deploy to any cloud or on-prem.' },
      { name: 'Azure Repos', tier: 'DevOps', desc: 'Unlimited private Git repos with branch policies and PR reviews.' },
      { name: 'Container Registry', tier: 'DevOps', desc: 'Private Docker registry. Geo-replicated. Vulnerability scanning.' },
      { name: 'Static Web Apps', tier: 'PaaS', desc: 'Deploy React/Vue/Angular + API in one service. Free tier available.' },
      { name: 'Azure Artifacts', tier: 'DevOps', desc: 'Package feeds for npm, NuGet, Maven. Upstream sources.' },
    ],
  },
  {
    name: 'Security & Identity',
    color: '#D13438',
    icon: '🔐',
    services: [
      { name: 'Microsoft Entra ID', tier: 'Identity', desc: 'Cloud identity platform. SSO, MFA, conditional access, B2B/B2C.' },
      { name: 'Key Vault', tier: 'Security', desc: 'Manage secrets, keys, and certificates. FIPS 140-2 Level 2 HSM.' },
      { name: 'Microsoft Defender', tier: 'Security', desc: 'Threat protection for workloads. Security posture management.' },
      { name: 'Azure Policy', tier: 'Governance', desc: 'Enforce standards. Audit, deny, or auto-remediate non-compliant resources.' },
      { name: 'Azure Sentinel', tier: 'Security', desc: 'Cloud-native SIEM + SOAR. AI-powered threat detection.' },
    ],
  },
  {
    name: 'Monitor & Observe',
    color: '#FF8C00',
    icon: '📊',
    services: [
      { name: 'Azure Monitor', tier: 'Observability', desc: 'Central platform for metrics, logs, and alerts from all Azure resources.' },
      { name: 'Application Insights', tier: 'APM', desc: 'Full APM. Requests, dependencies, exceptions, performance, usage.' },
      { name: 'Log Analytics', tier: 'Observability', desc: 'Query logs with KQL. Centralized workspace for all your log data.' },
      { name: 'Azure Dashboards', tier: 'Observability', desc: 'Build and share real-time dashboards. Pin any metric or query.' },
      { name: 'Action Groups', tier: 'Alerting', desc: 'Automated responses to alerts — email, SMS, webhook, or runbook.' },
    ],
  },
]

const TIER_COLORS = {
  IaaS: '#002050',
  PaaS: '#0078D4',
  Serverless: '#00BCF2',
  Storage: '#68217A',
  DevOps: '#00B74A',
  Security: '#D13438',
  Identity: '#D13438',
  Governance: '#68217A',
  Observability: '#FF8C00',
  APM: '#FF8C00',
  Alerting: '#FF8C00',
}

export default function ServicesGrid() {
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = CATEGORIES.map(cat => ({
    ...cat,
    services: cat.services.filter(s =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase()) ||
      s.tier.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.services.length > 0)

  return (
    <div className="services-root">
      <div className="services-toolbar">
        <h2 className="section-title">Azure Services</h2>
        <input
          className="search-input"
          type="search"
          placeholder="Search services..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.map(cat => (
        <div key={cat.name} className="category-section">
          <div className="category-header" style={{ borderLeftColor: cat.color }}>
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-name">{cat.name}</span>
            <span className="cat-count">{cat.services.length} services</span>
          </div>
          <div className="services-grid">
            {cat.services.map(svc => (
              <button
                key={svc.name}
                className={`service-card ${selected?.name === svc.name ? 'selected' : ''}`}
                onClick={() => setSelected(selected?.name === svc.name ? null : svc)}
                style={{ '--accent': cat.color }}
              >
                <div className="svc-name">{svc.name}</div>
                <span
                  className="svc-tier"
                  style={{ background: TIER_COLORS[svc.tier] + '22', color: TIER_COLORS[svc.tier] }}
                >
                  {svc.tier}
                </span>
                {selected?.name === svc.name && (
                  <p className="svc-desc">{svc.desc}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="no-results">No services match "{search}"</p>
      )}
    </div>
  )
}
