import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PanelTop, Building2, ShieldCheck, FileText, ClipboardCheck, CalendarDays, Landmark, FileSearch, Network, Bell, Sun, Moon, Menu, X, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useJourneyStore } from '../../store/journeyStore'
import { AIChatWidget } from '../ai/AIChatWidget'
import Dashboard from '../../pages/Dashboard'
import Projects from '../../pages/Projects'
import Approvals from '../../pages/Approvals'
import Documents from '../../pages/Documents'
import Applications from '../../pages/Applications'
import Compliance from '../../pages/Compliance'
import Incentives from '../../pages/Incentives'
import Sources from '../../pages/Sources'
import Officer from '../../pages/Officer'
import api from '../../lib/api'

export default function Workspace() {
  const { profile, signOut } = useAuthStore()
  const { journey, setJourney } = useJourneyStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('dwar-theme') === 'dark')
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('dwar-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    if (!journey) {
      // Simulate fetch or use real endpoint if available
      api.get('/demo/journey/').then((r: { data: any }) => {
        setJourney(r.data)
      }).catch(() => {
        // Mock default if API fails
      })
    }
  }, [journey, setJourney])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = [
    { to: 'dashboard', label: 'Dashboard', Icon: PanelTop },
    { to: 'projects', label: 'Projects', Icon: Building2 },
    { to: 'approvals', label: 'Approvals', Icon: ShieldCheck },
    { to: 'documents', label: 'Documents', Icon: FileText },
    { to: 'applications', label: 'Applications', Icon: ClipboardCheck },
    { to: 'compliance', label: 'Compliance', Icon: CalendarDays },
    { to: 'incentives', label: 'Incentives', Icon: Landmark },
    { to: 'sources', label: 'Sources & Verification', Icon: FileSearch }
  ]

  if (profile?.role === 'officer' || profile?.role === 'admin') {
    navItems.push({ to: 'officer', label: 'Officer Dashboard', Icon: Network })
  }

  const initials = profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U'

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'shown' : ''}`}>
        <div className="side-brand">
          <span className="brandmark">D</span>
          <span>D.W.A.R<small>Approval Intelligence</small></span>
          <button className="icon-button mobile-close" onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>
        <div className="workspace-label">ENTREPRENEUR WORKSPACE</div>
        <nav>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink key={to} to={`/app/${to}`} onClick={() => setMenuOpen(false)}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <b>SIH 2026 Prototype</b>
          <span>Representative data · Verify with the authority</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="workspace-head">
          <div className="head-project">
            <button className="icon-button menu" onClick={() => setMenuOpen(true)}>
              <Menu />
            </button>
            <div>
              <span className="crumb">MAHARASHTRA · INDUSTRIAL SETUP</span>
              <h2>{journey?.project?.name || 'Your workspace'}</h2>
            </div>
          </div>
          
          <div className="head-actions">
            <button className="icon-button notification">
              <Bell size={18} />
              <i />
            </button>
            
            <button className="theme-toggle" onClick={() => setDark(v => !v)}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
              <span>{dark ? 'Light' : 'Dark'}</span>
            </button>
            
            <div className="profile-dropdown">
              <button className="profile-dot" onClick={() => setProfileOpen(v => !v)}>
                {initials}
              </button>
              {profileOpen && (
                <div className="profile-menu">
                  <div className="profile-menu-header">
                    <strong>{profile?.full_name || 'User'}</strong>
                    <p>{profile?.email}</p>
                  </div>
                  <button onClick={handleSignOut} className="danger">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="documents" element={<Documents />} />
              <Route path="applications" element={<Applications />} />
              <Route path="compliance" element={<Compliance />} />
              <Route path="incentives" element={<Incentives />} />
              <Route path="sources" element={<Sources />} />
              <Route path="officer" element={<Officer />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </section>

      <AIChatWidget />
    </div>
  )
}
