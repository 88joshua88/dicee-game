import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import CreateAdventurePage from './pages/CreateAdventurePage';
import FindAdventurePage from './pages/FindAdventurePage';
import AdventurePage from './pages/AdventurePage';

/**
 * App — root component, sets up routing and global layout
 */
function App() {
  return (
    <BrowserRouter>
      {/* Navbar appears on every page */}
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-adventure" element={<CreateAdventurePage />} />
        <Route path="/find-adventures" element={<FindAdventurePage />} />
        <Route path="/adventure/:id" element={<AdventurePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
