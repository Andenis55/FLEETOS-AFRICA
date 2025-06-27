import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Home from './Home.tsx';
import DriverDashboard from './DriverDashboard.tsx';
import TripManager from './TripManager.tsx';
import Drivers from './Drivers.tsx';
import DriverProfile from './DriverProfile.tsx';

ReactGA.initialize('G-XXXXXXX');

const App: React.FC = () => {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl">FLEETOS AFRICA</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/trips" className="hover:underline">Trip Manager</Link>
            <Link to="/drivers" className="hover:underline">Drivers</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DriverDashboard />} />
          <Route path="/trips" element={<TripManager />} />
          <Route path="/drivers/:id" element={<DriverProfile />} />
          <Route path="/drivers" element={<Drivers />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
