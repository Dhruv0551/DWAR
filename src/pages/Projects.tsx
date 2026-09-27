import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, MapPin, Sparkles, Check, X, Plus, Bot, ArrowRight } from 'lucide-react'
import { useJourneyStore } from '../store/journeyStore'
import { useAuthStore } from '../store/authStore'
import { PageTitle, Badge, Button, money, Loading } from '../components/ui'

export default function Projects() {
  const { journey, setJourney } = useJourneyStore()
  const { profile } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(journey?.project.name || '')
  const [location, setLocation] = useState(journey?.project.location || '')
  const [sector, setSector] = useState(journey?.project.sector || '')
  
  if (!journey) return <Loading />

  const save = () => {
    setJourney({
      ...journey,
      project: {
        ...journey.project,
        name: name || journey.project.name,
        location: location || journey.project.location,
        district: location || journey.project.district,
        sector: sector || journey.project.sector
      }
    })
    setEditing(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="page-transition">
      <PageTitle 
        eyebrow="PROJECTS" 
        title="Your project profile" 
        action={
          <Button onClick={() => setEditing(v => !v)}>
            {editing ? 'Cancel' : 'Edit project'} {editing ? <X size={16}/> : <Plus size={16}/>}
          </Button>
        }
      >
        <p>This structured profile is the source of truth for D.W.A.R guidance.</p>
      </PageTitle>

      {editing ? (
        <section className="panel project-form">
          <div className="field">
            <label>Project name</label>
            <input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>Sector</label>
            <select value={sector} onChange={e => setSector(e.target.value)}>
              <option>Food Processing</option>
              <option>EV Component Manufacturing</option>
              <option>Textile Manufacturing</option>
              <option>Manufacturing</option>
            </select>
          </div>
          <div className="field">
            <label>District / location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <div className="form-foot">
            <Button kind="secondary" onClick={() => setEditing(false)}>Discard</Button>
            <Button onClick={save}><Check size={16}/> Save project</Button>
          </div>
        </section>
      ) : (
        <>
          <section className="profile-hero">
            <div className="project-monogram"><Building2 size={25}/></div>
            <div>
              <Badge tone="good">ACTIVE PROJECT</Badge>
              <h2>{journey.project.name}</h2>
              <p><MapPin size={15}/> {journey.project.location}, {journey.project.state} · {journey.project.is_midc ? 'MIDC area' : 'Site status to be confirmed'}</p>
            </div>
            <div className="button secondary" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={16}/> Ask AI Assistant
            </div>
          </section>

          <section className="profile-grid" style={{ marginTop: '16px' }}>
            {[
              ['Sector', journey.project.sector],
              ['Project type', journey.project.project_type],
              ['Investment', money(journey.project.investment_amount)],
              ['Employment', `${journey.project.employee_count} people`],
              ['Land status', journey.project.land_status],
              ['Environmental category', journey.project.environmental_category]
            ].map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <b>{value as string}</b>
              </article>
            ))}
          </section>

          <section className="panel profile-callout" style={{ marginTop: '16px' }}>
            <Sparkles/>
            <div>
              <h3>Want to sharpen this journey?</h3>
              <p>Ask the AI Assistant to refine your profile details and recalculate paths.</p>
            </div>
          </section>
        </>
      )}
    </motion.div>
  )
}
