import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import DocViewer from './components/DocViewer';
import MobileIngest from './components/MobileIngest';
import SecurityDashboard from './components/SecurityDashboard';
import TimelinePage from './components/TimelinePage';
import manifestData from './docs-manifest.json';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="flex-1 overflow-auto"
  >
    {children}
  </motion.div>
);

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Find active page by location (Route / to landingPage)
  const isLanding = location.pathname === '/';
  const isIngest = location.pathname === '/ingest';
  const isSecurity = location.pathname === '/security';
  const isTimeline = location.pathname === '/timeline';
  
  const findPageByPath = (path) => {
    const slug = path.substring(1).toLowerCase();
    if (!slug) return manifestData.pages.find(p => p.originalId === 'index');
    return manifestData.pages.find(p => p.id.toLowerCase() === slug) || 
           manifestData.pages.find(p => p.originalId === slug);
  };

  const activePage = isLanding ? null : findPageByPath(location.pathname);

  // Sync title
  useEffect(() => {
    if (isLanding) {
      document.title = 'LLM-Wiki | Autonomous Knowledge Engine';
    } else if (activePage) {
      document.title = `${activePage.title} | LLM-Wiki`;
    }
  }, [activePage, isLanding, isIngest, isSecurity]);

  return (
    <div className="flex h-screen overflow-hidden selection:bg-nordic-blue/20">
      {!(isIngest || isSecurity || isTimeline) && (
        <Sidebar 
          manifest={manifestData} 
          activePage={activePage} 
          onPageSelect={(page) => navigate(`/${page.id}`)} 
        />
      )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
          <Route path="/ingest" element={<PageWrapper><MobileIngest /></PageWrapper>} />
          <Route path="/security" element={<PageWrapper><SecurityDashboard /></PageWrapper>} />
          <Route path="/timeline" element={<PageWrapper><TimelinePage /></PageWrapper>} />
          <Route path="/:id" element={<PageWrapper><DocViewer doc={activePage} onBack={() => navigate('/')} /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
