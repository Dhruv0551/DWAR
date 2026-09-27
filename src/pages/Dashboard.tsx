import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useJourneyStore } from '../store/journeyStore'
import { ProgressTracker } from '../components/progress/ProgressTracker'
import { Metric, Loading, PageTitle, Badge } from '../components/ui'
import { Sparkles, FileText, ArrowRight, Activity, CalendarClock, ListChecks, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { statusClass } from '../components/ui'

export default function Dashboard() {
  const { profile } = useAuthStore()
  const { journey, fetchJourney, isLoading } = useJourneyStore()

  useEffect(() => {
    if (!journey) {
      fetchJourney()
    }
  }, [journey, fetchJourney])

  if (isLoading || !journey) {
    return <Loading />
  }

  const documentsReady = journey.documents.filter(d => d.status === 'Available' || d.status === 'Verified').length
  const documentsTotal = journey.documents.length
  const readinessPercent = documentsTotal > 0 ? Math.round((documentsReady / documentsTotal) * 100) : 0

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-1">Welcome back, {profile?.full_name || 'Entrepreneur'}</h1>
          <p className="text-slate-500">
            {journey.project.name} · {journey.project.location} · {journey.project.sector}
          </p>
        </div>
        <Link to="/app/journey" className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-700 bg-teal/5 px-4 py-2 rounded-lg transition-colors border border-teal/10">
          View Full Journey <ArrowRight size={16} />
        </Link>
      </motion.div>

      {/* Progress Tracker Component */}
      <motion.div variants={itemVariants}>
        <ProgressTracker journey={journey} />
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center text-teal shrink-0">
            <ListChecks size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-navy">{journey.approvals.length}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mt-1">Likely Approvals</div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-navy">{documentsReady} <span className="text-sm text-slate-400 font-normal">/ {documentsTotal}</span></div>
            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mt-1">Records Ready</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center text-navy shrink-0">
            <CalendarClock size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-navy">{journey.critical_path.days} <span className="text-sm text-slate-400 font-normal">days</span></div>
            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mt-1">Critical Journey</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center text-teal shrink-0">
            <Activity size={20} />
          </div>
          <div>
            <div className="text-2xl font-bold text-navy">{readinessPercent}%</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mt-1">Readiness Signal</div>
          </div>
        </div>
      </motion.div>

      {/* Next Best Action */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-teal-50 to-white p-6 rounded-xl border border-teal-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-teal text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-teal tracking-wider uppercase mb-1">Next Best Action</h3>
            <h2 className="text-xl font-bold text-navy mb-2">{journey.next_best_action.title}</h2>
            <p className="text-slate-600 mb-4">{journey.next_best_action.why}</p>
            
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Required Documents</h4>
              <div className="flex flex-wrap gap-2">
                {journey.next_best_action.documents.map((doc, idx) => {
                  const docStatus = journey.documents.find(d => d.name === doc)?.status || 'Missing'
                  const isReady = docStatus === 'Available' || docStatus === 'Verified'
                  return (
                    <span key={idx} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border ${isReady ? 'bg-white border-teal text-teal' : 'bg-white border-slate-200 text-slate-600'}`}>
                      {isReady && <CheckCircle2 size={12} />}
                      {doc}
                    </span>
                  )
                })}
              </div>
            </div>

            <Link to="/app/documents" className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy hover:bg-navy/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
              Prepare Records <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Two Column Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Approvals List */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-navy">Priority Approvals</h3>
            <Link to="/app/journey" className="text-sm text-teal font-medium hover:underline">View All</Link>
          </div>
          <div className="p-2 flex-1">
            {journey.approvals.slice(0, 5).map(approval => (
              <div key={approval.id} className="p-3 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between border-b border-transparent hover:border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    approval.status === 'Completed' ? 'bg-teal' : 
                    approval.status === 'Ready to Start' ? 'bg-gold animate-pulse' : 
                    'bg-slate-300'
                  }`} />
                  <div>
                    <div className="font-medium text-navy text-sm">{approval.name}</div>
                    <div className="text-xs text-slate-500">{approval.department}</div>
                  </div>
                </div>
                <Badge tone={statusClass(approval.status)}>{approval.status}</Badge>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Critical Path Info */}
        <motion.div variants={itemVariants} className="bg-navy rounded-xl border border-slate-800 shadow-sm text-white p-6 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal/20 rounded-full blur-2xl pointer-events-none"></div>
          <h3 className="font-bold text-lg mb-2 relative z-10">Critical Path Analysis</h3>
          <p className="text-slate-400 text-sm mb-6 relative z-10 leading-relaxed">
            The longest sequence of dependent approvals. Optimizing these steps will reduce your total timeline.
          </p>
          
          <div className="space-y-4 relative z-10 flex-1">
            {journey.critical_path.steps.slice(0, 4).map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-5 h-5 rounded-full bg-teal/20 border border-teal text-teal flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  {idx < Math.min(3, journey.critical_path.steps.length - 1) && (
                    <div className="w-[1px] h-6 bg-teal/30 my-1"></div>
                  )}
                </div>
                <div className="text-sm font-medium text-slate-200 pt-0.5">{step}</div>
              </div>
            ))}
            {journey.critical_path.steps.length > 4 && (
              <div className="text-xs text-teal mt-2 ml-9">
                + {journey.critical_path.steps.length - 4} more steps
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-end relative z-10">
            <div className="text-xs text-slate-400 max-w-[60%]">{journey.critical_path.label}</div>
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Est. Duration</div>
              <div className="text-2xl font-bold text-teal">{journey.critical_path.days} <span className="text-sm text-teal-100 font-normal">days</span></div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
