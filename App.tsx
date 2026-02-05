import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ContestListPage from './pages/ContestListPage';
import CalendarPage from './pages/CalendarPage';
import GuidePage from './pages/GuidePage';
import FeedbackPage from './pages/FeedbackPage';
import IcPblMileagePage from './pages/benefits/IcPblMileagePage';
import BigoMileageScholarshipPage from './pages/benefits/BigoMileageScholarshipPage';
import StartupClubSupportPage from './pages/benefits/StartupClubSupportPage';


const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contests" element={<ContestListPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/benefits/icpbl-mileage" element={<IcPblMileagePage />} />
          <Route path="/benefits/bigo-mileage-scholarship" element={<BigoMileageScholarshipPage />} />
          <Route path="/benefits/startup-club-support" element={<StartupClubSupportPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
