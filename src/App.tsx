import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useStore } from './state/store'
import { Toast } from './components/Toast'
import { SignIn } from './screens/SignIn'
import { EmailAuth } from './screens/EmailAuth'
import { Onboarding } from './screens/Onboarding'
import { Home } from './screens/Home'
import { ActivityPlayer } from './screens/ActivityPlayer'
import { Solve } from './screens/Solve'
import { Grow } from './screens/Grow'
import { Journey } from './screens/Journey'
import { Forest } from './screens/Forest'
import { ChildProfile, ChildEdit } from './screens/ChildProfile'
import { Settings } from './screens/Settings'
import { BloomReport, Climb } from './screens/JourneyExtras'
import { Chats, Solutions, Library } from './screens/JourneyLists'

function Gate({ children }: { children: ReactNode }) {
  const { s } = useStore()
  if (!s.signedIn) return <Navigate to="/sign-in" replace />
  if (!s.onboarded) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

export function App() {
  const { s } = useStore()
  const loc = useLocation()
  const start = !s.signedIn ? '/sign-in' : !s.onboarded ? '/onboarding' : '/home'
  return (
    <div className="app">
      <Routes location={loc}>
        <Route path="/" element={<Navigate to={start} replace />} />
        <Route path="/sign-in" element={s.signedIn ? <Navigate to={start} replace /> : <SignIn />} />
        <Route path="/auth/email" element={<EmailAuth />} />
        <Route path="/onboarding" element={s.signedIn ? <Onboarding /> : <Navigate to="/sign-in" replace />} />
        <Route path="/home" element={<Gate><Home /></Gate>} />
        <Route path="/activity/:id" element={<Gate><ActivityPlayer /></Gate>} />
        <Route path="/solve" element={<Gate><Solve /></Gate>} />
        <Route path="/grow" element={<Gate><Grow /></Gate>} />
        <Route path="/journey" element={<Gate><Journey /></Gate>} />
        <Route path="/journey/forest" element={<Gate><Forest /></Gate>} />
        <Route path="/journey/child" element={<Gate><ChildProfile /></Gate>} />
        <Route path="/journey/child/edit" element={<Gate><ChildEdit /></Gate>} />
        <Route path="/journey/climb" element={<Gate><Climb /></Gate>} />
        <Route path="/journey/bloom" element={<Gate><BloomReport /></Gate>} />
        <Route path="/journey/settings" element={<Gate><Settings /></Gate>} />
        <Route path="/journey/chats" element={<Gate><Chats /></Gate>} />
        <Route path="/journey/solutions" element={<Gate><Solutions /></Gate>} />
        <Route path="/journey/library" element={<Gate><Library /></Gate>} />
        <Route path="*" element={<Navigate to={start} replace />} />
      </Routes>
      <div className="edge-dock" aria-hidden />
      <Toast />
    </div>
  )
}
