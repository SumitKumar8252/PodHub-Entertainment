import { useState } from "react";
import useAuth from "../context/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card p-6">
      <h2 className="text-xl font-semibold">Welcome back</h2>
      <p className="text-sm text-gray-500 mb-4">Log in to continue</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        New here? <Link to="/register" className="text-indigo-600 hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
