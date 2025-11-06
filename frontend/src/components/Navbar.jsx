import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import useTheme from "../context/useTheme";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-30 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-extrabold text-indigo-600">PodHub</Link>
        <div className="flex items-center gap-3">
          <NavLink to="/" className="hidden md:inline text-sm px-3 py-2 rounded-lg hover:bg-gray-100">Home</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100">Dashboard</NavLink>
              <NavLink to="/upload" className="btn btn-primary text-sm">Upload</NavLink>
              <button onClick={toggleTheme} className="btn btn-outline text-sm">Theme</button>
              <button onClick={() => { logout(); navigate("/"); }} className="text-sm px-3 py-2 hover:text-red-600">Logout</button>
              <span className="hidden sm:inline text-xs text-gray-500">Hi, {user?.name?.split(" ")[0] || "Creator"}</span>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary text-sm">Register</NavLink>
              <button onClick={toggleTheme} className="btn btn-outline text-sm">Theme</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
