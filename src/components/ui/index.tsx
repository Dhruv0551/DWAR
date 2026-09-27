import React from 'react'
import { CheckCircle2, Sparkles, LoaderCircle, X } from 'lucide-react'

// ── Badge ──
interface BadgeProps {
  children: React.ReactNode
  tone?: string
}

export function Badge({ children, tone = '' }: BadgeProps) {
  return <span className={`badge ${tone}`}>{children}</span>
}

// ── Button ──
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  kind?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export function Button({ children, onClick, kind = 'primary', disabled = false, type = 'button', className = '' }: ButtonProps) {
  return (
    <button
      type={type}
      className={`button ${kind} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ── PageTitle ──
interface PageTitleProps {
  eyebrow: string
  title: string
  children?: React.ReactNode
  action?: React.ReactNode
}

export function PageTitle({ eyebrow, title, children, action }: PageTitleProps) {
  return (
    <div className="page-title enter">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        {children}
      </div>
      {action}
    </div>
  )
}

// ── Metric ──
interface MetricProps {
  value: string | number
  label: string
  trend?: string
}

export function Metric({ value, label, trend }: MetricProps) {
  return (
    <article className="metric enter">
      <strong>{value}</strong>
      <span>{label}</span>
      {trend && <small>{trend}</small>}
    </article>
  )
}

// ── Loading ──
export function Loading() {
  return (
    <div className="loading">
      <LoaderCircle className="spin" />
      Preparing your workspace…
    </div>
  )
}

// ── Empty ──
interface EmptyProps {
  title: string
  body: string
  action?: React.ReactNode
}

export function Empty({ title, body, action }: EmptyProps) {
  return (
    <section className="empty">
      <div className="empty-icon"><Sparkles /></div>
      <h2>{title}</h2>
      <p>{body}</p>
      {action}
    </section>
  )
}

// ── Modal ──
interface ModalProps {
  title: string
  children: React.ReactNode
  onClose: () => void
}

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <section className="modal">
        <div className="panel-head">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose}><X /></button>
        </div>
        {children}
      </section>
    </div>
  )
}

// ── Toast (inline display component, not the manager) ──
interface ToastProps {
  text: string
  kind?: string
  onClose: () => void
}

export function Toast({ text, kind = '', onClose }: ToastProps) {
  return (
    <div className={`toast ${kind}`}>
      <CheckCircle2 size={17} />
      {text}
      <button onClick={onClose}><X size={15} /></button>
    </div>
  )
}

// ── Utility functions ──
export const money = (n: number) => n ? `₹${(n / 100000).toLocaleString('en-IN')} lakhs` : 'Not specified'
export const statusClass = (x: string) => x.toLowerCase().replaceAll(' ', '-')
