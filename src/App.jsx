import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Stadiums from './pages/Stadiums';
import StadiumDetail from './pages/StadiumDetail';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerRoute from './components/OwnerRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-white">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stadiums" element={<Stadiums />} />
          <Route path="/stadiums/:id" element={<StadiumDetail />} />
          <Route path="/stadiums/:id/book" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/owner/dashboard" element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
