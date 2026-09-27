// ── Shared TypeScript interfaces for D.W.A.R ──

export interface Source {
  title: string
  url: string
  department: string
  verification_status: string
  last_verified: string
}

export interface Project {
  id?: number
  name: string
  sector: string
  project_type: string
  location: string
  district: string
  state: string
  investment_amount: number
  employee_count: number
  is_midc: boolean
  land_status: string
  environmental_category: string
  power_requirement?: string
  gstin?: string
  contact_phone?: string
  company_name?: string
  created_at?: string
  updated_at?: string
}

export interface Doc {
  id?: number
  name: string
  status: string
  reusable: boolean
  file_url?: string
  mime_type?: string
  file_size?: number
  uploaded_at?: string
}

export interface Approval {
  id: string
  name: string
  department: string
  status: string
  days: number
  dependencies: string[]
  documents: string[]
  rationale: string
  source: Source
  confidence: string
}

export interface Journey {
  project: Project
  approvals: Approval[]
  documents: Doc[]
  critical_path: {
    steps: string[]
    days: number
    label: string
  }
  next_best_action: {
    title: string
    why: string
    documents: string[]
  }
  source: Source
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'entrepreneur' | 'officer' | 'admin'
  is_onboarded: boolean
  company_name?: string
  gstin?: string
  contact_phone?: string
  created_at?: string
}

export interface OnboardingData {
  // Step 1 — Business Type
  sector: string
  // Step 2 — Location & Scale
  location: string
  district: string
  is_midc: boolean
  investment_amount: number
  employee_count: number
  // Step 3 — Project Details
  project_name: string
  project_type: string
  land_status: string
  environmental_category: string
  power_requirement: string
  // User details
  company_name: string
  gstin: string
  contact_phone: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  timestamp: Date
}

export type ToastKind = 'success' | 'info' | 'error' | 'warning'
