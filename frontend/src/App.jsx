import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AccessibilityToolbar from './components/common/AccessibilityToolbar';
import VoiceCommandWrapper from './components/common/VoiceCommandWrapper'; // 👈 NEW import

import Home from './pages/Home';
import MobilityAssistance from './pages/MobilityAssistance';
import HealthcareSupport from './pages/HealthcareSupport';
import EducationTraining from './pages/EducationTraining';
import Community from './pages/Community';
import GovernmentPrograms from './pages/GovernmentPrograms';
import CaregiverSupport from './pages/CaregiverSupport';
import MentalHealth from './pages/MentalHealth';
import LegalRights from './pages/LegalRights';
import EmergencyServices from './pages/EmergencyServices';
import Contact from './pages/Contact';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ProfileUpdate from './pages/ProfileUpdate';
import NotFound from './pages/NotFound';

import useAccessibility from './hooks/useAccessibility';
import './assets/styles/global.css';

const AccessibilityWrapper = ({ children }) => {
  const { highContrast, fontSize } = useAccessibility();

  useEffect(() => {
    const root = document.documentElement;

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${fontSize}`);
  }, [highContrast, fontSize]);

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AccessibilityProvider>
          <VoiceCommandWrapper> {/* ✅ useVoiceCommands is now safe here */}
            <AccessibilityWrapper>
              <div className="min-h-screen d-flex flex-column">
                <AccessibilityToolbar />
                <Header />

                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/mobility-assistance" element={<MobilityAssistance />} />
                    <Route path="/healthcare-support" element={<HealthcareSupport />} />
                    <Route path="/education-training" element={<EducationTraining />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/government-programs" element={<GovernmentPrograms />} />
                    <Route path="/caregiver-support" element={<CaregiverSupport />} />
                    <Route path="/mental-health" element={<MentalHealth />} />
                    <Route path="/legal-rights" element={<LegalRights />} />
                    <Route path="/emergency-services" element={<EmergencyServices />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<ProfileUpdate />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>

                <Footer />
              </div>
            </AccessibilityWrapper>
          </VoiceCommandWrapper>
        </AccessibilityProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
