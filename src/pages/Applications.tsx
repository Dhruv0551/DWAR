import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, CheckCircle2, CircleAlert, Eye } from 'lucide-react'
import { useJourneyStore } from '../store/journeyStore'
import { PageTitle, Badge, Button, Loading, Modal } from '../components/ui'

export default function Applications() {
  const { journey } = useJourneyStore()
  const [validated, setValidated] = useState(false)
  const [saved, setSaved] = useState(false)
  const [preview, setPreview] = useState(false)

  if (!journey) return <Loading />

  const missing = journey.documents.filter(d => d.status === 'Missing').length
  const readiness = Math.max(0, 100 - Math.round((missing / Math.max(journey.documents.length, 1)) * 100))
  
  const sections = [
    ['Applicant details', 'Complete', true],
    ['Project details', 'Complete', true],
    ['Land details', journey.project.land_status, false],
    ['Documents', missing ? `${missing} items need attention` : 'Complete', !missing],
    ['Declaration', 'Ready when you are', false]
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="page-transition">
      <PageTitle 
        eyebrow="APPLICATION PREPARATION" 
        title="Factory Licence workspace" 
        action={<Badge tone={validated ? 'good' : 'warning'}>{validated ? 'VALIDATED' : 'DRAFT'}</Badge>}
      >
        <p>Prototype Application Preview — not an official government form or submission.</p>
      </PageTitle>

      <div className="application-grid">
        <section className="panel app-steps">
          <div className="panel-head">
            <div>
              <span className="panel-kicker">PREPARATION CHECKLIST</span>
              <h2>Complete the essentials</h2>
            </div>
            {saved && <Badge tone="good">SAVED</Badge>}
          </div>
          
          {sections.map(([name, state, done], index) => (
            <div className="app-step" key={name as string}>
              <span className={done ? 'done' : ''}>{done ? <Check size={14}/> : index + 1}</span>
              <div>
                <b>{name as string}</b>
                <small>{state as string}</small>
              </div>
              {done && <CheckCircle2 size={17}/>}
            </div>
          ))}
          
          <div className="form-actions">
            <Button kind="secondary" onClick={() => setSaved(true)}>Save draft</Button>
            <Button kind="ghost" onClick={() => setPreview(true)}><Eye size={16}/> Preview</Button>
            <Button onClick={() => setValidated(true)}>Validate application</Button>
          </div>
        </section>

        <section className="readiness-card">
          <span>APPLICATION READINESS</span>
          <strong>{readiness}%</strong>
          <div className="radial" style={{ '--readiness': `${readiness * 3.6}deg` } as React.CSSProperties}>
            <div>
              <b>{readiness}%</b>
              <small>ready</small>
            </div>
          </div>
          <p>Calculated from current profile and required document status.</p>
          
          {validated && (
            <div className="validation-list">
              <p><CheckCircle2/> Applicant details complete</p>
              <p><CheckCircle2/> Project details complete</p>
              <p className={missing ? 'warn' : ''}>
                {missing ? <CircleAlert/> : <CheckCircle2/>} 
                {missing ? 'Some required records are still missing' : 'All current records are present'}
              </p>
            </div>
          )}
        </section>
      </div>

      {preview && (
        <Modal title="Prototype application preview" onClose={() => setPreview(false)}>
          <div className="preview-paper">
            <Badge>NOT AN OFFICIAL FORM</Badge>
            <h2>Factory Licence preparation summary</h2>
            <p><b>Project:</b> {journey.project.name}</p>
            <p><b>Location:</b> {journey.project.location}, Maharashtra</p>
            <p><b>Readiness:</b> {readiness}%</p>
            <p>This preview is for preparation only. Use the relevant official authority’s portal for a real submission.</p>
          </div>
          <Button onClick={() => setPreview(false)}>Close preview</Button>
        </Modal>
      )}
    </motion.div>
  )
}
