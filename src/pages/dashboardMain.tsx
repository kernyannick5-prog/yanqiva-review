import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { DashboardApp } from '../dashboard/DashboardApp'

// Eintrittspunkt des Kunden-Dashboards (/dashboard/)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DashboardApp />
  </StrictMode>,
)
