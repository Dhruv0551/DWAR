import { useState } from 'react'
import { motion } from 'framer-motion'
import { Landmark, ExternalLink, Check, Plus, CircleAlert } from 'lucide-react'
import { useJourneyStore } from '../store/journeyStore'
import { PageTitle, Badge, Button, Loading } from '../components/ui'

export default function Incentives() {
  const { journey } = useJourneyStore()
  const [saved, setSaved] = useState<string[]>([])

  if (!journey) return <Loading />

  const schemes = [
    ['Maharashtra industrial support discovery', `Potentially relevant support pathways for ${journey.project.sector} projects.`],
    ['MIDC facilitation guidance', 'Site and infrastructure facilitation may be relevant for an MIDC project.'],
    ['Investment-led support review', 'Use your project investment and verified eligibility factors to identify current programmes.']
  ]

  const save = (name: string) => {
    setSaved(s => s.includes(name) ? s.filter(x => x !== name) : [...s, name])
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="page-transition">
      <PageTitle 
        eyebrow="INCENTIVES" 
        title="Potential support pathways"
      >
        <p>Discovery is tailored to your project facts. It is never a benefit guarantee.</p>
      </PageTitle>

      <section className="scheme-grid">
        {schemes.map(([name, text], i) => (
          <motion.article 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="scheme-card" 
            key={name}
          >
            <div className="scheme-top">
              <span className="scheme-icon"><Landmark size={19}/></span>
              <Badge tone="good">POTENTIALLY RELEVANT</Badge>
            </div>
            <h2>{name}</h2>
            <p>{text}</p>
            <div className="scheme-footer">
              <a href="https://industry.maharashtra.gov.in/" target="_blank" rel="noreferrer">
                <ExternalLink size={14}/> Source
              </a>
              <Button kind={saved.includes(name) ? 'secondary' : 'ghost'} onClick={() => save(name)}>
                {saved.includes(name) ? <><Check size={14}/> Saved</> : <><Plus size={14}/> Shortlist</>}
              </Button>
            </div>
            {i === 0 && <small>Matched on sector and project type</small>}
          </motion.article>
        ))}
      </section>

      <section className="notice" style={{ marginTop: '20px' }}>
        <CircleAlert size={18}/>
        <span>Eligibility, benefit value and process must be confirmed against current official programme information.</span>
      </section>
    </motion.div>
  )
}
