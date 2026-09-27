import React from 'react'
import { motion } from 'framer-motion'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import type { Journey, Approval } from '../../lib/types'
import { CheckCircle2, Lock } from 'lucide-react'

interface ProgressTrackerProps {
  journey: Journey
}

export function ProgressTracker({ journey }: ProgressTrackerProps) {
  const approvals = journey.approvals
  const completed = approvals.filter(a => a.status === 'Completed').length
  const ready = approvals.filter(a => a.status === 'Ready to Start').length
  const total = approvals.length
  
  // Progress based on Completed + Ready to Start
  const progressPercent = total > 0 ? Math.round(((completed + ready) / total) * 100) : 0
  
  const documentsReady = journey.documents.filter(d => d.status === 'Available' || d.status === 'Verified').length
  const documentsTotal = journey.documents.length
  const readinessPercent = documentsTotal > 0 ? Math.round((documentsReady / documentsTotal) * 100) : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'border-teal bg-teal text-white'
      case 'Ready to Start': return 'border-teal bg-white text-teal'
      case 'Waiting for Dependency': return 'border-slate-200 bg-slate-50 text-slate-400'
      default: return 'border-gold bg-white text-gold'
    }
  }

  const getStatusLine = (status: string) => {
    if (status === 'Completed') return 'bg-teal'
    return 'bg-slate-200 border-dashed border-t-2 border-slate-200 bg-transparent'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col md:flex-row border-b border-slate-100">
        {/* Ring Section */}
        <div className="p-8 flex flex-col items-center justify-center md:border-r border-slate-100 min-w-[240px]">
          <div className="w-32 h-32 mb-4 relative">
            <CircularProgressbar
              value={progressPercent}
              text={`${progressPercent}%`}
              styles={buildStyles({
                pathColor: '#168579', // teal
                textColor: '#102c4f', // navy
                trailColor: '#f1f5f9', // slate-100
                textSize: '24px',
                pathTransitionDuration: 1.5,
              })}
            />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-navy">Journey Progress</h3>
            <p className="text-sm text-slate-500">{completed} of {total} completed</p>
          </div>
        </div>

        {/* Phase Breakdown */}
        <div className="p-6 md:p-8 flex-1 overflow-x-auto">
          <h3 className="font-bold text-navy mb-6">Approval Pipeline</h3>
          <div className="flex items-start min-w-[600px]">
            {approvals.map((approval, idx) => (
              <div key={approval.id} className="relative flex-1 flex flex-col items-center">
                {/* Connecting Line */}
                {idx < approvals.length - 1 && (
                  <div className={`absolute top-4 left-[50%] w-full h-[2px] ${getStatusLine(approval.status)} -z-10`} />
                )}
                
                {/* Node */}
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-3 bg-white z-10 ${getStatusColor(approval.status)} ${approval.status === 'Ready to Start' ? 'shadow-[0_0_0_4px_rgba(22,133,121,0.1)] animate-pulse' : ''}`}>
                  {approval.status === 'Completed' ? <CheckCircle2 size={16} /> : 
                   approval.status === 'Waiting for Dependency' ? <Lock size={14} /> : 
                   <div className="w-2 h-2 rounded-full currentColor bg-current" />}
                </div>
                
                {/* Label */}
                <div className="text-center px-2">
                  <div className="text-xs font-bold text-navy leading-tight mb-1">{approval.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">{approval.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 bg-slate-50">
        <motion.div variants={itemVariants} className="p-4 flex flex-col justify-center">
          <span className="text-xs text-slate-500 uppercase font-semibold mb-1">Documents Ready</span>
          <span className="text-xl font-bold text-navy">{documentsReady} <span className="text-sm font-normal text-slate-400">/ {documentsTotal}</span></span>
        </motion.div>
        
        <motion.div variants={itemVariants} className="p-4 flex flex-col justify-center">
          <span className="text-xs text-slate-500 uppercase font-semibold mb-1">Approvals Started</span>
          <span className="text-xl font-bold text-navy">{completed + ready}</span>
        </motion.div>

        <motion.div variants={itemVariants} className="p-4 flex flex-col justify-center">
          <span className="text-xs text-slate-500 uppercase font-semibold mb-1">Critical Path</span>
          <span className="text-xl font-bold text-navy">{journey.critical_path.days} <span className="text-sm font-normal text-slate-400">days</span></span>
        </motion.div>

        <motion.div variants={itemVariants} className="p-4 flex flex-col justify-center">
          <span className="text-xs text-slate-500 uppercase font-semibold mb-2">Readiness</span>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-teal" style={{ width: `${readinessPercent}%` }}></div>
            </div>
            <span className="text-sm font-bold text-navy">{readinessPercent}%</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
