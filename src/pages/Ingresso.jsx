import { Navigate } from 'react-router-dom'
import { onboardingGiaVisto } from './Onboarding'

export default function Ingresso() {
  if (onboardingGiaVisto()) {
    return <Navigate to="/benvenuto" replace />
  }
  return <Navigate to="/onboarding" replace />
}
