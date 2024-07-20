// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import Private from './pages/Private';
import Public from './pages/Public';
import MasterDashboard from './pages/MasterDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:municipio" element={<PrivateRoute><Private /></PrivateRoute>} />
        <Route path="/:municipio" element={<Public />} />
        <Route path="/master-dashboard" element={<MasterDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

