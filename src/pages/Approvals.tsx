import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, ChevronDown, CircleAlert, Sparkles, FileSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useJourneyStore } from '../store/journeyStore'
import { PageTitle, Badge, Button, Loading, statusClass } from '../components/ui'

export default function Approvals() {
  const { journey } = useJourneyStore()
  const [open, setOpen] = useState<string | null>('building')

  if (!journey) return <Loading />

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="page-transition">
      <PageTitle 
        eyebrow="APPROVALS" 
        title="Your approval journey" 
        action={<Link to="/app/sources" className="button secondary"><FileSearch size={16}/> View sources</Link>}
      >
        <p>Requirements are selected by deterministic representative rules, with source context shown for every record.</p>
      </PageTitle>

      <section className="journey-map">
        <div className="map-origin">
          <Sparkles size={16}/>
          <span>PROJECT PROFILE</span>
          <b>{journey.project.name}</b>
        </div>
        <div className="map-line"/>
        {journey.approvals.map((a, index) => (
          <div className="map-stage" key={a.id}>
            <span className={`map-dot ${statusClass(a.status)}`}/>
            <small>0{index + 1}</small>
            <b>{a.name}</b>
          </div>
        ))}
      </section>

      <section className="approval-list">
        {journey.approvals.map((approval, index) => {
          const expanded = open === approval.id
          return (
            <motion.article 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`approval-card ${expanded ? 'expanded' : ''}`} 
              key={approval.id}
            >
              <button className="approval-summary" onClick={() => setOpen(expanded ? null : approval.id)}>
                <div className="approval-number">0{index + 1}</div>
                <div>
                  <Badge tone={statusClass(approval.status)}>{approval.status}</Badge>
                  <h2>{approval.name}</h2>
                  <p>{approval.department} · Prototype estimate: {approval.days} days</p>
                </div>
                <ChevronDown className={expanded ? 'flip' : ''}/>
              </button>
              {expanded && (
                <div className="approval-detail">
                  <div>
                    <span>WHY IT MAY APPLY</span>
                    <p>{approval.rationale}</p>
                  </div>
                  <div>
                    <span>REQUIRED TO PREPARE</span>
                    <div className="chips">
                      {approval.documents.map(doc => <i key={doc}>{doc}</i>)}
                    </div>
                  </div>
                  <div>
                    <span>DEPENDENCIES</span>
                    <p>
                      {approval.dependencies.length 
                        ? approval.dependencies.map(x => journey.approvals.find(a => a.id === x)?.name).join(', ') 
                        : 'No representative upstream dependency.'}
                    </p>
                  </div>
                  <div className="detail-actions">
                    <a href={approval.source.url} target="_blank" rel="noreferrer">
                      <ExternalLink size={15}/> Source & verification
                    </a>
                    <Button kind="secondary">Focus this step</Button>
                  </div>
                </div>
              )}
            </motion.article>
          )
        })}
      </section>

      <section className="notice">
        <CircleAlert size={18}/>
        <span><b>Representative prototype data:</b> D.W.A.R does not determine legal applicability or guarantee approval. Verify each item with the relevant authority.</span>
      </section>
    </motion.div>
  )
}
