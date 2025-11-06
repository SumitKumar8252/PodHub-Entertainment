import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import Loader from "../components/Loader.jsx";
import AudioPlayer from "../components/AudioPlayer.jsx";
import useAuth from "../context/useAuth";

export default function PodcastDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [episode, setEpisode] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSub, setIsSub] = useState(false);

  const load = async () => {
    setLoading(true); setErr("");
    try {
      const [eRes, cRes, sRes] = await Promise.all([
        api.get(`/episodes/${id}`),
        api.get(`/comments/${id}`),
        api.get(`/subscriptions/status/${id}`).catch(()=>({ data:{ subscribed:false }}))
      ]);
      setEpisode(eRes.data.episode);
      setComments(cRes.data.comments || []);
      setIsSub(Boolean(sRes.data?.subscribed));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const postComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/comments/${id}`, { text: commentText.trim() });
      setComments((c) => [res.data.comment, ...c]);
      setCommentText("");
    } catch (e) { alert(e.message); }
  };

  const toggleSub = async () => {
    try {
      if (isSub) {
        await api.delete(`/subscriptions/${episode.podcastId}`);
        setIsSub(false);
      } else {
        await api.post(`/subscriptions/${episode.podcastId}`);
        setIsSub(true);
      }
    } catch (e) { alert(e.message); }
  };

  if (loading) return <Loader label="Loading episode..." />;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!episode) return <p>Not found.</p>;

  return (
    <section className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 card p-5">
        <h1 className="text-2xl font-bold">{episode.title}</h1>
        <p className="text-sm text-gray-500 mt-1">by {episode.creatorName}</p>
        <div className="mt-4">
          <AudioPlayer src={episode.streamUrl} title={episode.description} />
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-3">
          <span>{episode.playCount} plays</span>
          <span>{episode.downloadCount} downloads</span>
          <span>{episode.commentCount} comments</span>
        </div>
      </div>

      <aside className="card p-5">
        <h3 className="font-semibold">Podcast</h3>
        <p className="text-sm text-gray-600">{episode.podcastTitle}</p>
        {isAuthenticated && (
          <button className="btn btn-primary mt-3 w-full" onClick={toggleSub}>
            {isSub ? "Unsubscribe" : "Subscribe"}
          </button>
        )}
        {!isAuthenticated && <p className="text-xs text-gray-500 mt-2">Login to subscribe.</p>}
      </aside>

      <div className="md:col-span-3 card p-5">
        <h3 className="font-semibold">Comments</h3>
        {isAuthenticated ? (
          <div className="flex gap-2 mt-3">
            <input className="input" placeholder="Write a comment..."
              value={commentText} onChange={(e)=>setCommentText(e.target.value)} />
            <button className="btn btn-primary" onClick={postComment}>Post</button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">Login to comment.</p>
        )}
        <ul className="mt-4 space-y-3">
          {comments.length === 0 && <p className="text-gray-500 text-sm">No comments yet.</p>}
          {comments.map((c) => (
            <li key={c._id} className="border rounded-xl p-3">
              <p className="text-sm">{c.text}</p>
              <p className="text-xs text-gray-400 mt-1">by {c.userName} • {new Date(c.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
