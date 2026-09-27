import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Sparkles } from 'lucide-react'
import api from '../../lib/api'
import { useJourneyStore } from '../../store/journeyStore'
import type { ChatMessage } from '../../lib/types'

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: "Namaste! I am your D.W.A.R Approval Advisor. I can guide you through industrial clearances, document requirements, MIDC allotments, MPCB consents, and Maharashtra state industrial subsidies. How can I assist your project today?",
      timestamp: new Date()
    }
  ])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const journey = useJourneyStore(state => state.journey)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMsg].slice(-20))
    setInput('')
    setIsLoading(true)

    try {
      const response = await api.post('/ai/chat/', {
        message: text,
        project_context: journey?.project
      })
      
      const mode = response.data?.mode
      setIsOnline(mode === 'live_ai')

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response.data?.reply || "I didn't receive a response. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg].slice(-20))
    } catch {
      setIsOnline(false)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "The advisory service is currently in offline mode. Please verify that the backend server is running and try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg].slice(-20))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  const quickActions = [
    "Required approvals for my project?",
    "How to obtain MPCB Consent?",
    "MIDC land allotment steps",
    "Eligible Maharashtra subsidies"
  ]

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-50 bottom-0 sm:bottom-24 right-0 sm:right-6 w-full sm:w-[410px] h-[78vh] sm:h-[550px] bg-[var(--surface)] text-[var(--text)] sm:rounded-2xl shadow-2xl flex flex-col border border-[var(--line)] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#102c4f] text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#168579]/30 border border-[#168579]/50 flex items-center justify-center">
                  <Bot size={18} className="text-[#51b7aa]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm tracking-tight text-white">D.W.A.R Advisor</span>
                    <span className="bg-[#168579] text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      AI Assistant
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300">Maharashtra Single-Window Clearance</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Status indicator bar */}
            <div className="bg-[var(--surface-2)] px-4 py-1.5 border-b border-[var(--line)] flex items-center justify-between shrink-0 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isOnline === false ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                <span className="font-medium text-[11px] text-[var(--muted)]">
                  {isOnline === false ? 'Offline Mode' : 'Online & Ready'}
                </span>
              </div>
              <span className="text-[10px] text-[var(--muted)] flex items-center gap-1 font-mono">
                <Sparkles size={11} className="text-[var(--teal)]" /> 24/7 Clearance Guidance
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[var(--bg)]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-[var(--teal)]/15 border border-[var(--teal)]/30 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                      <Bot size={15} className="text-[var(--teal)]" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[84%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm whitespace-pre-wrap ${
                      msg.role === 'user' 
                        ? 'bg-[#168579] text-white font-medium rounded-br-sm shadow-md' 
                        : 'bg-[var(--surface)] text-[var(--text)] rounded-bl-sm border border-[var(--line)]'
                    }`}
                    style={msg.role === 'user' ? { color: '#ffffff', backgroundColor: '#168579' } : undefined}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[var(--teal)]/15 border border-[var(--teal)]/30 flex items-center justify-center shrink-0">
                    <Bot size={15} className="text-[var(--teal)]" />
                  </div>
                  <div className="bg-[var(--surface)] text-[var(--text)] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center border border-[var(--line)] shadow-sm">
                    <span className="w-1.5 h-1.5 bg-[var(--teal)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[var(--teal)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[var(--teal)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick action buttons */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-3.5 py-2 flex flex-wrap gap-1.5 shrink-0 bg-[var(--surface)] border-t border-[var(--line)]">
                {quickActions.map(action => (
                  <button
                    key={action}
                    onClick={() => handleSend(action)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--muted)] hover:border-[var(--teal)] hover:text-[var(--teal)] hover:bg-[var(--teal-soft)] transition-all font-medium"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* Input composer with guaranteed high contrast */}
            <div className="p-3 bg-[var(--surface)] border-t border-[var(--line)] shrink-0">
              <div className="relative flex items-center">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about MIDC, Fire NOC, MPCB, incentives..."
                  className="w-full bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] rounded-xl pl-3.5 pr-11 py-2.5 text-xs focus:outline-none focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] resize-none h-[42px] max-h-[100px] placeholder:text-[var(--muted)]"
                  rows={1}
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-1.5 bg-[#168579] text-white hover:opacity-90 rounded-lg disabled:opacity-40 disabled:hover:opacity-40 transition-opacity shadow-sm"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed z-50 bottom-6 right-6 w-14 h-14 bg-[#102c4f] rounded-full shadow-2xl flex items-center justify-center text-white hover:opacity-95 transition-all border-2 border-[#168579]"
          title="D.W.A.R AI Advisor"
          aria-label="Open DWAR AI Advisor"
        >
          <Bot size={26} className="text-white" />
          <div className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#102c4f]" />
        </motion.button>
      )}
    </>
  )
}
