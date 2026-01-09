import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import PosPage from './pages/PosPage';
import AdminLayout from './pages/AdminLayout';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<PosPage />} />
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/admin/products" element={<AdminLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;