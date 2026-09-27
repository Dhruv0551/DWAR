import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'
import { UserPlus, Bot, Network, CheckCircle2, FileText, BarChart3, Landmark, ShieldCheck, Sparkles, Menu, X } from 'lucide-react'

export default function Landing() {
  const { user } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const steps = [
    { num: '01', title: 'Register & Define', desc: 'Create your profile, define your business sector, investment scale, and location.', icon: UserPlus },
    { num: '02', title: 'AI-Powered Analysis', desc: 'Describe your project in natural language. Our AI extracts the facts that matter for your approval journey.', icon: Bot },
    { num: '03', title: 'Smart Journey Map', desc: 'Get a personalized roadmap: approvals, dependencies, timelines, required documents, and critical path.', icon: Network },
    { num: '04', title: 'Track & Execute', desc: 'Upload documents, track progress, discover incentives, and move through approvals with confidence.', icon: CheckCircle2 },
  ]

  const features = [
    { title: 'Approval Journey Mapping', desc: 'See every required approval, its dependencies, and the critical path through your regulatory landscape.', icon: Network },
    { title: 'Document Intelligence', desc: 'Know exactly which documents you need, track their status, and reuse them across applications.', icon: FileText },
    { title: 'AI Assistant', desc: 'Get instant guidance on approvals, compliance, and regulations specific to your project.', icon: Bot },
    { title: 'Progress Tracking', desc: 'Visual dashboards showing your journey completion, readiness scores, and next actions.', icon: BarChart3 },
    { title: 'Incentive Discovery', desc: 'Automatically surface government schemes, subsidies, and support pathways you may be eligible for.', icon: Landmark },
    { title: 'Source Transparency', desc: 'Every recommendation is backed by verifiable sources. No black-box guidance.', icon: ShieldCheck },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-navy text-white flex items-center justify-center font-serif font-bold text-lg">D</div>
            <div>
              <div className="font-bold text-navy tracking-tight leading-none">D.W.A.R</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider hidden sm:block">Digital Window for Approval & Registration</div>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#workflow" className="hover:text-teal transition-colors">How it Works</a>
            <a href="#features" className="hover:text-teal transition-colors">Features</a>
            <a href="#trust" className="hover:text-teal transition-colors">Trust & Sources</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link to="/app/dashboard" className="px-4 py-2 bg-teal hover:bg-teal-700 text-white rounded-md text-sm font-medium transition-colors">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-navy px-2">Sign In</Link>
                <Link to="/register" className="px-4 py-2 bg-navy hover:bg-navy/90 text-white rounded-md text-sm font-medium transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 flex flex-col gap-4">
            <a href="#workflow" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
            <a href="#features" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#trust" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Trust & Sources</a>
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
              {user ? (
                <Link to="/app/dashboard" className="w-full text-center px-4 py-2 bg-teal text-white rounded-md text-sm font-medium">Go to Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="w-full text-center px-4 py-2 border border-slate-200 rounded-md text-sm font-medium">Sign In</Link>
                  <Link to="/register" className="w-full text-center px-4 py-2 bg-navy text-white rounded-md text-sm font-medium">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-[#f8fafc] to-[#edf5f3]">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            className="lg:col-span-7 z-10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/10 text-teal-800 text-xs font-semibold uppercase tracking-wide mb-6">
              <Sparkles size={14} className="text-teal" />
              SIH 2026 · Smart Automation
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-navy leading-tight mb-6 tracking-tight">
              From fragmented approvals <br />
              <span className="text-teal font-serif font-normal italic">to a guided journey.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              D.W.A.R converts the complex maze of industrial approvals, registrations, and compliance into a personalized, intelligent journey for Maharashtra.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/register" className="px-6 py-3 bg-teal hover:bg-teal-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-teal/30 hover:shadow-teal/40">
                Get Started Free
              </Link>
              <a href="#workflow" className="px-6 py-3 bg-white hover:bg-slate-50 text-navy border border-slate-200 rounded-lg font-medium transition-colors">
                See How It Works
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              *Prototype developed for Smart India Hackathon 2026.
            </p>
          </motion.div>

          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 relative z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                  <CheckCircle2 className="text-teal" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-navy text-sm">Journey Generated</div>
                  <div className="text-xs text-slate-500">Textile Manufacturing · Nagpur</div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Land / Site Readiness', status: 'Ready', color: 'bg-teal' },
                  { name: 'Building Plan Approval', status: 'Pending', color: 'bg-gold' },
                  { name: 'Fire NOC', status: 'Locked', color: 'bg-slate-300' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{item.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="text-xs text-slate-500">Critical Path</div>
                <div className="text-sm font-bold text-navy">45 Days</div>
              </div>
            </motion.div>
            
            {/* Decorative background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-teal/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/20 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-sm font-bold text-teal tracking-widest uppercase mb-2">From Approval Portal to Approval Intelligence</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">How D.W.A.R Works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-slate-100 -z-10"></div>
            
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                className="relative bg-white pt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-16 h-16 mx-auto bg-white border-4 border-slate-50 rounded-full shadow-sm flex items-center justify-center text-teal mb-6">
                  <step.icon size={24} />
                </div>
                <div className="text-center">
                  <div className="font-mono text-xs text-slate-400 font-bold mb-2">STEP {step.num}</div>
                  <h4 className="text-lg font-bold text-navy mb-3">{step.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-sm font-bold text-teal tracking-widest uppercase mb-2">Intelligent Approval Orchestration</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">Everything you need</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div 
                key={i}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal mb-5 group-hover:bg-teal group-hover:text-white transition-colors">
                  <feat.icon size={20} />
                </div>
                <h4 className="text-lg font-bold text-navy mb-2">{feat.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Sources */}
      <section id="trust" className="py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-3 py-1 rounded bg-white/10 text-xs font-bold tracking-wider uppercase mb-6">Source Transparent</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">Clear guidance,<br/>honest limits.</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              D.W.A.R is an intelligent orchestrator, but we don't replace the authority of government departments. Every recommendation, timeline, and document requirement is linked to its official source.
            </p>
            <p className="text-slate-300 text-sm italic">
              Note: This is a prototype developed for Smart India Hackathon. Data presented may be representative.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex md:justify-end"
          >
            <Link to="/app/sources" className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors">
              <ShieldCheck className="text-teal" />
              <span className="font-medium">View Prototype Data Sources</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-teal to-teal-700 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to start your approval journey?</h2>
          <p className="text-teal-50 text-lg mb-8">Join entrepreneurs who are navigating Maharashtra's industrial approvals intelligently.</p>
          {user ? (
            <Link to="/app/dashboard" className="inline-block px-8 py-4 bg-navy hover:bg-navy/90 text-white rounded-lg font-bold shadow-lg transition-all">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="inline-block px-8 py-4 bg-navy hover:bg-navy/90 text-white rounded-lg font-bold shadow-lg transition-all">
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 items-center">
          <div>
            <div className="text-white font-bold text-lg mb-1 tracking-tight">D.W.A.R</div>
            <div>Smart India Hackathon 2026</div>
          </div>
          <div className="flex gap-6 md:justify-center">
            <a href="#workflow" className="hover:text-white transition-colors">How it works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <Link to="/app/sources" className="hover:text-white transition-colors">Sources</Link>
          </div>
          <div className="md:text-right">
            <div>Built by <span className="text-white font-medium">Missing Semi-Colon</span></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-xs text-center text-slate-500">
          Disclaimer: This application is a prototype built for SIH 2026. It is not an official government portal.
        </div>
      </footer>
    </div>
  )
}
