import { create } from 'zustand'
import type { Journey, Doc } from '../lib/types'
import api from '../lib/api'

// ── Local fallback data ──
const localSource = {
  title: 'D.W.A.R representative prototype knowledge dataset',
  url: 'https://industry.maharashtra.gov.in/',
  department: 'Demo dataset — verify with authority',
  verification_status: 'Prototype / representative',
  last_verified: '2026-09-22',
}

const localJourney: Journey = {
  project: {
    name: 'Pune food processing unit',
    sector: 'Food Processing',
    project_type: 'New Manufacturing Unit',
    location: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    investment_amount: 200000000,
    employee_count: 150,
    is_midc: true,
    land_status: 'MIDC area',
    environmental_category: 'To be confirmed',
  },
  approvals: [
    { id: 'land', name: 'Land / Site Readiness', department: 'Project owner / MIDC', status: 'Ready to Start', days: 14, dependencies: [], documents: ['Land document', 'Site layout'], rationale: 'Site information informs downstream planning.', source: localSource, confidence: 'Representative demo guidance' },
    { id: 'building', name: 'Building Plan Approval', department: 'Local planning authority', status: 'Not Started', days: 21, dependencies: ['land'], documents: ['Building plan', 'Land document', 'Project details'], rationale: 'Building plan is a dependency for later safety steps.', source: localSource, confidence: 'Representative demo guidance' },
    { id: 'pollution', name: 'Consent to Establish', department: 'Maharashtra Pollution Control Board', status: 'Not Started', days: 30, dependencies: ['land'], documents: ['Project report', 'Environmental report', 'Site layout'], rationale: 'Likely relevant; verify applicability.', source: localSource, confidence: 'Representative demo guidance' },
    { id: 'fire', name: 'Fire NOC', department: 'Fire department', status: 'Waiting for Dependency', days: 20, dependencies: ['building'], documents: ['Building plan', 'Fire safety plan'], rationale: 'Safety review may follow the building plan.', source: localSource, confidence: 'Representative demo guidance' },
    { id: 'factory', name: 'Factory Licence', department: 'Directorate of Industrial Safety & Health', status: 'Waiting for Dependency', days: 30, dependencies: ['fire'], documents: ['PAN', 'Building plan', 'Worker details'], rationale: 'Operational licence depends on site and safety readiness.', source: localSource, confidence: 'Representative demo guidance' },
  ],
  documents: [],
  critical_path: { steps: ['Land / Site Readiness', 'Building Plan Approval', 'Fire NOC', 'Factory Licence'], days: 72, label: 'Prototype estimate — verify with the relevant authority.' },
  next_best_action: { title: 'Prepare Building Plan Approval', why: 'This unlocks downstream work in the representative journey.', documents: ['Building plan', 'Land document', 'Project details'] },
  source: localSource,
}

// Generate documents from approvals
localJourney.documents = [...new Set(localJourney.approvals.flatMap((a) => a.documents))].map((name) => ({
  name,
  status: name === 'PAN' ? 'Available' : name === 'Land document' ? 'Verified' : 'Missing',
  reusable: name === 'PAN' || name === 'Land document',
}))

// ── Local AI fallback ──
export function localAnalyze(text: string, current?: Journey['project']) {
  const lower = text.toLowerCase()
  const profile = { ...localJourney.project, ...current }

  if (lower.includes('textile')) {
    profile.sector = 'Textile Manufacturing'
    profile.location = lower.includes('nagpur') ? 'Nagpur' : profile.location
    profile.project_type = 'Expansion'
  }
  if (lower.includes('ev') || lower.includes('component')) {
    profile.sector = 'EV Component Manufacturing'
    profile.location = lower.includes('sambhajinagar') ? 'Chhatrapati Sambhajinagar' : profile.location
  }

  return {
    reply: `I understand: Sector: ${profile.sector} · Project: ${profile.project_type} · Location: ${profile.location}. Your project profile is ready. I can now build a representative approval journey.`,
    journey: { ...localJourney, project: profile },
  }
}

// ── Journey Store ──
interface JourneyState {
  journey: Journey | null
  isLoading: boolean
  error: string | null

  fetchJourney: (projectId?: number) => Promise<void>
  setJourney: (journey: Journey) => void
  updateDocuments: (documents: Doc[]) => void
  reset: () => void
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  journey: null,
  isLoading: false,
  error: null,

  fetchJourney: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      const url = projectId ? `/projects/${projectId}/journey/` : '/demo/journey/'
      const { data } = await api.get<Journey>(url)
      set({ journey: data })
    } catch {
      // Fallback to local demo data
      set({ journey: localJourney })
    } finally {
      set({ isLoading: false })
    }
  },

  setJourney: (journey) => set({ journey }),

  updateDocuments: (documents) => {
    const current = get().journey
    if (current) {
      set({ journey: { ...current, documents } })
    }
  },

  reset: () => set({ journey: null, isLoading: false, error: null }),
}))
