
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import WhatsAppClicks from '@/pages/admin/WhatsAppClicks';
import Reviews from '@/pages/admin/Reviews';
import Users from '@/pages/admin/Users';
import Settings from '@/pages/admin/Settings';
import Profile from '@/pages/admin/Profile';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { SettingsProvider } from '@/context/SettingsContext';
import { trackVisitor } from '@/lib/tracking';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    trackVisitor();
  }, []);

  return (
    <Router>
      <SettingsProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Routes wrapped in AdminLayout */}
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inquiries" element={<WhatsAppClicks />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SettingsProvider>
    </Router>
  );
}

export default App;