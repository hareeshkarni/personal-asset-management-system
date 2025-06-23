import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddAssetPage from './pages/AddAssetPage';
import EditAssetPage from './pages/EditAssetPage';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage'; // ✅ New import


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/add-asset" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <AddAssetPage />
          </ProtectedRoute>
        } />

        <Route path="/edit-asset/:id" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <EditAssetPage />
          </ProtectedRoute>
        } />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="*" element={<NotFoundPage />} /> {/* ✅ 404 fallback */}
      </Routes>
    </Router>
  );
}

export default App;
