import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Public pages
import HomePage     from './pages/HomePage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected pages — generic energy system
import Dashboard    from './pages/Dashboard';
import CreateEnergy from './pages/CreateEnergy';
import Marketplace  from './pages/Marketplace';
import Profile      from './pages/Profile';

// Article pages
import CreateArticle from './pages/CreateArticle';
import ArticleManage from './pages/ArticleManage';
import ArticlePage   from './pages/ArticlePage';

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
          <Route path="/marketplace"     element={<Marketplace />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/article/:id"     element={<ArticlePage />} />

          {/* ── Protected ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/create-energy" element={
            <ProtectedRoute><CreateEnergy /></ProtectedRoute>
          } />
          <Route path="/create/article" element={
            <ProtectedRoute><CreateArticle /></ProtectedRoute>
          } />
          <Route path="/article/manage/:id" element={
            <ProtectedRoute><ArticleManage /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
