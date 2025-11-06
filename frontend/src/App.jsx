import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PodcastDetails from "./pages/PodcastDetails.jsx";
import UploadPodcast from "./pages/UploadPodcast.jsx";
import NotFound from "./pages/NotFound.jsx";
import useAuth from "./context/useAuth";
import { motion as Motion } from "framer-motion";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main
        className="container mx-auto w-full px-4 py-6 flex-1"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPodcast />
              </ProtectedRoute>
            }
          />
          <Route path="/podcast/:id" element={<PodcastDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
      <Footer />
    </div>
  );
}
