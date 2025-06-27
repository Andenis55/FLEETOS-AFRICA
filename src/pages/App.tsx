import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import DriverDashboard from './DriverDashboard';
import TripManager from './TripManager';
import Drivers from './Drivers';
import DriverProfile from './DriverProfile';

const App: React.FC = () => {
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
