import { useState } from "react";
import useAuth from "../context/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "listener" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      await register(form);
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card p-6">
      <h2 className="text-xl font-semibold">Create your account</h2>
      <form onSubmit={onSubmit} className="space-y-3 mt-3">
        <div>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" className="input" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} required />
        </div>
        <div>
          <label className="label">Role</label>
          <select className="input" value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})}>
            <option value="listener">Listener</option>
            <option value="creator">Creator</option>
          </select>
        </div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
      </p>
    </div>
  );
}
