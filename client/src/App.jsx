import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Public pages
import HomePage     from './pages/HomePage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Browse & profile
import Marketplace  from './pages/Marketplace';
import Profile      from './pages/Profile';

// Adventure pages
import AdventurePage    from './pages/AdventurePage';
import CreateAdventure  from './pages/CreateAdventure';
import EditAdventure    from './pages/EditAdventure';

// Protected: dashboard
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* ── Public ── */}
          <Route path="/"         element={<HomePage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Public browsing ── */}
          <Route path="/explore"             element={<Marketplace />} />
          <Route path="/profile/:userId"     element={<Profile />} />
          <Route path="/adventure/:id"       element={<AdventurePage />} />

          {/* ── Protected ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/create/adventure" element={
            <ProtectedRoute><CreateAdventure /></ProtectedRoute>
          } />
          <Route path="/adventure/edit/:id" element={
            <ProtectedRoute><EditAdventure /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
