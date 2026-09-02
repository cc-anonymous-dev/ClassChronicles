import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { ZoomProvider } from './lib/ZoomContext'
import RottaProtetta from './lib/RottaProtetta'
import Ingresso from './pages/Ingresso'
import Onboarding from './pages/Onboarding'
import Benvenuto from './pages/Benvenuto'
import Accedi from './pages/Accedi'
import Feed from './pages/Feed'
import CreaPost from './pages/CreaPost'
import Admin from './pages/Admin'
import Profilo from './pages/Profilo'
import Impostazioni from './pages/Impostazioni'
import MembriClasse from './pages/MembriClasse'
import RegolePrivacy from './pages/RegolePrivacy'
import Bannato from './pages/Bannato'

function App() {
  return (
    <AuthProvider>
      <ZoomProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Ingresso />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/benvenuto" element={<Benvenuto />} />
            <Route path="/accedi" element={<Accedi />} />
            <Route path="/regole" element={<RegolePrivacy />} />
            <Route path="/bannato" element={<Bannato />} />

            <Route
              path="/feed"
              element={
                <RottaProtetta>
                  <Feed />
                </RottaProtetta>
              }
            />
            <Route
              path="/crea"
              element={
                <RottaProtetta>
                  <CreaPost />
                </RottaProtetta>
              }
            />
            <Route
              path="/admin"
              element={
                <RottaProtetta>
                  <Admin />
                </RottaProtetta>
              }
            />
            <Route
              path="/profilo"
              element={
                <RottaProtetta>
                  <Profilo />
                </RottaProtetta>
              }
            />
            <Route
              path="/impostazioni"
              element={
                <RottaProtetta>
                  <Impostazioni />
                </RottaProtetta>
              }
            />
            <Route
              path="/membri"
              element={
                <RottaProtetta>
                  <MembriClasse />
                </RottaProtetta>
              }
            />
          </Routes>
        </BrowserRouter>
      </ZoomProvider>
    </AuthProvider>
  )
}

export default App
