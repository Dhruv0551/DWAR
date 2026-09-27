import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock3 } from 'lucide-react'
import { useJourneyStore } from '../store/journeyStore'
import { PageTitle, Button, Loading, Empty } from '../components/ui'

export default function Compliance() {
  const { journey } = useJourneyStore()
  const [filter, setFilter] = useState<'all' | 'attention'>('all')

  if (!journey) return <Loading />

  const items = [
    { date: 'Now', title: 'Prepare Building Plan', detail: 'This representative action unlocks later safety work.', tone: 'active' },
    { date: 'Next', title: 'Confirm environmental category', detail: 'Needed to refine consent guidance.', tone: 'attention' },
    { date: 'Then', title: 'Review Fire NOC requirements', detail: 'Waiting on building-plan preparation.', tone: 'waiting' },
    { date: 'Later', title: 'Factory Licence readiness check', detail: 'Operational milestone after upstream steps.', tone: 'waiting' }
  ]

  const shown = filter === 'all' ? items : items.filter(x => x.tone === 'attention')

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="page-transition">
      <PageTitle 
        eyebrow="COMPLIANCE" 
        title="Keep the journey moving" 
        action={
          <div className="segmented">
            <button className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>All actions</button>
            <button className={filter === 'attention' ? 'selected' : ''} onClick={() => setFilter('attention')}>Needs attention</button>
          </div>
        }
      >
        <p>A focused preparation timeline, based on your representative approval dependencies.</p>
      </PageTitle>

      <section className="compliance-layout">
        <div className="panel timeline">
          {shown.map((item, index) => (
            <article className="timeline-item" key={item.title}>
              <div>
                <span className={item.tone} />
                {index < shown.length - 1 && <i />}
              </div>
              <section>
                <small>{item.date.toUpperCase()}</small>
                <h2>{item.title}</h2>
                <p>{item.detail}</p>
                <Button kind="ghost">Add to focus <ArrowRight size={14}/></Button>
              </section>
            </article>
          ))}
          {!shown.length && <Empty title="Nothing needs immediate attention" body="Your current prototype timeline is clear." />}
        </div>

        <aside className="panel waiting-card">
          <Clock3 size={21} />
          <span>WHY AM I WAITING?</span>
          <h2>Fire NOC</h2>
          <p><b>Waiting for:</b> Building Plan Approval preparation</p>
          <div>
            <small>Representative expected SLA</small>
            <b>20 days</b>
          </div>
          <Button kind="secondary">View next step</Button>
        </aside>
      </section>
    </motion.div>
  )
}
