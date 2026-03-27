import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Public pages
import HomePage     from './pages/HomePage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected pages
import Dashboard    from './pages/Dashboard';
import CreateEnergy from './pages/CreateEnergy';
import Marketplace  from './pages/Marketplace';
import Profile      from './pages/Profile';

/**
 * App — root component.
 * AuthProvider wraps the whole tree so any component can access auth state.
 * ProtectedRoute guards pages that require a logged-in session.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Public */}
          <Route path="/"         element={<HomePage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Public browsing */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile/:userId" element={<Profile />} />

          {/* Protected — require auth */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/create-energy" element={
            <ProtectedRoute><CreateEnergy /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
