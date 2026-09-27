import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useJourneyStore } from '../store/journeyStore'
import { PageTitle, Badge, Button, Loading } from '../components/ui'

export default function Sources() {
  const { journey } = useJourneyStore()

  if (!journey) return <Loading />

  const sources = [
    journey.source,
    {
      title: 'Official Maharashtra Industry portal',
      url: 'https://industry.maharashtra.gov.in/',
      department: 'Government of Maharashtra',
      verification_status: 'External source to verify',
      last_verified: 'Not stored in prototype'
    }
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="page-transition">
      <PageTitle 
        eyebrow="SOURCES & VERIFICATION" 
        title="Know what supports each result"
      >
        <p>D.W.A.R separates representative demo knowledge from information that must be verified on official authority portals.</p>
      </PageTitle>

      <section className="source-stack">
        {sources.map((source, index) => (
          <motion.article 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="source-card" 
            key={`${source.title}-${index}`}
          >
            <div className="source-number">0{index + 1}</div>
            <div>
              <Badge tone={index === 0 ? 'warning' : 'good'}>{source.verification_status}</Badge>
              <h2>{source.title}</h2>
              <p>{source.department}</p>
              <dl>
                <div>
                  <dt>Last verified</dt>
                  <dd>{source.last_verified}</dd>
                </div>
                <div>
                  <dt>Usage in D.W.A.R</dt>
                  <dd>{index === 0 ? 'Representative approval journey and timeline' : 'Official source handoff for user verification'}</dd>
                </div>
              </dl>
            </div>
            <div className="source-actions">
              <a className="button secondary" href={source.url} target="_blank" rel="noreferrer">
                <ExternalLink size={15}/> Open source
              </a>
              <Button kind="ghost">Copy details</Button>
            </div>
          </motion.article>
        ))}
      </section>
    </motion.div>
  )
}
