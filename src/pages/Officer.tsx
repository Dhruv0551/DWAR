import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuthStore } from '../store/authStore'
import { PageTitle, Badge, Button, Metric, Empty } from '../components/ui'

export default function Officer() {
  const { profile } = useAuthStore()

  if (profile?.role !== 'officer' && profile?.role !== 'admin') {
    return (
      <Empty 
        title="Access Denied" 
        body="This workspace is restricted to officers and administrators." 
      />
    )
  }

  const data = [
    { approval: 'Fire NOC', pending: 42, delay: 8, risk: 'High' },
    { approval: 'Factory Licence', pending: 21, delay: 3, risk: 'Medium' },
    { approval: 'Pollution Consent', pending: 17, delay: 6, risk: 'High' }
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="page-transition">
      <PageTitle 
        eyebrow="OFFICER WORKSPACE" 
        title="Operational bottlenecks" 
        action={<Button kind="secondary"><Download size={15}/> Export snapshot</Button>}
      >
        <p>Representative seeded prototype data shown for the role-based operational view.</p>
      </PageTitle>

      <section className="metric-grid">
        <Metric value="86" label="Applications received" trend="Representative total" />
        <Metric value="42" label="Pending" trend="Across three stages" />
        <Metric value="17" label="At SLA risk" trend="Requires attention" />
        <Metric value="13" label="Inspections pending" trend="Prototype indicator" />
      </section>

      <div className="officer-grid">
        <section className="panel chart-panel">
          <div className="panel-head">
            <div>
              <span className="panel-kicker">WORKLOAD VIEW</span>
              <h2>Pending by stage</h2>
            </div>
            <Badge>LIVE DEMO</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <XAxis dataKey="approval" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="pending" fill="#168579" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel table-panel">
          <div className="panel-head">
            <div>
              <span className="panel-kicker">SLA WATCH</span>
              <h2>Approaching breach</h2>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Approval</th>
                <th>Pending</th>
                <th>Avg delay</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.approval}>
                  <td>{row.approval}</td>
                  <td>{row.pending}</td>
                  <td>{row.delay} days</td>
                  <td><Badge tone={row.risk.toLowerCase()}>{row.risk}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </motion.div>
  )
}
