import { useState } from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import BrandPage from './components/BrandPage';
import './App.css';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app">
      <Topbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
      />
      <div className="app__body">
        <Sidebar collapsed={sidebarCollapsed} />
        <BrandPage />
      </div>
    </div>
  );
}
