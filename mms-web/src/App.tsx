import { useState } from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import BrandPage from './components/BrandPage';
import { applyColorMode, getStoredColorMode, type ColorMode } from './colorMode';
import './App.css';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [colorMode, setColorMode] = useState<ColorMode>(getStoredColorMode());

  const toggleColorMode = () => {
    const next: ColorMode = colorMode === 'mms' ? 'mma' : 'mms';
    setColorMode(next);
    applyColorMode(next);
  };

  return (
    <div className="app">
      <Topbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
        colorMode={colorMode}
        onToggleColorMode={toggleColorMode}
      />
      <div className="app__body">
        <Sidebar collapsed={sidebarCollapsed} />
        <BrandPage />
      </div>
    </div>
  );
}
