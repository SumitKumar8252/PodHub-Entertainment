import { useState, useRef } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function UploadPodcast() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const audioProbeRef = useRef(new Audio());

  const validateDuration = (f) => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(f);
      const audio = audioProbeRef.current;
      audio.src = url;
      audio.addEventListener("loadedmetadata", () => {
        URL.revokeObjectURL(url);
        const d = audio.duration;
        if (isNaN(d)) return resolve(true); // backend will enforce here
        if (d <= 180.5) resolve(true);
        else reject(new Error("Audio must be 3 minutes (180s) or less."));
      }, { once: true });
      audio.addEventListener("error", () => reject(new Error("Unable to read audio metadata.")), { once: true });
    });
  };

  const onFile = (e) => setFile(e.target.files?.[0] || null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!file) return setErr("Please select an audio file (mp3, m4a, wav).");

    try {
      setLoading(true);
      await validateDuration(file);

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("audio", file);

      const res = await api.post("/episodes", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/podcast/${res.data.episode._id}`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto card p-6">
      <h2 className="text-xl font-semibold">Upload new episode</h2>
      <p className="text-sm text-gray-500 mb-4">Limit: 3 minutes (180 seconds)</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[100px]" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
        </div>
        <div>
          <label className="label">Audio File</label>
          <input className="input" type="file" accept="audio/*" onChange={onFile} />
          <p className="text-xs text-gray-500 mt-1">Supported: mp3, m4a, wav. Size depends on backend limits.</p>
        </div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
