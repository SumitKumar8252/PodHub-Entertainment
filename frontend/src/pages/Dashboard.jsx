import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import useFetch from "../hooks/useFetch.js";
import Loader from "../components/Loader.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const isCreator = user?.role === "creator";

  const { data, loading, error } = useFetch(isCreator ? "/episodes/mine" : "/subscriptions/feed", [isCreator]);

  if (loading) return <Loader label="Loading your dashboard..." />;
  if (error) return <p className="text-red-600">{error}</p>;

  const episodes = data?.episodes || [];

  return (
    <section>
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="text-gray-600 mt-1">
        {isCreator ? "Your uploaded episodes & stats" : "Latest from creators you follow"}
      </p>

      {isCreator && (
        <div className="my-4">
          <Link to="/upload" className="btn btn-primary">Upload new episode</Link>
        </div>
      )}

      {episodes.length === 0 ? (
        <p className="text-gray-500 mt-4">No items yet.</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {episodes.map((ep) => (
            <li key={ep._id} className="card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{ep.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{ep.playCount} plays • {ep.commentCount} comments</p>
                </div>
                <Link to={`/podcast/${ep._id}`} className="text-indigo-600 text-sm hover:underline">Open</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
