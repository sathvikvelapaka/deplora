import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Deployments from './pages/Deployments';
import Infrastructure from './pages/Infrastructure';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Dashboard searchQuery={searchQuery} />} />
            <Route path="/deployments" element={<Deployments />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
