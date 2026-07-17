import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import BrandPage from './components/BrandPage';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Topbar />
      <div className="app__body">
        <Sidebar />
        <BrandPage />
      </div>
    </div>
  );
}
