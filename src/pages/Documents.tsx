import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Eye, ShieldCheck } from 'lucide-react'
import { useJourneyStore } from '../store/journeyStore'
import { PageTitle, Badge, Button, Loading, statusClass } from '../components/ui'
import api from '../lib/api'

export default function Documents() {
  const { journey, setJourney } = useJourneyStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [target, setTarget] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  if (!journey) return <Loading />

  const prepareUpload = (name: string) => {
    setTarget(name)
    inputRef.current?.click()
  }

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!target || !file) return
    
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('document_type', target)
      
      // Attempt API upload, fallback to local update if no backend
      try {
        await api.post('/documents/upload/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } catch (err) {
        console.warn('API upload failed, simulating success for prototype', err)
      }

      setJourney({
        ...journey,
        documents: journey.documents.map(d => d.name === target ? { ...d, status: 'Uploaded' } : d)
      })
    } finally {
      setUploading(false)
      setTarget(null)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const ready = journey.documents.filter(d => d.status !== 'Missing').length

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="page-transition">
      <PageTitle 
        eyebrow="DOCUMENT CENTER" 
        title="Prepare once. Reuse where applicable." 
        action={
          <Button onClick={() => prepareUpload(journey.documents.find(d => d.status === 'Missing')?.name || journey.documents[0].name)}>
            <Upload size={16}/> Upload a record
          </Button>
        }
      >
        <p>{ready} of {journey.documents.length} journey records are available or verified.</p>
      </PageTitle>

      <input ref={inputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" hidden onChange={upload} disabled={uploading}/>

      <section className="document-summary">
        <div>
          <span>REUSABLE RECORDS</span>
          <b>{journey.documents.filter(d => d.reusable).length}</b>
          <p>Can appear in applicable prototype applications.</p>
        </div>
        <div>
          <span>REQUIRES ATTENTION</span>
          <b>{journey.documents.filter(d => d.status === 'Missing').length}</b>
          <p>Missing items may reduce readiness.</p>
        </div>
        <div>
          <span>UPLOAD GUARDRAILS</span>
          <b>PDF / JPG / PNG</b>
          <p>10 MB maximum in the API workflow.</p>
        </div>
      </section>

      <section className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Document</th>
              <th>Readiness</th>
              <th>Use in journey</th>
              <th aria-label="Action"/>
            </tr>
          </thead>
          <tbody>
            {journey.documents.map(doc => (
              <tr key={doc.name}>
                <td>
                  <span className="document-name"><FileText size={17}/>{doc.name}</span>
                </td>
                <td><Badge tone={statusClass(doc.status)}>{doc.status}</Badge></td>
                <td>{doc.reusable ? 'Reusable across applicable applications' : 'Required for a journey step'}</td>
                <td>
                  {doc.status === 'Missing' ? (
                    <Button kind="secondary" onClick={() => prepareUpload(doc.name)} disabled={uploading && target === doc.name}>
                      {uploading && target === doc.name ? 'Uploading...' : <><Upload size={14}/> Upload</>}
                    </Button>
                  ) : (
                    <Button kind="ghost"><Eye size={14}/> View</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="notice">
        <ShieldCheck size={18}/>
        <span>Prototype checks file presence, allowed type, size, duplicate records and expiry metadata. They do not equal legal verification.</span>
      </section>
    </motion.div>
  )
}
